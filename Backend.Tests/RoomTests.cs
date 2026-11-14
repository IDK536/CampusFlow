using System.Data.Common;
using System.IdentityModel.Tokens.Jwt;
using System.Globalization;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using CampusFlow.Api.Contracts;
using CampusFlow.Api.Data;
using CampusFlow.Api.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Xunit;

namespace CampusFlow.Api.Tests;

public sealed class RoomTests : IAsyncLifetime
{
    private readonly string suffix = Guid.NewGuid().ToString("N");
    private readonly DateOnly date = DateOnly.FromDateTime(DateTime.Now).AddDays(1);
    private readonly QueryCounter counter = new();
    private readonly string signingKey = Convert.ToBase64String(RandomNumberGenerator.GetBytes(48));
    private string connection = null!;
    private WebApplicationFactory<Program> factory = null!;
    private HttpClient client = null!;
    private User user = null!;
    private Room[] rooms = [];
    private string DateText => date.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);

    public async Task InitializeAsync()
    {
        DotNetEnv.Env.NoClobber().TraversePath().Load();
        connection = Environment.GetEnvironmentVariable("CAMPUSFLOW_TEST_CONNECTION")
            ?? throw new InvalidOperationException("CAMPUSFLOW_TEST_CONNECTION is required.");
        if (new Npgsql.NpgsqlConnectionStringBuilder(connection).Database != "campusflow_test")
            throw new InvalidOperationException("Room tests require campusflow_test.");
        await using var db = CreateDbContext();
        await db.Database.OpenConnectionAsync();
        await db.Database.MigrateAsync();
        user = new User { Login = "rooms_" + suffix, DisplayName = "Room Test", Role = "student" };
        user.PasswordHash = new PasswordHasher<User>().HashPassword(user, "password");
        rooms =
        [
            new() { Name = suffix + "_booked", Building = "A", Floor = 1, Capacity = 30, Equipment = ["projector", "whiteboard"] },
            new() { Name = suffix + "_projector", Building = "A", Floor = 2, Capacity = 40, Equipment = ["projector"] },
            new() { Name = suffix + "_full", Building = "B", Floor = 1, Capacity = 20, Equipment = ["whiteboard", "computers"] },
            new() { Name = suffix + "_free", Building = "A", Floor = 3, Capacity = 50, Equipment = ["projector", "whiteboard"] }
        ];
        db.Users.Add(user);
        db.Rooms.AddRange(rooms);
        await db.SaveChangesAsync();
        db.Bookings.AddRange(
            new Booking { RoomId = rooms[0].Id, UserId = user.Id, Date = date, StartTime = new(9, 0), EndTime = new(10, 30) },
            new Booking { RoomId = rooms[0].Id, UserId = user.Id, Date = date, StartTime = new(12, 0), EndTime = new(14, 0) },
            new Booking { RoomId = rooms[0].Id, UserId = user.Id, Date = date, StartTime = new(14, 0), EndTime = new(16, 0), Status = "cancelled" },
            new Booking { RoomId = rooms[0].Id, UserId = user.Id, Date = date.AddDays(1), StartTime = new(15, 0), EndTime = new(16, 0) },
            new Booking { RoomId = rooms[2].Id, UserId = user.Id, Date = date, StartTime = new(9, 0), EndTime = new(18, 0) });
        await db.SaveChangesAsync();
        factory = new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
        {
            builder.ConfigureAppConfiguration((_, configuration) => configuration.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:CampusFlow"] = connection,
                ["Jwt:Key"] = signingKey, ["Jwt:Issuer"] = "CampusFlow", ["Jwt:Audience"] = "CampusFlowClient"
            }));
            builder.ConfigureServices(services => services.AddDbContext<CampusFlowDbContext>((_, options) => options.AddInterceptors(counter)));
        });
        client = factory.CreateClient(new WebApplicationFactoryClientOptions { BaseAddress = new Uri("https://localhost"), HandleCookies = false });
        using var login = await client.PostAsJsonAsync("/api/auth/login", new { login = user.Login, password = "password" });
        login.EnsureSuccessStatusCode();
        var auth = await login.Content.ReadFromJsonAsync<AuthResponse>();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", auth!.Token);
        counter.Reads = 0;
    }

    public async Task DisposeAsync()
    {
        client?.Dispose();
        if (factory is not null)
            await factory.DisposeAsync();
        if (connection is null)
            return;
        await using var db = CreateDbContext();
        await using var transaction = await db.Database.BeginTransactionAsync();
        var userIds = db.Users.Where(item => item.Login == "rooms_" + suffix).Select(item => item.Id);
        await db.RefreshTokens.Where(token => userIds.Contains(token.UserId)).ExecuteDeleteAsync();
        await db.Bookings.Where(booking => userIds.Contains(booking.UserId)).ExecuteDeleteAsync();
        var roomIds = rooms.Select(room => room.Id).ToArray();
        await db.Rooms.Where(room => roomIds.Contains(room.Id) || room.Name.StartsWith(suffix + "_")).ExecuteDeleteAsync();
        await db.Users.Where(item => item.Login == "rooms_" + suffix).ExecuteDeleteAsync();
        await transaction.CommitAsync();
    }

    [Theory]
    [InlineData("student")]
    [InlineData("admin")]
    public async Task BothRolesCanReadRoomListCardAndFreeSlots(string role)
    {
        await using var db = CreateDbContext();
        await db.Users.Where(item => item.Id == user.Id).ExecuteUpdateAsync(update => update.SetProperty(item => item.Role, role));
        using var login = await client.PostAsJsonAsync("/api/auth/login", new { login = user.Login, password = "password" });
        var auth = await login.Content.ReadFromJsonAsync<AuthResponse>();
        client.DefaultRequestHeaders.Authorization = new("Bearer", auth!.Token);

        var list = await client.GetFromJsonAsync<RoomResponse[]>("/api/rooms");
        var card = await client.GetFromJsonAsync<RoomResponse>($"/api/rooms/{rooms[0].Id}");
        using var slots = await client.GetAsync($"/api/rooms/{rooms[0].Id}/free-slots?date={DateText}");

        Assert.All(rooms, room => Assert.Contains(list!, item => item.Id == room.Id));
        Assert.Equal(list!.Select(item => item.Id).Order(), list!.Select(item => item.Id));
        Assert.Equal(rooms[0].Name, card!.Name);
        Assert.Equal(rooms[0].Equipment, card.Equipment);
        Assert.Equal(HttpStatusCode.OK, slots.StatusCode);
    }

    [Theory]
    [InlineData("?building=A", 0, 1, 3)]
    [InlineData("?minCapacity=40", 1, 3)]
    [InlineData("?equipment=whiteboard", 0, 2, 3)]
    [InlineData("?building=A&minCapacity=30&equipment=projector,whiteboard", 0, 3)]
    [InlineData("?equipment=projector,%20whiteboard,projector", 0, 3)]
    public async Task FiltersReturnOnlyMatchingRooms(string query, params int[] expectedIndexes)
    {
        var ownIds = rooms.Select(room => room.Id).ToArray();
        var expected = expectedIndexes.Select(index => rooms[index].Id).Order().ToArray();

        var result = await client.GetFromJsonAsync<RoomResponse[]>("/api/rooms" + query);

        Assert.Equal(expected, result!.Where(room => ownIds.Contains(room.Id)).Select(room => room.Id).Order());
    }

    [Fact]
    public async Task AvailabilityUsesTwoQueriesAndMaximalIntervals()
    {
        var path = "/api/rooms?date=" + DateText;

        var result = await client.GetFromJsonAsync<AvailableRoomsResponse>(path);
        var queryCount = counter.Reads;

        Assert.Equal(DateText, result!.Date);
        Assert.Equal(2, queryCount);
        Assert.Equal([new FreeSlotResponse("10:30", "12:00"), new FreeSlotResponse("14:00", "18:00")],
            result.Rooms.Single(room => room.Id == rooms[0].Id).FreeSlots);
        Assert.Equal([new FreeSlotResponse("09:00", "18:00")], result.Rooms.Single(room => room.Id == rooms[1].Id).FreeSlots);
        Assert.Empty(result.Rooms.Single(room => room.Id == rooms[2].Id).FreeSlots);
    }

    [Theory]
    [InlineData("10:30", "12:00", true)]
    [InlineData("14:00", "16:00", true)]
    [InlineData("10:00", "11:00", false)]
    [InlineData("11:00", "13:00", false)]
    [InlineData("09:00", "18:00", false)]
    public async Task IntervalSearchRequiresTheWholeIntervalToBeFree(string start, string end, bool bookedRoomFits)
    {
        var path = $"/api/rooms?building=A&equipment=projector,whiteboard&date={DateText}&startTime={start}&endTime={end}";

        var result = await client.GetFromJsonAsync<AvailableRoomsResponse>(path);

        Assert.Equal(bookedRoomFits, result!.Rooms.Any(room => room.Id == rooms[0].Id));
        Assert.Contains(result.Rooms, room => room.Id == rooms[3].Id);
        Assert.DoesNotContain(result.Rooms, room => room.Id == rooms[1].Id || room.Id == rooms[2].Id);
    }

    [Fact]
    public async Task AdjacentBookingsMergeIntoOneOccupiedInterval()
    {
        await using var db = CreateDbContext();
        db.Bookings.Add(new Booking { UserId = user.Id, RoomId = rooms[0].Id, Date = date, StartTime = new(10, 30), EndTime = new(12, 0) });
        await db.SaveChangesAsync();

        var result = await client.GetFromJsonAsync<RoomFreeSlotsResponse>($"/api/rooms/{rooms[0].Id}/free-slots?date={DateText}");

        Assert.Equal(rooms[0].Id, result!.RoomId);
        Assert.Equal(DateText, result.Date);
        Assert.Equal([new FreeSlotResponse("14:00", "18:00")], result.FreeSlots);
    }

    [Fact]
    public async Task EmptyResultsUseSuccessfulArrayOrEnvelope()
    {
        var filter = "minCapacity=2147483647";

        var list = await client.GetFromJsonAsync<RoomResponse[]>("/api/rooms?" + filter);
        var result = await client.GetFromJsonAsync<AvailableRoomsResponse>($"/api/rooms?{filter}&date={DateText}");
        var full = await client.GetFromJsonAsync<RoomFreeSlotsResponse>($"/api/rooms/{rooms[2].Id}/free-slots?date={DateText}");

        Assert.Empty(list!);
        Assert.Empty(result!.Rooms);
        Assert.Equal(DateText, result.Date);
        Assert.Empty(full!.FreeSlots);
    }

    [Theory]
    [InlineData("building=Z")]
    [InlineData("building=a")]
    [InlineData("building=")]
    [InlineData("minCapacity=0")]
    [InlineData("minCapacity=-1")]
    [InlineData("minCapacity=abc")]
    [InlineData("minCapacity=1.5")]
    [InlineData("minCapacity=")]
    [InlineData("equipment=printer")]
    [InlineData("equipment=Projector")]
    [InlineData("equipment=")]
    [InlineData("equipment=projector,")]
    [InlineData("date=")]
    [InlineData("date=2026-02-29")]
    [InlineData("date=2035-1-01")]
    [InlineData("date=2000-01-01")]
    [InlineData("startTime=09:00&endTime=10:00")]
    [InlineData("date=2035-01-01&startTime=09:00")]
    [InlineData("date=2035-01-01&endTime=10:00")]
    [InlineData("date=2035-01-01&startTime=09:00:00&endTime=10:00")]
    [InlineData("date=2035-01-01&startTime=9:00&endTime=10:00")]
    [InlineData("date=2035-01-01&startTime=09:15&endTime=10:00")]
    [InlineData("date=2035-01-01&startTime=08:30&endTime=10:00")]
    [InlineData("date=2035-01-01&startTime=17:30&endTime=18:30")]
    [InlineData("date=2035-01-01&startTime=10:00&endTime=10:00")]
    [InlineData("date=2035-01-01&startTime=11:00&endTime=10:00")]
    public async Task InvalidFiltersReturnValidationError(string query)
    {
        var path = "/api/rooms?" + query;

        using var response = await client.GetAsync(path);
        var error = await response.Content.ReadFromJsonAsync<ApiError>();

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal("VALIDATION_ERROR", error!.Code);
    }

    [Theory]
    [InlineData("")]
    [InlineData("?date=")]
    [InlineData("?date=bad")]
    [InlineData("?date=2000-01-01")]
    public async Task FreeSlotsRequireValidDate(string query)
    {
        var path = $"/api/rooms/{rooms[0].Id}/free-slots{query}";

        using var response = await client.GetAsync(path);
        var error = await response.Content.ReadFromJsonAsync<ApiError>();

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal("VALIDATION_ERROR", error!.Code);
    }

    [Theory]
    [InlineData("/api/rooms/0", HttpStatusCode.NotFound, "ROOM_NOT_FOUND")]
    [InlineData("/api/rooms/-1", HttpStatusCode.NotFound, "ROOM_NOT_FOUND")]
    [InlineData("/api/rooms/2147483647", HttpStatusCode.NotFound, "ROOM_NOT_FOUND")]
    [InlineData("/api/rooms/text", HttpStatusCode.BadRequest, "VALIDATION_ERROR")]
    [InlineData("/api/rooms/0/free-slots?date=2035-01-01", HttpStatusCode.NotFound, "ROOM_NOT_FOUND")]
    public async Task InvalidOrMissingRoomReturnsContractError(string path, HttpStatusCode status, string code)
    {
        var requestPath = path;

        using var response = await client.GetAsync(requestPath);
        var error = await response.Content.ReadFromJsonAsync<ApiError>();

        Assert.Equal(status, response.StatusCode);
        Assert.Equal(code, error!.Code);
    }

    [Theory]
    [InlineData("/api/rooms")]
    [InlineData("/api/rooms?date=2035-01-01")]
    [InlineData("/api/rooms/1")]
    [InlineData("/api/rooms/1/free-slots?date=2035-01-01")]
    public async Task MissingTokenReturnsUnauthorized(string path)
    {
        client.DefaultRequestHeaders.Authorization = null;

        using var response = await client.GetAsync(path);
        var error = await response.Content.ReadFromJsonAsync<ApiError>();

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        Assert.Equal("UNAUTHORIZED", error!.Code);
    }

    [Fact]
    public async Task SwaggerDescribesBothSearchResponseShapes()
    {
        var path = "/swagger/v1/swagger.json";

        using var schema = JsonDocument.Parse(await client.GetStringAsync(path));
        var response = schema.RootElement.GetProperty("paths").GetProperty("/api/rooms").GetProperty("get")
            .GetProperty("responses").GetProperty("200").GetProperty("content").GetProperty("application/json").GetProperty("schema");

        Assert.Equal(2, response.GetProperty("oneOf").GetArrayLength());
        Assert.True(schema.RootElement.GetProperty("paths").GetProperty("/api/rooms").GetProperty("get")
            .GetProperty("security")[0].TryGetProperty("Bearer", out _));
        Assert.Equal("bearer", schema.RootElement.GetProperty("components").GetProperty("securitySchemes")
            .GetProperty("Bearer").GetProperty("scheme").GetString());
    }

    [Fact]
    public async Task AdminCreatesRoomWithGeneratedIdAndNormalizedValues()
    {
        await LoginAsAdminAsync();
        var payload = WriteRequest();
        payload["name"] = "  " + suffix + "_created  ";
        payload["equipment"] = new[] { "projector", "projector", "audio" };
        payload["id"] = int.MaxValue;
        payload["unknown"] = "ignored";

        using var response = await client.PostAsJsonAsync("/api/admin/rooms", payload);
        var created = await response.Content.ReadFromJsonAsync<RoomResponse>();
        var card = await client.GetFromJsonAsync<RoomResponse>(response.Headers.Location!);
        var list = await client.GetFromJsonAsync<RoomResponse[]>("/api/rooms?building=D&equipment=audio");
        await using var db = CreateDbContext();
        var saved = await db.Rooms.AsNoTracking().SingleAsync(room => room.Name == suffix + "_created");

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        Assert.InRange(created!.Id, 1, int.MaxValue - 1);
        Assert.Equal(saved.Id, created.Id);
        Assert.Equal(suffix + "_created", created.Name);
        Assert.Equal("D", created.Building);
        Assert.Equal(2, created.Floor);
        Assert.Equal(25, created.Capacity);
        Assert.Equal(new[] { "projector", "audio" }, created.Equipment);
        Assert.Equal(created.Name, card!.Name);
        Assert.Contains(list!, room => room.Id == created.Id);
    }

    [Fact]
    public async Task AdminFullyUpdatesRoomWithoutChangingBookings()
    {
        await LoginAsAdminAsync();
        var payload = WriteRequest();
        payload["equipment"] = Array.Empty<string>();
        payload["id"] = rooms[1].Id;
        await using var db = CreateDbContext();
        var before = await db.Bookings.AsNoTracking().Where(booking => booking.RoomId == rooms[0].Id).OrderBy(booking => booking.Id)
            .Select(booking => new { booking.Id, booking.UserId, booking.Date, booking.StartTime, booking.EndTime, booking.Status, booking.Comment }).ToListAsync();

        using var response = await client.PutAsJsonAsync($"/api/admin/rooms/{rooms[0].Id}", payload);
        var updated = await response.Content.ReadFromJsonAsync<RoomResponse>();
        var card = await client.GetFromJsonAsync<RoomResponse>($"/api/rooms/{rooms[0].Id}");
        var search = await client.GetFromJsonAsync<AvailableRoomsResponse>($"/api/rooms?building=D&date={DateText}");
        var history = await client.GetFromJsonAsync<BookingResponse[]>($"/api/admin/bookings?roomId={rooms[0].Id}");
        var after = await db.Bookings.AsNoTracking().Where(booking => booking.RoomId == rooms[0].Id).OrderBy(booking => booking.Id)
            .Select(booking => new { booking.Id, booking.UserId, booking.Date, booking.StartTime, booking.EndTime, booking.Status, booking.Comment }).ToListAsync();
        var unchanged = await db.Rooms.AsNoTracking().SingleAsync(room => room.Id == rooms[1].Id);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal(rooms[0].Id, updated!.Id);
        Assert.Equal(suffix + "_created", updated.Name);
        Assert.Equal("D", updated.Building);
        Assert.Equal(2, updated.Floor);
        Assert.Equal(25, updated.Capacity);
        Assert.Empty(updated.Equipment);
        Assert.Equal(updated.Name, card!.Name);
        Assert.Equal(before, after);
        Assert.All(history!, booking => Assert.Equal(updated.Name, booking.RoomName));
        Assert.Equal(rooms[1].Name, unchanged.Name);
        Assert.Equal([new FreeSlotResponse("10:30", "12:00"), new FreeSlotResponse("14:00", "18:00")],
            search!.Rooms.Single(room => room.Id == rooms[0].Id).FreeSlots);
    }

    [Theory]
    [InlineData("name")]
    [InlineData("building")]
    [InlineData("floor")]
    [InlineData("capacity")]
    [InlineData("equipment")]
    public async Task RoomWritesRequireEveryField(string field)
    {
        await LoginAsAdminAsync();
        var payload = WriteRequest();
        payload.Remove(field);

        using var creation = await client.PostAsJsonAsync("/api/admin/rooms", payload);
        using var update = await client.PutAsJsonAsync($"/api/admin/rooms/{rooms[0].Id}", payload);
        var creationError = await creation.Content.ReadFromJsonAsync<ApiError>();
        var updateError = await update.Content.ReadFromJsonAsync<ApiError>();
        await using var db = CreateDbContext();
        var saved = await db.Rooms.AsNoTracking().SingleAsync(room => room.Id == rooms[0].Id);

        Assert.Equal(HttpStatusCode.BadRequest, creation.StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, update.StatusCode);
        Assert.Equal("VALIDATION_ERROR", creationError!.Code);
        Assert.Equal("VALIDATION_ERROR", updateError!.Code);
        Assert.Equal(rooms[0].Name, saved.Name);
        Assert.False(await db.Rooms.AnyAsync(room => room.Name == suffix + "_created"));
    }

    [Theory]
    [InlineData("name", "null")]
    [InlineData("name", "\"   \"")]
    [InlineData("building", "\"a\"")]
    [InlineData("building", "\"E\"")]
    [InlineData("floor", "0")]
    [InlineData("floor", "-1")]
    [InlineData("floor", "\"2\"")]
    [InlineData("floor", "1.5")]
    [InlineData("floor", "null")]
    [InlineData("capacity", "0")]
    [InlineData("capacity", "-1")]
    [InlineData("capacity", "\"25\"")]
    [InlineData("capacity", "2147483648")]
    [InlineData("equipment", "null")]
    [InlineData("equipment", "[null]")]
    [InlineData("equipment", "[\"printer\"]")]
    [InlineData("equipment", "[\"Projector\"]")]
    [InlineData("equipment", "\"projector\"")]
    public async Task RoomWritesRejectInvalidValues(string field, string json)
    {
        await LoginAsAdminAsync();
        var payload = WriteRequest();
        payload[field] = JsonSerializer.Deserialize<JsonElement>(json);

        using var creation = await client.PostAsJsonAsync("/api/admin/rooms", payload);
        using var update = await client.PutAsJsonAsync($"/api/admin/rooms/{rooms[0].Id}", payload);
        var error = await update.Content.ReadFromJsonAsync<ApiError>();

        Assert.Equal(HttpStatusCode.BadRequest, creation.StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, update.StatusCode);
        Assert.Equal("VALIDATION_ERROR", error!.Code);
    }

    [Fact]
    public async Task DuplicateNamesAreValidationErrorsAndOwnNameCanBeRetained()
    {
        await LoginAsAdminAsync();
        var payload = WriteRequest();
        payload["name"] = " " + rooms[1].Name + " ";

        using var creation = await client.PostAsJsonAsync("/api/admin/rooms", payload);
        using var duplicateUpdate = await client.PutAsJsonAsync($"/api/admin/rooms/{rooms[0].Id}", payload);
        var creationError = await creation.Content.ReadFromJsonAsync<ApiError>();
        var updateError = await duplicateUpdate.Content.ReadFromJsonAsync<ApiError>();
        payload["name"] = rooms[0].Name;
        using var ownName = await client.PutAsJsonAsync($"/api/admin/rooms/{rooms[0].Id}", payload);
        await using var db = CreateDbContext();
        var names = await db.Rooms.Where(room => room.Id == rooms[0].Id || room.Id == rooms[1].Id).Select(room => room.Name).ToArrayAsync();

        Assert.Equal(HttpStatusCode.BadRequest, creation.StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, duplicateUpdate.StatusCode);
        Assert.Equal("VALIDATION_ERROR", creationError!.Code);
        Assert.Equal("VALIDATION_ERROR", updateError!.Code);
        Assert.Equal(HttpStatusCode.OK, ownName.StatusCode);
        Assert.Contains(rooms[0].Name, names);
        Assert.Contains(rooms[1].Name, names);
    }

    [Fact]
    public async Task ConcurrentRoomCreationSavesOneUniqueName()
    {
        await LoginAsAdminAsync();
        var bothReady = new TaskCompletionSource(TaskCreationOptions.RunContinuationsAsynchronously);
        var arrivals = 0;
        counter.BeforeWrite = async cancellationToken =>
        {
            if (Interlocked.Increment(ref arrivals) == 2)
                bothReady.TrySetResult();
            await bothReady.Task.WaitAsync(TimeSpan.FromSeconds(10), cancellationToken);
        };
        var payload = WriteRequest();

        var responses = await Task.WhenAll(client.PostAsJsonAsync("/api/admin/rooms", payload), client.PostAsJsonAsync("/api/admin/rooms", payload));
        var statuses = responses.Select(response => response.StatusCode).ToArray();
        var errors = new List<string>();
        foreach (var response in responses)
        {
            if (response.StatusCode == HttpStatusCode.BadRequest)
                errors.Add((await response.Content.ReadFromJsonAsync<ApiError>())!.Code);
            response.Dispose();
        }
        await using var db = CreateDbContext();
        var count = await db.Rooms.CountAsync(room => room.Name == suffix + "_created");

        Assert.Single(statuses, status => status == HttpStatusCode.Created);
        Assert.Single(statuses, status => status == HttpStatusCode.BadRequest);
        Assert.Equal(new[] { "VALIDATION_ERROR" }, errors);
        Assert.Equal(1, count);
    }

    [Theory]
    [InlineData("0", HttpStatusCode.NotFound)]
    [InlineData("-1", HttpStatusCode.NotFound)]
    [InlineData("2147483647", HttpStatusCode.NotFound)]
    [InlineData("text", HttpStatusCode.BadRequest)]
    public async Task AdminUpdateRejectsMissingOrInvalidId(string id, HttpStatusCode status)
    {
        await LoginAsAdminAsync();

        using var response = await client.PutAsJsonAsync("/api/admin/rooms/" + id, WriteRequest());
        var error = await response.Content.ReadFromJsonAsync<ApiError>();

        Assert.Equal(status, response.StatusCode);
        Assert.Equal(status == HttpStatusCode.NotFound ? "ROOM_NOT_FOUND" : "VALIDATION_ERROR", error!.Code);
    }

    [Fact]
    public async Task RoomDeletedBeforeUpdateReturnsNotFound()
    {
        await LoginAsAdminAsync();
        counter.BeforeWrite = async cancellationToken =>
        {
            await using var db = CreateDbContext();
            await db.Rooms.Where(room => room.Id == rooms[1].Id).ExecuteDeleteAsync(cancellationToken);
        };

        using var response = await client.PutAsJsonAsync($"/api/admin/rooms/{rooms[1].Id}", WriteRequest());
        var error = await response.Content.ReadFromJsonAsync<ApiError>();

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        Assert.Equal("ROOM_NOT_FOUND", error!.Code);
    }

    [Theory]
    [InlineData("anonymous")]
    [InlineData("student")]
    [InlineData("malformed")]
    [InlineData("forged")]
    [InlineData("expired")]
    [InlineData("issuer")]
    [InlineData("audience")]
    [InlineData("role_changed")]
    [InlineData("deleted")]
    [InlineData("promoted")]
    public async Task AdministrativeRoutesAreHiddenBeforeValidation(string state)
    {
        if (state is not ("student" or "promoted"))
            await LoginAsAdminAsync();
        await using var db = CreateDbContext();
        if (state == "role_changed")
            await db.Users.Where(item => item.Id == user.Id).ExecuteUpdateAsync(update => update.SetProperty(item => item.Role, "student"));
        if (state == "promoted")
            await db.Users.Where(item => item.Id == user.Id).ExecuteUpdateAsync(update => update.SetProperty(item => item.Role, "admin"));
        if (state == "deleted")
        {
            await db.RefreshTokens.Where(token => token.UserId == user.Id).ExecuteDeleteAsync();
            await db.Bookings.Where(booking => booking.UserId == user.Id).ExecuteDeleteAsync();
            await db.Users.Where(item => item.Id == user.Id).ExecuteDeleteAsync();
        }
        if (state == "anonymous")
            client.DefaultRequestHeaders.Authorization = null;
        if (state == "malformed")
            client.DefaultRequestHeaders.Authorization = new("Bearer", "admin");
        if (state is "forged" or "expired" or "issuer" or "audience")
        {
            var now = DateTime.UtcNow;
            var token = new JwtSecurityToken(state == "issuer" ? "WrongIssuer" : "CampusFlow",
                state == "audience" ? "WrongAudience" : "CampusFlowClient",
                [new Claim("sub", user.Id.ToString(CultureInfo.InvariantCulture)), new Claim("role", "admin")],
                now.AddHours(-2), state == "expired" ? now.AddHours(-1) : now.AddHours(1),
                new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(state == "forged" ? signingKey + "wrong" : signingKey)), SecurityAlgorithms.HmacSha256));
            client.DefaultRequestHeaders.Authorization = new("Bearer", new JwtSecurityTokenHandler().WriteToken(token));
        }
        client.DefaultRequestHeaders.Add("role", "admin");

        using var list = await client.GetAsync("/api/admin/bookings?date=bad");
        using var cancellation = await client.DeleteAsync("/api/admin/bookings/text");
        using var creation = await client.PostAsJsonAsync("/api/admin/rooms", new { role = "admin", floor = "bad" });
        using var update = await client.PutAsJsonAsync("/api/admin/rooms/text", new { role = "admin" });
        using var malformed = await client.PostAsync("/api/admin/rooms", new StringContent("{", Encoding.UTF8, "application/json"));
        using var wrongMethod = await client.GetAsync("/api/admin/rooms");
        using var unknown = await client.GetAsync("/api/admin/missing");
        var responses = new[] { list, cancellation, creation, update, malformed, wrongMethod, unknown };
        var bodies = await Task.WhenAll(responses.Select(response => response.Content.ReadAsStringAsync()));

        Assert.All(responses, response => Assert.Equal(HttpStatusCode.NotFound, response.StatusCode));
        Assert.All(responses, response => Assert.Empty(response.Headers.WwwAuthenticate));
        Assert.All(bodies, body => Assert.Empty(body));
        Assert.False(await db.Rooms.AnyAsync(room => room.Name == suffix + "_created"));
    }

    [Fact]
    public async Task SwaggerDocumentsAdministrativeRoomWrites()
    {
        var path = "/swagger/v1/swagger.json";

        using var schema = JsonDocument.Parse(await client.GetStringAsync(path));
        var creation = schema.RootElement.GetProperty("paths").GetProperty("/api/admin/rooms").GetProperty("post");
        var update = schema.RootElement.GetProperty("paths").GetProperty("/api/admin/rooms/{id}").GetProperty("put");
        var requestSchema = schema.RootElement.GetProperty("components").GetProperty("schemas").GetProperty("RoomWriteRequest");

        Assert.True(creation.GetProperty("security")[0].TryGetProperty("Bearer", out _));
        Assert.True(update.GetProperty("security")[0].TryGetProperty("Bearer", out _));
        Assert.True(creation.GetProperty("responses").TryGetProperty("201", out _));
        Assert.True(update.GetProperty("responses").TryGetProperty("200", out _));
        Assert.True(creation.GetProperty("responses").TryGetProperty("404", out _));
        Assert.False(creation.GetProperty("responses").TryGetProperty("401", out _));
        Assert.False(update.GetProperty("responses").TryGetProperty("403", out _));
        Assert.Equal(new[] { "building", "capacity", "equipment", "floor", "name" }, requestSchema.GetProperty("required")
            .EnumerateArray().Select(item => item.GetString()).Order().ToArray());
        Assert.True(!requestSchema.TryGetProperty("additionalProperties", out var additional) || additional.ValueKind == JsonValueKind.True);
    }

    private Dictionary<string, object?> WriteRequest() => new()
    {
        ["name"] = suffix + "_created", ["building"] = "D", ["floor"] = 2, ["capacity"] = 25, ["equipment"] = new[] { "projector" }
    };

    private async Task LoginAsAdminAsync()
    {
        await using var db = CreateDbContext();
        await db.Users.Where(item => item.Id == user.Id).ExecuteUpdateAsync(update => update.SetProperty(item => item.Role, "admin"));
        using var response = await client.PostAsJsonAsync("/api/auth/login", new { login = user.Login, password = "password" });
        response.EnsureSuccessStatusCode();
        var auth = await response.Content.ReadFromJsonAsync<AuthResponse>();
        client.DefaultRequestHeaders.Authorization = new("Bearer", auth!.Token);
    }

    private CampusFlowDbContext CreateDbContext() => new(new DbContextOptionsBuilder<CampusFlowDbContext>().UseNpgsql(connection).Options);

    private sealed class QueryCounter : DbCommandInterceptor
    {
        public int Reads;
        public Func<CancellationToken, Task>? BeforeWrite { get; set; }

        public override async ValueTask<InterceptionResult<DbDataReader>> ReaderExecutingAsync(DbCommand command,
            CommandEventData eventData, InterceptionResult<DbDataReader> result, CancellationToken cancellationToken = default)
        {
            if (command.CommandText.Contains("FROM \"Rooms\"") || command.CommandText.Contains("FROM \"Bookings\""))
                Interlocked.Increment(ref Reads);
            if ((command.CommandText.Contains("INSERT INTO \"Rooms\"") || command.CommandText.Contains("UPDATE \"Rooms\"")) && BeforeWrite is not null)
                await BeforeWrite(cancellationToken);
            return result;
        }
    }
}
