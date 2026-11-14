using System.Data.Common;
using System.Globalization;
using System.Net;
using System.Net.Http.Json;
using System.Security.Cryptography;
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
using Microsoft.Extensions.DependencyInjection.Extensions;
using Xunit;

namespace CampusFlow.Api.Tests;

public sealed class BookingTests : IAsyncLifetime
{
    private readonly string suffix = Guid.NewGuid().ToString("N");
    private readonly List<string> logins = [];
    private readonly BookingCommands commands = new();
    private readonly TestClock clock = new();
    private string connection = null!;
    private WebApplicationFactory<Program> factory = null!;
    private HttpClient client = null!;
    private User user = null!;
    private Room room = null!;
    private DateOnly date;
    private string DateText => date.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);

    public async Task InitializeAsync()
    {
        DotNetEnv.Env.NoClobber().TraversePath().Load();
        connection = Environment.GetEnvironmentVariable("CAMPUSFLOW_TEST_CONNECTION")
            ?? throw new InvalidOperationException("CAMPUSFLOW_TEST_CONNECTION is required.");
        if (new Npgsql.NpgsqlConnectionStringBuilder(connection).Database != "campusflow_test")
            throw new InvalidOperationException("Booking tests require campusflow_test.");
        await using var db = CreateDbContext();
        await db.Database.OpenConnectionAsync();
        await db.Database.MigrateAsync();
        user = await AddUserAsync();
        date = DateOnly.FromDateTime(clock.GetLocalNow().DateTime).AddDays(1);
        room = new Room { Name = "booking_" + suffix, Building = "A", Floor = 1, Capacity = 20, Equipment = ["projector"] };
        db.Rooms.Add(room);
        await db.SaveChangesAsync();
        factory = new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
        {
            builder.ConfigureAppConfiguration((_, configuration) => configuration.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:CampusFlow"] = connection,
                ["Jwt:Key"] = Convert.ToBase64String(RandomNumberGenerator.GetBytes(48)),
                ["Jwt:Issuer"] = "CampusFlow", ["Jwt:Audience"] = "CampusFlowClient"
            }));
            builder.ConfigureServices(services =>
            {
                services.RemoveAll<TimeProvider>();
                services.AddSingleton<TimeProvider>(clock);
                services.AddDbContext<CampusFlowDbContext>((_, options) => options.AddInterceptors(commands));
            });
        });
        client = factory.CreateClient(new WebApplicationFactoryClientOptions { BaseAddress = new Uri("https://localhost"), HandleCookies = false });
        await LoginAsync();
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
        var userIds = db.Users.Where(item => logins.Contains(item.Login)).Select(item => item.Id);
        var roomId = room?.Id ?? 0;
        var roomIds = db.Rooms.Where(item => item.Id == roomId || item.Name == "booking_" + suffix).Select(item => item.Id);
        await db.RefreshTokens.Where(token => userIds.Contains(token.UserId)).ExecuteDeleteAsync();
        await db.Bookings.Where(booking => userIds.Contains(booking.UserId) || roomIds.Contains(booking.RoomId)).ExecuteDeleteAsync();
        await db.Rooms.Where(item => item.Id == roomId || item.Name == "booking_" + suffix).ExecuteDeleteAsync();
        await db.Users.Where(item => logins.Contains(item.Login)).ExecuteDeleteAsync();
        await transaction.CommitAsync();
    }

    [Fact]
    public async Task CreationReturnsBookingAndUpdatesOwnListAndAvailability()
    {
        var payload = Request();

        using var response = await client.PostAsJsonAsync("/api/bookings", payload);
        var created = await response.Content.ReadFromJsonAsync<BookingResponse>();
        var mine = await client.GetFromJsonAsync<BookingResponse[]>("/api/bookings/my");
        var slots = await client.GetFromJsonAsync<RoomFreeSlotsResponse>($"/api/rooms/{room.Id}/free-slots?date={DateText}");
        using var body = JsonDocument.Parse(await response.Content.ReadAsStringAsync());

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        Assert.True(created!.Id > 0);
        Assert.Equal(room.Id, created.RoomId);
        Assert.Equal(room.Name, created.RoomName);
        Assert.Equal(user.Id, created.UserId);
        Assert.Equal(user.DisplayName, created.UserDisplayName);
        Assert.Equal(DateText, created.Date);
        Assert.Equal("14:00", created.StartTime);
        Assert.Equal("15:30", created.EndTime);
        Assert.Equal("active", created.Status);
        Assert.Equal("Test booking", created.Comment);
        Assert.Contains(mine!, booking => booking == created);
        Assert.Equal([new FreeSlotResponse("09:00", "14:00"), new FreeSlotResponse("15:30", "18:00")], slots!.FreeSlots);
        Assert.Equal(new[] { "comment", "date", "endTime", "id", "roomId", "roomName", "startTime", "status", "userDisplayName", "userId" },
            body.RootElement.EnumerateObject().Select(property => property.Name).Order().ToArray());
    }

    [Fact]
    public async Task ServerManagedAndUnknownFieldsAreIgnored()
    {
        var other = await AddUserAsync();
        var payload = Request();
        payload["id"] = -987;
        payload["userId"] = other.Id;
        payload["status"] = "cancelled";
        payload["unknown"] = "ignored";

        using var response = await client.PostAsJsonAsync("/api/bookings", payload);
        var result = await response.Content.ReadFromJsonAsync<BookingResponse>();
        await using var db = CreateDbContext();
        var saved = await db.Bookings.SingleAsync(booking => booking.RoomId == room.Id);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        Assert.True(result!.Id > 0);
        Assert.Equal(user.Id, result.UserId);
        Assert.Equal("active", result.Status);
        Assert.Equal(user.Id, saved.UserId);
        Assert.Equal("active", saved.Status);
    }

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public async Task CommentMayBeOmittedOrNull(bool omitted)
    {
        var payload = Request();
        if (omitted)
            payload.Remove("comment");
        else
            payload["comment"] = null;

        using var response = await client.PostAsJsonAsync("/api/bookings", payload);
        var result = await response.Content.ReadFromJsonAsync<BookingResponse>();

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        Assert.Null(result!.Comment);
    }

    [Theory]
    [InlineData("roomId")]
    [InlineData("date")]
    [InlineData("startTime")]
    [InlineData("endTime")]
    public async Task MissingRequiredFieldReturnsValidationError(string field)
    {
        var payload = Request();
        payload.Remove(field);

        using var response = await client.PostAsJsonAsync("/api/bookings", payload);
        var error = await response.Content.ReadFromJsonAsync<ApiError>();

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal("VALIDATION_ERROR", error!.Code);
    }

    [Theory]
    [InlineData("roomId", "0")]
    [InlineData("roomId", "-1")]
    [InlineData("roomId", "\"1\"")]
    [InlineData("roomId", "null")]
    [InlineData("date", "null")]
    [InlineData("date", "\"\"")]
    [InlineData("date", "\"2000-01-01\"")]
    [InlineData("date", "\"2035-02-29\"")]
    [InlineData("date", "\"2035-1-01\"")]
    [InlineData("date", "\"2035-01-01T00:00:00\"")]
    [InlineData("startTime", "null")]
    [InlineData("startTime", "\"9:00\"")]
    [InlineData("startTime", "\"14:00:00\"")]
    [InlineData("startTime", "\"14:15\"")]
    [InlineData("startTime", "\"08:30\"")]
    [InlineData("startTime", "\"15:30\"")]
    [InlineData("startTime", "\"16:00\"")]
    [InlineData("endTime", "null")]
    [InlineData("endTime", "\"18:30\"")]
    public async Task InvalidCreationFieldReturnsValidationError(string field, string jsonValue)
    {
        var payload = Request();
        payload[field] = JsonSerializer.Deserialize<JsonElement>(jsonValue);

        using var response = await client.PostAsJsonAsync("/api/bookings", payload);
        var error = await response.Content.ReadFromJsonAsync<ApiError>();

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal("VALIDATION_ERROR", error!.Code);
    }

    [Theory]
    [InlineData(14, 10, 0, "14:00", false)]
    [InlineData(14, 30, 15, "14:30", false)]
    [InlineData(14, 29, 59, "14:30", true)]
    [InlineData(14, 30, 0, "14:30", true)]
    public async Task TodayUsesCurrentTimeIncludingSeconds(int hour, int minute, int second, string start, bool allowed)
    {
        var localDay = DateTime.Today;
        clock.SetLocal(localDay.AddHours(hour).AddMinutes(minute).AddSeconds(second));
        var payload = Request();
        payload["date"] = localDay.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
        payload["startTime"] = start;
        payload["endTime"] = "16:00";

        using var response = await client.PostAsJsonAsync("/api/bookings", payload);

        Assert.Equal(allowed ? HttpStatusCode.Created : HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task StartTimeIsCheckedAgainAfterDatabaseReads()
    {
        var localDay = DateTime.Today;
        clock.SetLocal(localDay.AddHours(14).AddMinutes(29));
        commands.AfterRoomRead = () => clock.SetLocal(localDay.AddHours(14).AddMinutes(31));
        var payload = Request();
        payload["date"] = localDay.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
        payload["startTime"] = "14:30";

        using var response = await client.PostAsJsonAsync("/api/bookings", payload);
        var error = await response.Content.ReadFromJsonAsync<ApiError>();
        await using var db = CreateDbContext();

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal("VALIDATION_ERROR", error!.Code);
        Assert.False(await db.Bookings.AnyAsync(booking => booking.RoomId == room.Id));
    }

    [Theory]
    [InlineData("14:00", "15:30", true)]
    [InlineData("13:30", "14:30", true)]
    [InlineData("15:00", "16:00", true)]
    [InlineData("13:00", "17:00", true)]
    [InlineData("14:30", "15:00", true)]
    [InlineData("13:00", "14:00", false)]
    [InlineData("15:30", "16:30", false)]
    public async Task OverlapsConflictAndAdjacentIntervalsSucceed(string start, string end, bool conflicts)
    {
        await using var db = CreateDbContext();
        db.Bookings.Add(new Booking { UserId = user.Id, RoomId = room.Id, Date = date, StartTime = new(14, 0), EndTime = new(15, 30) });
        await db.SaveChangesAsync();
        var payload = Request();
        payload["startTime"] = start;
        payload["endTime"] = end;

        using var response = await client.PostAsJsonAsync("/api/bookings", payload);
        var count = await db.Bookings.CountAsync(booking => booking.RoomId == room.Id);
        using var body = JsonDocument.Parse(await response.Content.ReadAsStringAsync());

        Assert.Equal(conflicts ? HttpStatusCode.Conflict : HttpStatusCode.Created, response.StatusCode);
        Assert.Equal(conflicts ? 1 : 2, count);
        if (conflicts)
        {
            Assert.Equal("BOOKING_CONFLICT", body.RootElement.GetProperty("code").GetString());
            Assert.Equal(room.Id, body.RootElement.GetProperty("details").GetProperty("roomId").GetInt32());
            Assert.Equal(DateText, body.RootElement.GetProperty("details").GetProperty("date").GetString());
            Assert.Equal(start, body.RootElement.GetProperty("details").GetProperty("startTime").GetString());
            Assert.Equal(end, body.RootElement.GetProperty("details").GetProperty("endTime").GetString());
        }
    }

    [Fact]
    public async Task CancelledBookingDoesNotBlockCreation()
    {
        await using var db = CreateDbContext();
        db.Bookings.Add(new Booking { UserId = user.Id, RoomId = room.Id, Date = date, StartTime = new(14, 0), EndTime = new(15, 30), Status = "cancelled" });
        await db.SaveChangesAsync();

        using var response = await client.PostAsJsonAsync("/api/bookings", Request());

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        Assert.Equal(2, await db.Bookings.CountAsync(booking => booking.RoomId == room.Id));
    }

    [Fact]
    public async Task ConcurrentRequestsAllowOnlyOneOverlappingBooking()
    {
        var bothReady = new TaskCompletionSource(TaskCreationOptions.RunContinuationsAsynchronously);
        var arrivals = 0;
        commands.BeforeInsert = async cancellationToken =>
        {
            if (Interlocked.Increment(ref arrivals) == 2)
                bothReady.TrySetResult();
            await bothReady.Task.WaitAsync(TimeSpan.FromSeconds(10), cancellationToken);
        };

        var responses = await Task.WhenAll(client.PostAsJsonAsync("/api/bookings", Request()), client.PostAsJsonAsync("/api/bookings", Request()));
        var statuses = responses.Select(response => response.StatusCode).ToArray();
        foreach (var response in responses)
            response.Dispose();
        await using var db = CreateDbContext();
        var count = await db.Bookings.CountAsync(booking => booking.RoomId == room.Id);

        Assert.Single(statuses, status => status == HttpStatusCode.Created);
        Assert.Single(statuses, status => status == HttpStatusCode.Conflict);
        Assert.Equal(1, count);
    }

    [Fact]
    public async Task MissingRoomReturnsNotFound()
    {
        var payload = Request();
        payload["roomId"] = int.MaxValue;

        using var response = await client.PostAsJsonAsync("/api/bookings", payload);
        var error = await response.Content.ReadFromJsonAsync<ApiError>();

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        Assert.Equal("ROOM_NOT_FOUND", error!.Code);
    }

    [Fact]
    public async Task RoomDeletedImmediatelyBeforeInsertReturnsNotFound()
    {
        commands.BeforeInsert = async cancellationToken =>
        {
            await using var db = CreateDbContext();
            await db.Rooms.Where(item => item.Id == room.Id).ExecuteDeleteAsync(cancellationToken);
        };

        using var response = await client.PostAsJsonAsync("/api/bookings", Request());
        var error = await response.Content.ReadFromJsonAsync<ApiError>();
        await using var database = CreateDbContext();

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        Assert.Equal("ROOM_NOT_FOUND", error!.Code);
        Assert.False(await database.Bookings.AnyAsync(booking => booking.RoomId == room.Id));
    }

    [Fact]
    public async Task DeletedUserReturnsUnauthorized()
    {
        await using var db = CreateDbContext();
        await db.RefreshTokens.Where(token => token.UserId == user.Id).ExecuteDeleteAsync();
        await db.Users.Where(item => item.Id == user.Id).ExecuteDeleteAsync();

        using var creation = await client.PostAsJsonAsync("/api/bookings", Request());
        using var mine = await client.GetAsync("/api/bookings/my");
        using var cancellation = await client.DeleteAsync("/api/bookings/0");

        Assert.Equal(HttpStatusCode.Unauthorized, creation.StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, mine.StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, cancellation.StatusCode);
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public async Task AdminCannotCreateOrReadPersonalBookings(bool personalList)
    {
        await using var db = CreateDbContext();
        await db.Users.Where(item => item.Id == user.Id).ExecuteUpdateAsync(update => update.SetProperty(item => item.Role, "admin"));
        await LoginAsync();

        using var response = personalList ? await client.GetAsync("/api/bookings/my") : await client.PostAsJsonAsync("/api/bookings", Request());
        var error = await response.Content.ReadFromJsonAsync<ApiError>();

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
        Assert.Equal("FORBIDDEN", error!.Code);
        Assert.False(await db.Bookings.AnyAsync(booking => booking.RoomId == room.Id));
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public async Task MissingTokenReturnsUnauthorized(bool personalList)
    {
        client.DefaultRequestHeaders.Authorization = null;

        using var response = personalList ? await client.GetAsync("/api/bookings/my") : await client.PostAsJsonAsync("/api/bookings", Request());
        var error = await response.Content.ReadFromJsonAsync<ApiError>();

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        Assert.Equal("UNAUTHORIZED", error!.Code);
    }

    [Theory]
    [InlineData(null, 2)]
    [InlineData("active", 1)]
    [InlineData("cancelled", 1)]
    public async Task PersonalListFiltersOwnerAndStatusAndJoinsCurrentNames(string? status, int expectedCount)
    {
        var other = await AddUserAsync();
        await using var db = CreateDbContext();
        db.Bookings.AddRange(
            new Booking { UserId = user.Id, RoomId = room.Id, Date = date, StartTime = new(14, 0), EndTime = new(15, 0) },
            new Booking { UserId = user.Id, RoomId = room.Id, Date = date.AddDays(-2), StartTime = new(9, 0), EndTime = new(10, 0), Status = "cancelled" },
            new Booking { UserId = other.Id, RoomId = room.Id, Date = date, StartTime = new(16, 0), EndTime = new(17, 0) });
        await db.SaveChangesAsync();
        await db.Rooms.Where(item => item.Id == room.Id).ExecuteUpdateAsync(update => update.SetProperty(item => item.Name, "renamed_" + suffix));
        await db.Users.Where(item => item.Id == user.Id).ExecuteUpdateAsync(update => update.SetProperty(item => item.DisplayName, "Renamed User"));
        var path = status is null ? "/api/bookings/my" : "/api/bookings/my?status=" + status;

        var result = await client.GetFromJsonAsync<BookingResponse[]>(path);
        var reads = commands.BookingReads;

        Assert.Equal(expectedCount, result!.Length);
        Assert.All(result, booking => Assert.Equal(user.Id, booking.UserId));
        Assert.All(result, booking => Assert.Equal("renamed_" + suffix, booking.RoomName));
        Assert.All(result, booking => Assert.Equal("Renamed User", booking.UserDisplayName));
        if (status is not null)
            Assert.All(result, booking => Assert.Equal(status, booking.Status));
        Assert.Equal(result.OrderBy(booking => booking.Date).ThenBy(booking => booking.StartTime).ThenBy(booking => booking.Id), result);
        Assert.Equal(1, reads);
    }

    [Theory]
    [InlineData("")]
    [InlineData("unknown")]
    [InlineData("Active")]
    public async Task InvalidStatusReturnsValidationError(string status)
    {
        var path = "/api/bookings/my?status=" + status;

        using var response = await client.GetAsync(path);
        var error = await response.Content.ReadFromJsonAsync<ApiError>();

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal("VALIDATION_ERROR", error!.Code);
    }

    [Fact]
    public async Task PersonalListWithoutBookingsReturnsEmptyArray()
    {
        var path = "/api/bookings/my";

        var result = await client.GetFromJsonAsync<BookingResponse[]>(path);

        Assert.Empty(result!);
    }

    [Fact]
    public async Task SwaggerDocumentsBookingRoutesAndBearerAccess()
    {
        var path = "/swagger/v1/swagger.json";

        using var schema = JsonDocument.Parse(await client.GetStringAsync(path));
        var creation = schema.RootElement.GetProperty("paths").GetProperty("/api/bookings").GetProperty("post");
        var mine = schema.RootElement.GetProperty("paths").GetProperty("/api/bookings/my").GetProperty("get");
        var cancellation = schema.RootElement.GetProperty("paths").GetProperty("/api/bookings/{id}").GetProperty("delete");
        var adminList = schema.RootElement.GetProperty("paths").GetProperty("/api/admin/bookings").GetProperty("get");
        var adminCancellation = schema.RootElement.GetProperty("paths").GetProperty("/api/admin/bookings/{id}").GetProperty("delete");

        Assert.True(creation.GetProperty("responses").TryGetProperty("201", out _));
        Assert.True(creation.GetProperty("responses").TryGetProperty("409", out _));
        Assert.True(creation.GetProperty("security")[0].TryGetProperty("Bearer", out _));
        Assert.True(mine.GetProperty("security")[0].TryGetProperty("Bearer", out _));
        Assert.True(cancellation.GetProperty("security")[0].TryGetProperty("Bearer", out _));
        Assert.True(cancellation.GetProperty("responses").TryGetProperty("200", out _));
        Assert.True(cancellation.GetProperty("responses").TryGetProperty("409", out _));
        Assert.True(adminList.GetProperty("security")[0].TryGetProperty("Bearer", out _));
        Assert.True(adminCancellation.GetProperty("security")[0].TryGetProperty("Bearer", out _));
        Assert.True(adminCancellation.GetProperty("responses").TryGetProperty("409", out _));
        Assert.Equal(new[] { "date", "roomId", "status", "userId" }, adminList.GetProperty("parameters")
            .EnumerateArray().Select(parameter => parameter.GetProperty("name").GetString()).Order().ToArray());
        var requestSchema = schema.RootElement.GetProperty("components").GetProperty("schemas").GetProperty("CreateBookingRequest");
        Assert.True(!requestSchema.TryGetProperty("additionalProperties", out var additional) || additional.ValueKind == JsonValueKind.True);
    }

    [Fact]
    public async Task CancellationPreservesHistoryAndReleasesTimeForNewBooking()
    {
        using var createdResponse = await client.PostAsJsonAsync("/api/bookings", Request());
        var created = (await createdResponse.Content.ReadFromJsonAsync<BookingResponse>())!;

        using var response = await client.DeleteAsync($"/api/bookings/{created.Id}");
        var cancelled = await response.Content.ReadFromJsonAsync<BookingCancellationResponse>();
        using var body = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        var mine = await client.GetFromJsonAsync<BookingResponse[]>("/api/bookings/my?status=cancelled");
        var free = await client.GetFromJsonAsync<RoomFreeSlotsResponse>($"/api/rooms/{room.Id}/free-slots?date={DateText}");
        var search = await client.GetFromJsonAsync<AvailableRoomsResponse>($"/api/rooms?date={DateText}&startTime=14:00&endTime=15:30");
        using var replacement = await client.PostAsJsonAsync("/api/bookings", Request());
        await using var db = CreateDbContext();
        var saved = await db.Bookings.AsNoTracking().SingleAsync(booking => booking.Id == created.Id);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal(new BookingCancellationResponse(created.Id, "cancelled"), cancelled);
        Assert.Equal(new[] { "id", "status" }, body.RootElement.EnumerateObject().Select(property => property.Name).Order().ToArray());
        Assert.Contains(mine!, booking => booking.Id == created.Id && booking.Status == "cancelled");
        Assert.Equal([new FreeSlotResponse("09:00", "18:00")], free!.FreeSlots);
        Assert.Contains(search!.Rooms, item => item.Id == room.Id);
        Assert.Equal(HttpStatusCode.Created, replacement.StatusCode);
        Assert.Equal("cancelled", saved.Status);
        Assert.Equal(created.Comment, saved.Comment);
        Assert.Equal(user.Id, saved.UserId);
        Assert.Equal(room.Id, saved.RoomId);
        Assert.Equal(date, saved.Date);
        Assert.Equal(new TimeOnly(14, 0), saved.StartTime);
        Assert.Equal(new TimeOnly(15, 30), saved.EndTime);
        Assert.Equal(2, await db.Bookings.CountAsync(booking => booking.RoomId == room.Id));
    }

    [Theory]
    [InlineData("active")]
    [InlineData("cancelled")]
    public async Task ForeignBookingReturnsForbiddenBeforeStatusCheck(string status)
    {
        var other = await AddUserAsync();
        await using var db = CreateDbContext();
        var booking = new Booking { UserId = other.Id, RoomId = room.Id, Date = date, StartTime = new(14, 0), EndTime = new(15, 30), Status = status };
        db.Bookings.Add(booking);
        await db.SaveChangesAsync();

        using var response = await client.DeleteAsync($"/api/bookings/{booking.Id}");
        var error = await response.Content.ReadFromJsonAsync<ApiError>();
        var saved = await db.Bookings.AsNoTracking().SingleAsync(item => item.Id == booking.Id);

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
        Assert.Equal("FORBIDDEN", error!.Code);
        Assert.Equal(status, saved.Status);
        Assert.Equal(other.Id, saved.UserId);
    }

    [Fact]
    public async Task RepeatedCancellationReturnsAlreadyCancelled()
    {
        using var createdResponse = await client.PostAsJsonAsync("/api/bookings", Request());
        var created = (await createdResponse.Content.ReadFromJsonAsync<BookingResponse>())!;

        using var first = await client.DeleteAsync($"/api/bookings/{created.Id}");
        using var repeated = await client.DeleteAsync($"/api/bookings/{created.Id}");
        var error = await repeated.Content.ReadFromJsonAsync<ApiError>();
        await using var db = CreateDbContext();
        var rows = await db.Bookings.AsNoTracking().Where(booking => booking.RoomId == room.Id).ToListAsync();

        Assert.Equal(HttpStatusCode.OK, first.StatusCode);
        Assert.Equal(HttpStatusCode.Conflict, repeated.StatusCode);
        Assert.Equal("ALREADY_CANCELLED", error!.Code);
        Assert.Single(rows);
        Assert.Equal("cancelled", rows[0].Status);
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public async Task ConcurrentCancellationSucceedsOnlyOnce(bool asAdmin)
    {
        using var createdResponse = await client.PostAsJsonAsync("/api/bookings", Request());
        var created = (await createdResponse.Content.ReadFromJsonAsync<BookingResponse>())!;
        if (asAdmin)
            await LoginAsAdminAsync();
        var path = $"/api/{(asAdmin ? "admin/" : "")}bookings/{created.Id}";
        var bothReady = new TaskCompletionSource(TaskCreationOptions.RunContinuationsAsynchronously);
        var arrivals = 0;
        commands.BeforeCancellation = async cancellationToken =>
        {
            if (Interlocked.Increment(ref arrivals) == 2)
                bothReady.TrySetResult();
            await bothReady.Task.WaitAsync(TimeSpan.FromSeconds(10), cancellationToken);
        };

        var responses = await Task.WhenAll(client.DeleteAsync(path), client.DeleteAsync(path));
        var statuses = responses.Select(response => response.StatusCode).ToArray();
        var errors = new List<string>();
        foreach (var response in responses)
        {
            if (response.StatusCode == HttpStatusCode.Conflict)
                errors.Add((await response.Content.ReadFromJsonAsync<ApiError>())!.Code);
            response.Dispose();
        }
        await using var db = CreateDbContext();
        var saved = await db.Bookings.AsNoTracking().SingleAsync(booking => booking.Id == created.Id);

        Assert.Single(statuses, status => status == HttpStatusCode.OK);
        Assert.Single(statuses, status => status == HttpStatusCode.Conflict);
        Assert.Equal(new[] { "ALREADY_CANCELLED" }, errors);
        Assert.Equal("cancelled", saved.Status);
    }

    [Theory]
    [InlineData("0", HttpStatusCode.NotFound, "BOOKING_NOT_FOUND")]
    [InlineData("-1", HttpStatusCode.NotFound, "BOOKING_NOT_FOUND")]
    [InlineData("2147483647", HttpStatusCode.NotFound, "BOOKING_NOT_FOUND")]
    [InlineData("text", HttpStatusCode.BadRequest, "VALIDATION_ERROR")]
    public async Task InvalidCancellationIdReturnsContractError(string id, HttpStatusCode status, string code)
    {
        var path = "/api/bookings/" + id;

        using var response = await client.DeleteAsync(path);
        var error = await response.Content.ReadFromJsonAsync<ApiError>();

        Assert.Equal(status, response.StatusCode);
        Assert.Equal(code, error!.Code);
    }

    [Fact]
    public async Task AdminCannotCancelThroughStudentEndpoint()
    {
        using var createdResponse = await client.PostAsJsonAsync("/api/bookings", Request());
        var created = (await createdResponse.Content.ReadFromJsonAsync<BookingResponse>())!;
        await using var db = CreateDbContext();
        await db.Users.Where(item => item.Id == user.Id).ExecuteUpdateAsync(update => update.SetProperty(item => item.Role, "admin"));
        await LoginAsync();

        using var response = await client.DeleteAsync($"/api/bookings/{created.Id}");
        var error = await response.Content.ReadFromJsonAsync<ApiError>();
        var saved = await db.Bookings.AsNoTracking().SingleAsync(booking => booking.Id == created.Id);

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
        Assert.Equal("FORBIDDEN", error!.Code);
        Assert.Equal("active", saved.Status);
    }

    [Fact]
    public async Task CancellationWithoutTokenReturnsUnauthorized()
    {
        using var createdResponse = await client.PostAsJsonAsync("/api/bookings", Request());
        var created = (await createdResponse.Content.ReadFromJsonAsync<BookingResponse>())!;
        client.DefaultRequestHeaders.Authorization = null;

        using var response = await client.DeleteAsync($"/api/bookings/{created.Id}");
        var error = await response.Content.ReadFromJsonAsync<ApiError>();
        await using var db = CreateDbContext();
        var saved = await db.Bookings.AsNoTracking().SingleAsync(booking => booking.Id == created.Id);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        Assert.Equal("UNAUTHORIZED", error!.Code);
        Assert.Equal("active", saved.Status);
    }

    [Theory]
    [InlineData("", "0,1,2,3")]
    [InlineData("date=2000-01-01", "0")]
    [InlineData("date={date}", "1,2,3")]
    [InlineData("roomId={room}", "0,1,2,3")]
    [InlineData("userId={owner}", "0,1,2")]
    [InlineData("userId={other}", "3")]
    [InlineData("status=active", "0,2,3")]
    [InlineData("status=cancelled", "1")]
    [InlineData("date={date}&roomId={room}&userId={owner}&status=active", "2")]
    [InlineData("roomId=2147483647", "")]
    [InlineData("userId=2147483647", "")]
    public async Task AdminListAppliesFiltersAndReturnsCurrentNames(string filter, string expected)
    {
        var other = await AddUserAsync();
        await using var db = CreateDbContext();
        var rows = new[]
        {
            new Booking { UserId = user.Id, RoomId = room.Id, Date = new(2000, 1, 1), StartTime = new(9, 0), EndTime = new(10, 0), Status = "active" },
            new Booking { UserId = user.Id, RoomId = room.Id, Date = date, StartTime = new(10, 0), EndTime = new(11, 0), Status = "cancelled" },
            new Booking { UserId = user.Id, RoomId = room.Id, Date = date, StartTime = new(10, 0), EndTime = new(11, 0), Status = "active", Comment = "admin history" },
            new Booking { UserId = other.Id, RoomId = room.Id, Date = date, StartTime = new(11, 0), EndTime = new(12, 0), Status = "active" }
        };
        db.Bookings.AddRange(rows.Reverse());
        await db.SaveChangesAsync();
        await db.Rooms.Where(item => item.Id == room.Id).ExecuteUpdateAsync(update => update.SetProperty(item => item.Name, "renamed_" + suffix));
        await db.Users.Where(item => item.Id == user.Id).ExecuteUpdateAsync(update => update.SetProperty(item => item.DisplayName, "Renamed Owner"));
        await LoginAsAdminAsync();
        filter = filter.Replace("{date}", DateText).Replace("{room}", room.Id.ToString(CultureInfo.InvariantCulture))
            .Replace("{owner}", user.Id.ToString(CultureInfo.InvariantCulture)).Replace("{other}", other.Id.ToString(CultureInfo.InvariantCulture));
        var expectedIds = expected.Length == 0 ? [] : expected.Split(',').Select(index => rows[int.Parse(index)])
            .OrderBy(item => item.Date).ThenBy(item => item.StartTime).ThenBy(item => item.Id).Select(item => item.Id).ToArray();
        commands.BookingReads = 0;

        var result = (await client.GetFromJsonAsync<BookingResponse[]>("/api/admin/bookings?" + filter))!;
        var ownRows = result.Where(item => item.RoomId == room.Id).ToArray();
        var reads = commands.BookingReads;

        Assert.Equal(expectedIds, ownRows.Select(item => item.Id));
        Assert.All(ownRows, item => Assert.Equal("renamed_" + suffix, item.RoomName));
        Assert.All(ownRows.Where(item => item.UserId == user.Id), item => Assert.Equal("Renamed Owner", item.UserDisplayName));
        Assert.Equal(result.OrderBy(item => item.Date).ThenBy(item => item.StartTime).ThenBy(item => item.Id), result);
        if (expected.Length == 0)
            Assert.Empty(result);
        Assert.Equal(1, reads);
    }

    [Theory]
    [InlineData("date=")]
    [InlineData("date=2035-02-29")]
    [InlineData("date=2035-1-01")]
    [InlineData("date=2035-01-01T00:00:00")]
    [InlineData("roomId=0")]
    [InlineData("roomId=-1")]
    [InlineData("roomId=abc")]
    [InlineData("roomId=2147483648")]
    [InlineData("userId=0")]
    [InlineData("userId=-1")]
    [InlineData("userId=abc")]
    [InlineData("status=")]
    [InlineData("status=Active")]
    [InlineData("status=unknown")]
    public async Task AdminListRejectsInvalidFilters(string filter)
    {
        await LoginAsAdminAsync();

        using var response = await client.GetAsync("/api/admin/bookings?" + filter);
        var error = await response.Content.ReadFromJsonAsync<ApiError>();

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal("VALIDATION_ERROR", error!.Code);
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public async Task AdminRoutesRejectStudentAndAnonymous(bool anonymous)
    {
        using var createdResponse = await client.PostAsJsonAsync("/api/bookings", Request());
        var created = (await createdResponse.Content.ReadFromJsonAsync<BookingResponse>())!;
        if (anonymous)
            client.DefaultRequestHeaders.Authorization = null;

        using var list = await client.GetAsync("/api/admin/bookings");
        using var cancellation = await client.DeleteAsync($"/api/admin/bookings/{created.Id}");
        await using var db = CreateDbContext();
        var saved = await db.Bookings.AsNoTracking().SingleAsync(item => item.Id == created.Id);

        Assert.Equal(anonymous ? HttpStatusCode.Unauthorized : HttpStatusCode.Forbidden, list.StatusCode);
        Assert.Equal(anonymous ? HttpStatusCode.Unauthorized : HttpStatusCode.Forbidden, cancellation.StatusCode);
        Assert.Equal("active", saved.Status);
    }

    [Fact]
    public async Task AdminCancellationPreservesOwnerAndReleasesTime()
    {
        using var createdResponse = await client.PostAsJsonAsync("/api/bookings", Request());
        var created = (await createdResponse.Content.ReadFromJsonAsync<BookingResponse>())!;
        var admin = await LoginAsAdminAsync();

        using var response = await client.DeleteAsync($"/api/admin/bookings/{created.Id}");
        var body = await response.Content.ReadFromJsonAsync<BookingCancellationResponse>();
        var history = await client.GetFromJsonAsync<BookingResponse[]>($"/api/admin/bookings?userId={user.Id}&status=cancelled");
        var free = await client.GetFromJsonAsync<RoomFreeSlotsResponse>($"/api/rooms/{room.Id}/free-slots?date={DateText}");
        using var repeated = await client.DeleteAsync($"/api/admin/bookings/{created.Id}");
        var error = await repeated.Content.ReadFromJsonAsync<ApiError>();
        await LoginAsync();
        using var replacement = await client.PostAsJsonAsync("/api/bookings", Request());

        Assert.NotEqual(user.Id, admin.Id);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal(new BookingCancellationResponse(created.Id, "cancelled"), body);
        Assert.Equal(created with { Status = "cancelled" }, Assert.Single(history!));
        Assert.Equal([new FreeSlotResponse("09:00", "18:00")], free!.FreeSlots);
        Assert.Equal(HttpStatusCode.Conflict, repeated.StatusCode);
        Assert.Equal("ALREADY_CANCELLED", error!.Code);
        Assert.Equal(HttpStatusCode.Created, replacement.StatusCode);
    }

    [Theory]
    [InlineData("0", HttpStatusCode.NotFound, "BOOKING_NOT_FOUND")]
    [InlineData("-1", HttpStatusCode.NotFound, "BOOKING_NOT_FOUND")]
    [InlineData("2147483647", HttpStatusCode.NotFound, "BOOKING_NOT_FOUND")]
    [InlineData("text", HttpStatusCode.BadRequest, "VALIDATION_ERROR")]
    public async Task AdminCancellationRejectsInvalidId(string id, HttpStatusCode status, string code)
    {
        await LoginAsAdminAsync();

        using var response = await client.DeleteAsync("/api/admin/bookings/" + id);
        var error = await response.Content.ReadFromJsonAsync<ApiError>();

        Assert.Equal(status, response.StatusCode);
        Assert.Equal(code, error!.Code);
    }

    [Fact]
    public async Task DeletedAdminCannotReadOrCancelBookings()
    {
        var admin = await LoginAsAdminAsync();
        await using var db = CreateDbContext();
        await db.RefreshTokens.Where(token => token.UserId == admin.Id).ExecuteDeleteAsync();
        await db.Users.Where(item => item.Id == admin.Id).ExecuteDeleteAsync();

        using var list = await client.GetAsync("/api/admin/bookings");
        using var cancellation = await client.DeleteAsync("/api/admin/bookings/0");

        Assert.Equal(HttpStatusCode.Unauthorized, list.StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, cancellation.StatusCode);
    }

    private async Task<User> LoginAsAdminAsync()
    {
        var admin = await AddUserAsync();
        await using var db = CreateDbContext();
        await db.Users.Where(item => item.Id == admin.Id).ExecuteUpdateAsync(update => update.SetProperty(item => item.Role, "admin"));
        using var response = await client.PostAsJsonAsync("/api/auth/login", new { login = admin.Login, password = "password" });
        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadFromJsonAsync<AuthResponse>();
        client.DefaultRequestHeaders.Authorization = new("Bearer", result!.Token);
        return admin;
    }

    private Dictionary<string, object?> Request() => new()
    {
        ["roomId"] = room.Id, ["date"] = DateText, ["startTime"] = "14:00", ["endTime"] = "15:30", ["comment"] = "Test booking"
    };

    private async Task<User> AddUserAsync()
    {
        await using var db = CreateDbContext();
        var added = new User { Login = "booking_user_" + Guid.NewGuid().ToString("N"), DisplayName = "Booking User", Role = "student" };
        logins.Add(added.Login);
        added.PasswordHash = new PasswordHasher<User>().HashPassword(added, "password");
        db.Users.Add(added);
        await db.SaveChangesAsync();
        return added;
    }

    private async Task LoginAsync()
    {
        using var response = await client.PostAsJsonAsync("/api/auth/login", new { login = user.Login, password = "password" });
        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadFromJsonAsync<AuthResponse>();
        client.DefaultRequestHeaders.Authorization = new("Bearer", result!.Token);
    }

    private CampusFlowDbContext CreateDbContext() => new(new DbContextOptionsBuilder<CampusFlowDbContext>().UseNpgsql(connection).Options);

    private sealed class TestClock : TimeProvider
    {
        private DateTimeOffset now = DateTimeOffset.UtcNow;
        public override DateTimeOffset GetUtcNow() => now;
        public void SetLocal(DateTime local) => now = new DateTimeOffset(local).ToUniversalTime();
    }

    private sealed class BookingCommands : DbCommandInterceptor
    {
        public Func<CancellationToken, Task>? BeforeInsert { get; set; }
        public Func<CancellationToken, Task>? BeforeCancellation { get; set; }
        public Action? AfterRoomRead { get; set; }
        public int BookingReads;

        public override async ValueTask<InterceptionResult<int>> NonQueryExecutingAsync(DbCommand command,
            CommandEventData eventData, InterceptionResult<int> result, CancellationToken cancellationToken = default)
        {
            if (command.CommandText.StartsWith("UPDATE \"Bookings\"", StringComparison.Ordinal) && BeforeCancellation is not null)
                await BeforeCancellation(cancellationToken);
            return result;
        }

        public override async ValueTask<InterceptionResult<DbDataReader>> ReaderExecutingAsync(DbCommand command,
            CommandEventData eventData, InterceptionResult<DbDataReader> result, CancellationToken cancellationToken = default)
        {
            if (command.CommandText.Contains("FROM \"Bookings\""))
                Interlocked.Increment(ref BookingReads);
            if (command.CommandText.Contains("INSERT INTO \"Bookings\"") && BeforeInsert is not null)
                await BeforeInsert(cancellationToken);
            return result;
        }

        public override ValueTask<DbDataReader> ReaderExecutedAsync(DbCommand command, CommandExecutedEventData eventData,
            DbDataReader result, CancellationToken cancellationToken = default)
        {
            if (command.CommandText.Contains("FROM \"Rooms\""))
                AfterRoomRead?.Invoke();
            return ValueTask.FromResult(result);
        }
    }
}
