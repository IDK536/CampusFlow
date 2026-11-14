using System.Data.Common;
using System.Globalization;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
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
using Xunit;

namespace CampusFlow.Api.Tests;

public sealed class RoomTests : IAsyncLifetime
{
    private readonly string suffix = Guid.NewGuid().ToString("N");
    private readonly DateOnly date = DateOnly.FromDateTime(DateTime.Now).AddDays(1);
    private readonly QueryCounter counter = new();
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
                ["ConnectionStrings:CampusFlow"] = connection
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
        var names = rooms.Select(room => room.Name).ToArray();
        await db.Rooms.Where(room => names.Contains(room.Name)).ExecuteDeleteAsync();
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

    private CampusFlowDbContext CreateDbContext() => new(new DbContextOptionsBuilder<CampusFlowDbContext>().UseNpgsql(connection).Options);

    private sealed class QueryCounter : DbCommandInterceptor
    {
        public int Reads;

        public override ValueTask<InterceptionResult<DbDataReader>> ReaderExecutingAsync(DbCommand command,
            CommandEventData eventData, InterceptionResult<DbDataReader> result, CancellationToken cancellationToken = default)
        {
            if (command.CommandText.Contains("FROM \"Rooms\"") || command.CommandText.Contains("FROM \"Bookings\""))
                Interlocked.Increment(ref Reads);
            return base.ReaderExecutingAsync(command, eventData, result, cancellationToken);
        }
    }
}
