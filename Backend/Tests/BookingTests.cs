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
        await TestDatabase.MigrateAsync(db);
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
                ["Auth:AllowedOrigins:0"] = "http://localhost:5173",
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
        var roomIds = db.Rooms.Where(item => item.Id == roomId || item.Name.StartsWith("booking_" + suffix)).Select(item => item.Id);
        await db.RefreshTokens.Where(token => userIds.Contains(token.UserId)).ExecuteDeleteAsync();
        await db.Bookings.Where(booking => userIds.Contains(booking.UserId) || roomIds.Contains(booking.RoomId)).ExecuteDeleteAsync();
        await db.Rooms.Where(item => item.Id == roomId || item.Name.StartsWith("booking_" + suffix)).ExecuteDeleteAsync();
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
    public async Task AfterClosingTodayCannotBeBookedWhileTomorrowCan()
    {
        var today = DateOnly.FromDateTime(clock.GetLocalNow().DateTime);
        var tomorrow = today.AddDays(1);
        var todayText = today.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
        var tomorrowText = tomorrow.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
        clock.SetLocal(today.ToDateTime(new TimeOnly(21, 0)));
        var todayRequest = Request();
        todayRequest["date"] = todayText;
        var tomorrowRequest = Request();
        tomorrowRequest["date"] = tomorrowText;

        var todaySlots = await client.GetFromJsonAsync<RoomFreeSlotsResponse>($"/api/rooms/{room.Id}/free-slots?date={todayText}");
        var todaySearch = await client.GetFromJsonAsync<AvailableRoomsResponse>($"/api/rooms?date={todayText}&startTime=14:00&endTime=15:30");
        using var rejected = await client.PostAsJsonAsync("/api/bookings", todayRequest);
        var error = await rejected.Content.ReadFromJsonAsync<ApiError>();
        await using var db = CreateDbContext();
        var countAfterRejection = await db.Bookings.CountAsync(booking => booking.RoomId == room.Id);
        using var created = await client.PostAsJsonAsync("/api/bookings", tomorrowRequest);
        var booking = await created.Content.ReadFromJsonAsync<BookingResponse>();
        var tomorrowSlots = await client.GetFromJsonAsync<RoomFreeSlotsResponse>($"/api/rooms/{room.Id}/free-slots?date={tomorrowText}");
        var saved = await db.Bookings.AsNoTracking().Where(item => item.RoomId == room.Id).ToListAsync();

        Assert.Equal([new FreeSlotResponse("09:00", "18:00")], todaySlots!.FreeSlots);
        Assert.Contains(todaySearch!.Rooms, item => item.Id == room.Id);
        Assert.Equal(HttpStatusCode.BadRequest, rejected.StatusCode);
        Assert.Equal("VALIDATION_ERROR", error!.Code);
        Assert.Equal(0, countAfterRejection);
        Assert.Equal(HttpStatusCode.Created, created.StatusCode);
        Assert.Equal(tomorrowText, booking!.Date);
        Assert.Equal([new FreeSlotResponse("09:00", "14:00"), new FreeSlotResponse("15:30", "18:00")], tomorrowSlots!.FreeSlots);
        Assert.Equal(tomorrow, Assert.Single(saved).Date);
        Assert.Equal(booking.Id, saved[0].Id);
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

    [Theory]
    [InlineData(2, true)]
    [InlineData(8, true)]
    [InlineData(2, false)]
    [InlineData(8, false)]
    public async Task ConcurrentRequestsPreserveBookingConstraints(int requestCount, bool overlapping)
    {
        var bothReady = new TaskCompletionSource(TaskCreationOptions.RunContinuationsAsynchronously);
        var arrivals = 0;
        commands.BeforeInsert = async cancellationToken =>
        {
            if (Interlocked.Increment(ref arrivals) == requestCount)
                bothReady.TrySetResult();
            await bothReady.Task.WaitAsync(TimeSpan.FromSeconds(10), cancellationToken);
        };
        var payloads = Enumerable.Range(0, requestCount).Select(index =>
        {
            var payload = Request();
            if (!overlapping)
            {
                payload["startTime"] = new TimeOnly(9, 0).AddMinutes(index * 30).ToString("HH:mm", CultureInfo.InvariantCulture);
                payload["endTime"] = new TimeOnly(9, 0).AddMinutes((index + 1) * 30).ToString("HH:mm", CultureInfo.InvariantCulture);
            }
            return payload;
        }).ToArray();

        var responses = await Task.WhenAll(payloads.Select(payload => client.PostAsJsonAsync("/api/bookings", payload)));
        var statuses = responses.Select(response => response.StatusCode).ToArray();
        var ids = new List<int>();
        var errors = new List<string>();
        foreach (var response in responses)
        {
            if (response.StatusCode == HttpStatusCode.Created)
                ids.Add((await response.Content.ReadFromJsonAsync<BookingResponse>())!.Id);
            if (response.StatusCode == HttpStatusCode.Conflict)
                errors.Add((await response.Content.ReadFromJsonAsync<ApiError>())!.Code);
            response.Dispose();
        }
        await using var db = CreateDbContext();
        var saved = await db.Bookings.AsNoTracking().Where(booking => booking.RoomId == room.Id).ToListAsync();
        var expectedCount = overlapping ? 1 : requestCount;

        Assert.Equal(expectedCount, statuses.Count(status => status == HttpStatusCode.Created));
        Assert.Equal(requestCount - expectedCount, statuses.Count(status => status == HttpStatusCode.Conflict));
        Assert.All(errors, code => Assert.Equal("BOOKING_CONFLICT", code));
        Assert.Equal(expectedCount, saved.Count);
        Assert.Equal(ids.Order(), saved.Select(booking => booking.Id).Order());
        Assert.All(saved, booking => Assert.Equal("active", booking.Status));
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

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public async Task EntityDeletedImmediatelyBeforeInsertReturnsContractError(bool deleteRoom)
    {
        commands.BeforeInsert = async cancellationToken =>
        {
            await using var db = CreateDbContext();
            if (deleteRoom)
                await db.Rooms.Where(item => item.Id == room.Id).ExecuteDeleteAsync(cancellationToken);
            else
            {
                await db.RefreshTokens.Where(token => token.UserId == user.Id).ExecuteDeleteAsync(cancellationToken);
                await db.Users.Where(item => item.Id == user.Id).ExecuteDeleteAsync(cancellationToken);
            }
        };

        using var response = await client.PostAsJsonAsync("/api/bookings", Request());
        var error = await response.Content.ReadFromJsonAsync<ApiError>();
        await using var database = CreateDbContext();

        Assert.Equal(deleteRoom ? HttpStatusCode.NotFound : HttpStatusCode.Unauthorized, response.StatusCode);
        Assert.Equal(deleteRoom ? "ROOM_NOT_FOUND" : "UNAUTHORIZED", error!.Code);
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

    [Theory]
    [InlineData("", "0,1,2,3,4,5,6,7")]
    [InlineData("scope=upcoming", "3,5")]
    [InlineData("scope=past", "0,1,2,6,7")]
    [InlineData("scope=upcoming&status=active", "3,5")]
    [InlineData("scope=upcoming&status=cancelled", "")]
    [InlineData("scope=past&status=active", "0,1,2")]
    [InlineData("scope=past&status=cancelled", "6,7")]
    [InlineData("status=cancelled", "4,6,7")]
    public async Task PersonalScopeUsesEndTimeAndCombinesStatusWithoutChangingBookings(string filter, string expected)
    {
        var today = DateOnly.FromDateTime(DateTime.Today);
        var other = await AddUserAsync();
        clock.SetLocal(today.ToDateTime(new TimeOnly(12, 0)));
        var rows = new[]
        {
            new Booking { UserId = user.Id, RoomId = room.Id, Date = today.AddDays(-1), StartTime = new(14, 0), EndTime = new(15, 0) },
            new Booking { UserId = user.Id, RoomId = room.Id, Date = today, StartTime = new(10, 0), EndTime = new(11, 0) },
            new Booking { UserId = user.Id, RoomId = room.Id, Date = today, StartTime = new(11, 0), EndTime = new(12, 0) },
            new Booking { UserId = user.Id, RoomId = room.Id, Date = today, StartTime = new(12, 0), EndTime = new(13, 0) },
            new Booking { UserId = user.Id, RoomId = room.Id, Date = today.AddDays(1), StartTime = new(13, 0), EndTime = new(14, 0), Status = "cancelled" },
            new Booking { UserId = user.Id, RoomId = room.Id, Date = today.AddDays(1), StartTime = new(9, 0), EndTime = new(10, 0) },
            new Booking { UserId = user.Id, RoomId = room.Id, Date = today.AddDays(-1), StartTime = new(10, 0), EndTime = new(11, 0), Status = "cancelled" },
            new Booking { UserId = user.Id, RoomId = room.Id, Date = today, StartTime = new(11, 0), EndTime = new(12, 0), Status = "cancelled" },
            new Booking { UserId = other.Id, RoomId = room.Id, Date = today, StartTime = new(14, 0), EndTime = new(15, 0) }
        };
        await using var db = CreateDbContext();
        db.Bookings.AddRange(rows);
        await db.SaveChangesAsync();
        var expectedIds = expected.Length == 0 ? [] : expected.Split(',').Select(index => rows[int.Parse(index)])
            .OrderBy(item => item.Date).ThenBy(item => item.StartTime).ThenBy(item => item.Id).Select(item => item.Id).ToArray();
        var ids = rows.Select(item => item.Id).ToArray();
        commands.BookingReads = 0;

        using var response = await client.GetAsync("/api/bookings/my?" + filter);
        var result = (await response.Content.ReadFromJsonAsync<BookingResponse[]>())!;
        var reads = commands.BookingReads;
        var statuses = await db.Bookings.AsNoTracking().Where(item => ids.Contains(item.Id)).ToDictionaryAsync(item => item.Id, item => item.Status);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal(expectedIds, result!.Select(item => item.Id));
        Assert.All(result, item => Assert.Equal(user.Id, item.UserId));
        Assert.All(rows, item => Assert.Equal(item.Status, statuses[item.Id]));
        Assert.Equal(1, reads);
    }

    [Theory]
    [InlineData(-1, false)]
    [InlineData(0, true)]
    [InlineData(1, true)]
    public async Task PersonalScopeChangesAtExactEndIncludingSeconds(int seconds, bool past)
    {
        var today = DateOnly.FromDateTime(DateTime.Today);
        var booking = new Booking { UserId = user.Id, RoomId = room.Id, Date = today, StartTime = new(11, 0), EndTime = new(12, 0) };
        await using var db = CreateDbContext();
        db.Bookings.Add(booking);
        await db.SaveChangesAsync();
        clock.SetLocal(today.ToDateTime(new TimeOnly(12, 0)).AddSeconds(seconds));

        var upcoming = await client.GetFromJsonAsync<BookingResponse[]>("/api/bookings/my?scope=upcoming");
        var history = await client.GetFromJsonAsync<BookingResponse[]>("/api/bookings/my?scope=past");

        Assert.Equal(!past, upcoming!.Any(item => item.Id == booking.Id));
        Assert.Equal(past, history!.Any(item => item.Id == booking.Id));
    }

    [Theory]
    [InlineData("")]
    [InlineData("unknown")]
    [InlineData("Upcoming")]
    [InlineData(" past ")]
    public async Task InvalidScopeReturnsValidationError(string scope)
    {
        var path = "/api/bookings/my?scope=" + Uri.EscapeDataString(scope);

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
        var adminUsers = schema.RootElement.GetProperty("paths").GetProperty("/api/admin/users").GetProperty("get");

        Assert.True(creation.GetProperty("responses").TryGetProperty("201", out _));
        Assert.True(creation.GetProperty("responses").TryGetProperty("409", out _));
        Assert.True(creation.GetProperty("security")[0].TryGetProperty("Bearer", out _));
        Assert.True(mine.GetProperty("security")[0].TryGetProperty("Bearer", out _));
        Assert.Equal(new[] { "scope", "status" }, mine.GetProperty("parameters").EnumerateArray()
            .Select(parameter => parameter.GetProperty("name").GetString()).Order().ToArray());
        Assert.Contains("scope=upcoming", mine.GetProperty("description").GetString());
        Assert.True(cancellation.GetProperty("security")[0].TryGetProperty("Bearer", out _));
        Assert.True(cancellation.GetProperty("responses").TryGetProperty("200", out _));
        Assert.True(cancellation.GetProperty("responses").TryGetProperty("409", out _));
        Assert.True(adminUsers.GetProperty("security")[0].TryGetProperty("Bearer", out _));
        Assert.True(adminUsers.GetProperty("responses").TryGetProperty("200", out _));
        Assert.True(adminUsers.GetProperty("responses").TryGetProperty("404", out _));
        Assert.False(adminUsers.GetProperty("responses").TryGetProperty("401", out _));
        Assert.False(adminUsers.GetProperty("responses").TryGetProperty("403", out _));
        Assert.True(adminList.GetProperty("security")[0].TryGetProperty("Bearer", out _));
        Assert.True(adminCancellation.GetProperty("security")[0].TryGetProperty("Bearer", out _));
        Assert.True(adminCancellation.GetProperty("responses").TryGetProperty("409", out _));
        Assert.True(adminList.GetProperty("responses").TryGetProperty("404", out _));
        Assert.True(adminList.GetProperty("responses").GetProperty("200").GetProperty("headers").TryGetProperty("X-Total-Count", out _));
        Assert.All(adminList.GetProperty("parameters").EnumerateArray().Where(parameter => parameter.GetProperty("name").GetString() is "limit" or "offset"),
            parameter => Assert.Equal("integer", parameter.GetProperty("schema").GetProperty("type").GetString()));
        Assert.False(adminList.GetProperty("responses").TryGetProperty("401", out _));
        Assert.False(adminCancellation.GetProperty("responses").TryGetProperty("403", out _));
        Assert.Equal(new[] { "building", "date", "dateFrom", "dateTo", "limit", "offset", "q", "roomId", "sort", "status", "userId" }, adminList.GetProperty("parameters")
            .EnumerateArray().Select(parameter => parameter.GetProperty("name").GetString()).Order().ToArray());
        Assert.All(adminList.GetProperty("parameters").EnumerateArray()
            .Where(parameter => parameter.GetProperty("name").GetString() is "date" or "dateFrom" or "dateTo"),
            parameter => Assert.Equal("date", parameter.GetProperty("schema").GetProperty("format").GetString()));
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
    [InlineData("building=A", "0,1,2,3")]
    [InlineData("building=B&roomId={room}", "")]
    [InlineData("building=C&roomId={room}", "")]
    [InlineData("building=D&roomId={room}", "")]
    [InlineData("building=A&dateFrom={date}&dateTo={date}&roomId={room}&userId={owner}&status=active", "2")]
    [InlineData("building=B&dateFrom={date}&dateTo={date}&roomId={room}&userId={owner}&status=active", "")]
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
    [InlineData("dateFrom=2000-01-01&dateTo=2000-01-01", "0")]
    [InlineData("dateFrom=2000-01-02", "1,2,3")]
    [InlineData("dateTo=1999-12-31", "")]
    [InlineData("dateTo=2000-01-01", "0")]
    [InlineData("dateFrom={date}&dateTo={date}", "1,2,3")]
    [InlineData("dateFrom={date}&dateTo=9999-12-31", "1,2,3")]
    [InlineData("dateFrom=0001-01-01&dateTo=9999-12-31", "0,1,2,3")]
    [InlineData("dateFrom=2000-01-01&dateTo={date}", "0,1,2,3")]
    [InlineData("dateFrom={date}&dateTo={date}&roomId={room}&userId={owner}&status=active", "2")]
    [InlineData("date=2000-01-01&dateFrom={date}", "")]
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
        Assert.Equal(2, reads);
    }

    [Theory]
    [InlineData("date=")]
    [InlineData("building=")]
    [InlineData("building=a")]
    [InlineData("sort=")]
    [InlineData("sort=user")]
    [InlineData("sort=unknown")]
    [InlineData("sort=Date")]
    [InlineData("limit=")]
    [InlineData("limit=0")]
    [InlineData("limit=-1")]
    [InlineData("limit=101")]
    [InlineData("limit=1.5")]
    [InlineData("limit=abc")]
    [InlineData("limit=2147483648")]
    [InlineData("offset=")]
    [InlineData("offset=-1")]
    [InlineData("offset=1.5")]
    [InlineData("offset=abc")]
    [InlineData("offset=2147483648")]
    [InlineData("building=E")]
    [InlineData("building=A,B")]
    [InlineData("building=1")]
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
    [InlineData("dateFrom=")]
    [InlineData("dateTo=")]
    [InlineData("dateFrom=bad")]
    [InlineData("dateTo=bad")]
    [InlineData("dateFrom=2035-02-29")]
    [InlineData("dateTo=2035-02-29")]
    [InlineData("dateFrom=2035-1-01")]
    [InlineData("dateTo=2035-01-01T00:00:00")]
    [InlineData("dateFrom=2035-01-02&dateTo=2035-01-01")]
    public async Task AdminListRejectsInvalidFilters(string filter)
    {
        await LoginAsAdminAsync();

        using var response = await client.GetAsync("/api/admin/bookings?" + filter);
        var error = await response.Content.ReadFromJsonAsync<ApiError>();

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal("VALIDATION_ERROR", error!.Code);
        Assert.False(response.Headers.Contains("X-Total-Count"));
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

        Assert.Equal(HttpStatusCode.NotFound, list.StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, cancellation.StatusCode);
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

        Assert.Equal(HttpStatusCode.NotFound, list.StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, cancellation.StatusCode);
    }

    [Theory]
    [InlineData("", "2,3,4,1,5,0", 6)]
    [InlineData("sort=date", "2,3,4,1,5,0", 6)]
    [InlineData("sort=-date", "0,5,1,4,3,2", 6)]
    [InlineData("sort=room", "3,1,5,2,4,0", 6)]
    [InlineData("sort=date&limit=2", "2,3", 6)]
    [InlineData("sort=date&offset=2&limit=2", "4,1", 6)]
    [InlineData("sort=-date&offset=1&limit=2", "5,1", 6)]
    [InlineData("sort=room&offset=2&limit=2", "5,2", 6)]
    [InlineData("offset=3", "1,5,0", 6)]
    [InlineData("offset=6&limit=2", "", 6)]
    [InlineData("offset=2147483647", "", 6)]
    [InlineData("offset=0&limit=100", "2,3,4,1,5,0", 6)]
    [InlineData("status=active&building=A&q={room}&dateFrom={date}&dateTo={date}&sort=-date&limit=1&offset=0", "4", 1)]
    [InlineData("building=B&status=cancelled&limit=1", "", 0)]
    public async Task AdminPaginationSortsAllMatchesBeforeSelectingPage(string filter, string expected, int total)
    {
        var secondRoom = new Room { Name = "booking_" + suffix + "_sort", Building = "B", Floor = 1, Capacity = 20, Equipment = [] };
        await using var db = CreateDbContext();
        db.Rooms.Add(secondRoom);
        await db.SaveChangesAsync();
        await db.Rooms.Where(item => item.Id == room.Id).ExecuteUpdateAsync(update => update.SetProperty(item => item.Name, "booking_" + suffix + "_z"));
        var rows = new[]
        {
            new Booking { UserId = user.Id, RoomId = room.Id, Date = date.AddDays(1), StartTime = new(10, 0), EndTime = new(11, 0) },
            new Booking { UserId = user.Id, RoomId = secondRoom.Id, Date = date, StartTime = new(11, 0), EndTime = new(12, 0) },
            new Booking { UserId = user.Id, RoomId = room.Id, Date = date, StartTime = new(9, 0), EndTime = new(10, 0), Status = "cancelled" },
            new Booking { UserId = user.Id, RoomId = secondRoom.Id, Date = date, StartTime = new(9, 0), EndTime = new(10, 0) },
            new Booking { UserId = user.Id, RoomId = room.Id, Date = date, StartTime = new(9, 0), EndTime = new(10, 0) },
            new Booking { UserId = user.Id, RoomId = secondRoom.Id, Date = date.AddDays(1), StartTime = new(9, 0), EndTime = new(10, 0) }
        };
        foreach (var row in rows)
        {
            db.Bookings.Add(row);
            await db.SaveChangesAsync();
        }
        await LoginAsAdminAsync();
        filter = filter.Replace("{room}", Uri.EscapeDataString("booking_" + suffix + "_z")).Replace("{date}", DateText);
        var path = $"/api/admin/bookings?userId={user.Id}&" + filter;
        var expectedIds = expected.Length == 0 ? [] : expected.Split(',').Select(index => rows[int.Parse(index)].Id).ToArray();
        commands.BookingReads = 0;

        using var response = await client.GetAsync(path);
        var result = await response.Content.ReadFromJsonAsync<BookingResponse[]>();
        var reads = commands.BookingReads;

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal(expectedIds, result!.Select(item => item.Id));
        Assert.Equal(total.ToString(CultureInfo.InvariantCulture), response.Headers.GetValues("X-Total-Count").Single());
        Assert.Equal(2, reads);
    }

    [Fact]
    public async Task AdminTotalCountIsExposedToAllowedBrowserOrigin()
    {
        await LoginAsAdminAsync();
        client.DefaultRequestHeaders.Add("Origin", "http://localhost:5173");

        using var response = await client.GetAsync($"/api/admin/bookings?userId={user.Id}&limit=1");
        var exposed = string.Join(",", response.Headers.GetValues("Access-Control-Expose-Headers"));

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("0", response.Headers.GetValues("X-Total-Count").Single());
        Assert.Contains("X-Total-Count", exposed);
    }

    [Theory]
    [InlineData("name", "0,1")]
    [InlineData("room", "0,1,2")]
    [InlineData("partial-name", "")]
    [InlineData("partial-room", "")]
    [InlineData("comment", "")]
    [InlineData("wildcard", "")]
    [InlineData("empty", "0,1,2")]
    [InlineData("blank", "0,1,2")]
    [InlineData("name-status", "0")]
    [InlineData("name-user", "0")]
    [InlineData("name-building", "")]
    [InlineData("name-date", "")]
    [InlineData("name-other-user", "")]
    public async Task AdminQMatchesFullRoomOrUserNameAndCombinesFilters(string mode, string expected)
    {
        var other = await AddUserAsync();
        var third = await AddUserAsync();
        var name = "Иван_%\\" + suffix;
        var roomName = "Аудитория_%\\" + suffix;
        var comment = "Комментарий_" + suffix;
        await using var db = CreateDbContext();
        await db.Users.Where(item => item.Id == user.Id || item.Id == other.Id)
            .ExecuteUpdateAsync(update => update.SetProperty(item => item.DisplayName, name));
        await db.Rooms.Where(item => item.Id == room.Id).ExecuteUpdateAsync(update => update.SetProperty(item => item.Name, roomName));
        var rows = new[]
        {
            new Booking { UserId = user.Id, RoomId = room.Id, Date = date, StartTime = new(9, 0), EndTime = new(10, 0) },
            new Booking { UserId = other.Id, RoomId = room.Id, Date = date, StartTime = new(10, 0), EndTime = new(11, 0), Status = "cancelled" },
            new Booking { UserId = third.Id, RoomId = room.Id, Date = date, StartTime = new(11, 0), EndTime = new(12, 0), Comment = comment }
        };
        db.Bookings.AddRange(rows);
        await db.SaveChangesAsync();
        await LoginAsAdminAsync();
        var q = mode switch
        {
            "room" => "  " + roomName.ToUpperInvariant() + "  ",
            "partial-name" => name[..^1],
            "partial-room" => roomName[..^1],
            "comment" => comment,
            "wildcard" => "%",
            "empty" => "",
            "blank" => "   ",
            _ => "  " + name.ToUpperInvariant() + "  "
        };
        var path = $"/api/admin/bookings?roomId={room.Id}&q=" + Uri.EscapeDataString(q);
        path += mode switch
        {
            "name-status" => "&status=active",
            "name-user" => $"&userId={user.Id}",
            "name-building" => "&building=B",
            "name-date" => "&dateFrom=2000-01-01&dateTo=2000-01-01",
            "name-other-user" => "&userId=" + third.Id,
            _ => ""
        };
        var expectedIds = expected.Length == 0 ? [] : expected.Split(',').Select(index => rows[int.Parse(index)].Id).ToArray();
        commands.BookingReads = 0;

        using var response = await client.GetAsync(path);
        var result = await response.Content.ReadFromJsonAsync<BookingResponse[]>();
        var reads = commands.BookingReads;

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal(expectedIds, result!.Select(item => item.Id));
        Assert.Equal(2, reads);
    }

    [Fact]
    public async Task AdminUsersIncludeStudentsWithoutBookingsAndOnlyPublicFields()
    {
        var second = await AddUserAsync();
        var third = await AddUserAsync();
        var studentIds = new[] { user.Id, second.Id, third.Id };
        await using var db = CreateDbContext();
        await db.Users.Where(item => item.Id == user.Id).ExecuteUpdateAsync(update => update.SetProperty(item => item.DisplayName, "B_" + suffix));
        await db.Users.Where(item => item.Id == second.Id || item.Id == third.Id)
            .ExecuteUpdateAsync(update => update.SetProperty(item => item.DisplayName, "A_" + suffix));
        using var creation = await client.PostAsJsonAsync("/api/bookings", Request());
        creation.EnsureSuccessStatusCode();
        var admin = await LoginAsAdminAsync();

        using var response = await client.GetAsync("/api/admin/users");
        var result = (await response.Content.ReadFromJsonAsync<UserResponse[]>())!;
        using var body = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        var own = result!.Where(item => studentIds.Contains(item.Id)).ToArray();
        var studentsWithoutBookings = await db.Bookings.CountAsync(item => item.UserId == second.Id || item.UserId == third.Id);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal(new[] { second.Id, third.Id, user.Id }, own.Select(item => item.Id));
        Assert.Equal(second.Login, own[0].Login);
        Assert.Equal("A_" + suffix, own[0].DisplayName);
        Assert.All(result, item => Assert.Equal("student", item.Role));
        Assert.DoesNotContain(result, item => item.Id == admin.Id);
        Assert.Equal(0, studentsWithoutBookings);
        Assert.All(body.RootElement.EnumerateArray(), item => Assert.Equal(new[] { "displayName", "id", "login", "role" },
            item.EnumerateObject().Select(field => field.Name).Order().ToArray()));
    }

    [Fact]
    public async Task AdminBuildingFilterUsesCurrentRoomBuilding()
    {
        using var creation = await client.PostAsJsonAsync("/api/bookings", Request());
        var booking = (await creation.Content.ReadFromJsonAsync<BookingResponse>())!;
        await using var db = CreateDbContext();
        await db.Rooms.Where(item => item.Id == room.Id).ExecuteUpdateAsync(update => update.SetProperty(item => item.Building, "B"));
        await LoginAsAdminAsync();
        commands.BookingReads = 0;

        var oldBuilding = await client.GetFromJsonAsync<BookingResponse[]>($"/api/admin/bookings?roomId={room.Id}&building=A");
        var currentBuilding = await client.GetFromJsonAsync<BookingResponse[]>($"/api/admin/bookings?roomId={room.Id}&building=B");
        var reads = commands.BookingReads;

        Assert.Empty(oldBuilding!);
        Assert.Equal(booking.Id, Assert.Single(currentBuilding!).Id);
        Assert.Equal(4, reads);
    }

    [Theory]
    [InlineData(null, 3, 210)]
    [InlineData("A", 2, 120)]
    [InlineData("B", 1, 90)]
    [InlineData("C", 0, 0)]
    [InlineData("D", 0, 0)]
    public async Task AdminStatsAggregatesActiveBookingsAndPreservesEmptyDates(string? building, long count, long minutes)
    {
        var from = new DateOnly(9090, 6, 1);
        var secondRoom = new Room { Name = "booking_" + suffix + "_stats_b", Building = "B", Floor = 1, Capacity = 10, Equipment = [] };
        var emptyRoom = new Room { Name = "booking_" + suffix + "_stats_empty", Building = "A", Floor = 1, Capacity = 100, Equipment = [] };
        await using var db = CreateDbContext();
        db.Rooms.AddRange(secondRoom, emptyRoom);
        await db.SaveChangesAsync();
        db.Bookings.AddRange(
            new Booking { UserId = user.Id, RoomId = room.Id, Date = from, StartTime = new(9, 0), EndTime = new(10, 0) },
            new Booking { UserId = user.Id, RoomId = secondRoom.Id, Date = from, StartTime = new(9, 30), EndTime = new(11, 0) },
            new Booking { UserId = user.Id, RoomId = room.Id, Date = from.AddDays(1), StartTime = new(17, 0), EndTime = new(18, 0) },
            new Booking { UserId = user.Id, RoomId = room.Id, Date = from, StartTime = new(10, 0), EndTime = new(12, 0), Status = "cancelled" },
            new Booking { UserId = user.Id, RoomId = room.Id, Date = from.AddDays(-1), StartTime = new(12, 0), EndTime = new(13, 0) },
            new Booking { UserId = user.Id, RoomId = secondRoom.Id, Date = from.AddDays(3), StartTime = new(9, 0), EndTime = new(10, 0) });
        await db.SaveChangesAsync();
        await LoginAsAdminAsync();
        var path = "/api/admin/stats?dateFrom=9090-06-01&dateTo=9090-06-03" + (building is null ? "" : "&building=" + building);
        var expectedBuildings = building is null ? new[] { "A", "B", "C", "D" } : new[] { building };
        var expectedHours = new long[18];
        if (building is null or "A")
        {
            expectedHours[0]++;
            expectedHours[1]++;
            expectedHours[16]++;
            expectedHours[17]++;
        }
        if (building is null or "B")
        {
            expectedHours[1]++;
            expectedHours[2]++;
            expectedHours[3]++;
        }
        commands.BookingReads = 0;

        using var response = await client.GetAsync(path);
        var report = (await response.Content.ReadFromJsonAsync<StatsResponse>())!;
        var reads = commands.BookingReads;

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal(count, report.Totals.Bookings);
        Assert.Equal(minutes, report.Totals.Minutes);
        Assert.Equal(expectedBuildings, report.ByBuilding.Select(item => item.Building));
        Assert.Equal(new[] { "9090-06-01", "9090-06-02", "9090-06-03" }, report.ByDay.Select(item => item.Date));
        Assert.Equal(expectedBuildings.Length * 3, report.Cells.Length);
        Assert.Equal(expectedHours, report.ByHalfHour);
        Assert.Equal(new DayStats("9090-06-03", 0, 0, 0), report.ByDay[2]);
        Assert.Equal(minutes, report.Cells.Sum(item => item.Minutes));
        Assert.Equal(count, report.Cells.Sum(item => item.Bookings));
        Assert.Equal(minutes, report.TopRooms.Sum(item => item.Minutes));
        Assert.Equal(count, report.TopRooms.Sum(item => item.Bookings));
        Assert.All(report.Cells, cell =>
        {
            var rooms = report.ByBuilding.Single(item => item.Building == cell.Building).Rooms;
            Assert.Equal(rooms * 540L, cell.CapacityMinutes);
            Assert.Equal(cell.CapacityMinutes == 0 ? 0m : cell.Minutes * 100m / cell.CapacityMinutes, cell.Percent);
        });
        Assert.All(report.ByBuilding, item =>
        {
            var own = report.Cells.Where(cell => cell.Building == item.Building).ToArray();
            Assert.Equal(own.Sum(cell => cell.Minutes), item.Minutes);
            Assert.Equal(item.Rooms == 0 ? 0m : item.Minutes * 100m / (item.Rooms * 540L * 3), item.Percent);
        });
        Assert.All(report.ByDay, item =>
        {
            var own = report.Cells.Where(cell => cell.Date == item.Date).ToArray();
            var capacity = own.Sum(cell => cell.CapacityMinutes);
            Assert.Equal(capacity == 0 ? 0m : item.Minutes * 100m / capacity, item.Percent);
        });
        var totalCapacity = report.ByBuilding.Sum(item => item.Rooms * 540L * 3);
        Assert.Equal(totalCapacity == 0 ? 0m : minutes * 100m / totalCapacity, report.Totals.Percent);
        if (building is null or "A")
            Assert.True(report.ByBuilding.Single(item => item.Building == "A").Rooms >= 2);
        if (building is null or "B")
            Assert.True(report.ByBuilding.Single(item => item.Building == "B").Rooms >= 1);
        Assert.Equal(2, reads);
    }

    [Fact]
    public async Task AdminStatsRanksTenRoomsByMinutesThenNameAndKeepsFractionalPercent()
    {
        var from = new DateOnly(9091, 1, 1);
        var rankedRooms = Enumerable.Range(0, 11).Reverse().Select(index => new Room
        {
            Name = "booking_" + suffix + "_rank_" + index.ToString("D2"), Building = "A", Floor = 1, Capacity = 10, Equipment = []
        }).ToArray();
        await using var db = CreateDbContext();
        db.Rooms.AddRange(rankedRooms);
        await db.SaveChangesAsync();
        db.Bookings.AddRange(rankedRooms.Select(item => new Booking
        {
            UserId = user.Id, RoomId = item.Id, Date = from, StartTime = new(9, 0), EndTime = new(9, 30)
        }));
        db.Bookings.AddRange(
            new Booking { UserId = user.Id, RoomId = room.Id, Date = from, StartTime = new(9, 0), EndTime = new(10, 0) },
            new Booking { UserId = user.Id, RoomId = room.Id, Date = from.AddDays(1), StartTime = new(9, 0), EndTime = new(9, 30) });
        await db.SaveChangesAsync();
        await LoginAsAdminAsync();
        var expectedNames = rankedRooms.OrderBy(item => item.Name, StringComparer.Ordinal).Take(9).Select(item => item.Name).ToArray();

        var report = (await client.GetFromJsonAsync<StatsResponse>("/api/admin/stats?dateFrom=9091-01-01&dateTo=9091-12-31&building=A"))!;

        Assert.Equal(13, report.Totals.Bookings);
        Assert.Equal(420, report.Totals.Minutes);
        Assert.Equal(10, report.TopRooms.Length);
        Assert.Equal(new RoomStats(room.Id, room.Name, 90, 2), report.TopRooms[0]);
        Assert.Equal(expectedNames, report.TopRooms.Skip(1).Select(item => item.Name));
        Assert.True(report.Totals.Percent > 0 && report.Totals.Percent < 1);
        Assert.Equal(420 * 100m / (report.ByBuilding[0].Rooms * 540L * 365), report.Totals.Percent);
        Assert.Equal(365, report.ByDay.Length);
        Assert.Equal(13, report.ByHalfHour[0]);
        Assert.Equal(1, report.ByHalfHour[1]);
        Assert.All(report.ByHalfHour.Skip(2), value => Assert.Equal(0, value));
    }

    [Theory]
    [InlineData("0001-01-01")]
    [InlineData("9999-12-31")]
    public async Task AdminStatsSupportsSingleEmptyDayAtDateBoundaries(string dateText)
    {
        await LoginAsAdminAsync();
        var path = $"/api/admin/stats?dateFrom={dateText}&dateTo={dateText}";

        var report = (await client.GetFromJsonAsync<StatsResponse>(path))!;

        Assert.Equal(new StatsTotals(0, 0, 0), report.Totals);
        Assert.Equal(new DayStats(dateText, 0, 0, 0), Assert.Single(report.ByDay));
        Assert.Equal(4, report.Cells.Length);
        Assert.Empty(report.TopRooms);
        Assert.Equal(18, report.ByHalfHour.Length);
        Assert.All(report.ByHalfHour, value => Assert.Equal(0, value));
    }

    [Theory]
    [InlineData("")]
    [InlineData("dateFrom=2035-01-01")]
    [InlineData("dateTo=2035-01-01")]
    [InlineData("dateFrom=&dateTo=2035-01-01")]
    [InlineData("dateFrom=2035-01-01&dateTo=")]
    [InlineData("dateFrom=2035-02-29&dateTo=2035-03-01")]
    [InlineData("dateFrom=2035-1-01&dateTo=2035-01-01")]
    [InlineData("dateFrom=2035-01-01&dateTo=bad")]
    [InlineData("dateFrom=2035-01-01&dateTo=2034-12-31")]
    [InlineData("dateFrom=2035-01-01&dateTo=2035-01-01&building=")]
    [InlineData("dateFrom=2035-01-01&dateTo=2035-01-01&building=a")]
    [InlineData("dateFrom=2035-01-01&dateTo=2035-01-01&building=E")]
    public async Task AdminStatsRejectsInvalidQueries(string query)
    {
        await LoginAsAdminAsync();
        var path = "/api/admin/stats?" + query;

        using var response = await client.GetAsync(path);
        var error = await response.Content.ReadFromJsonAsync<ApiError>();

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal("VALIDATION_ERROR", error!.Code);
    }

    [Fact]
    public async Task SwaggerDocumentsStatsQueryAndResponse()
    {
        var path = "/swagger/v1/swagger.json";

        using var schema = JsonDocument.Parse(await client.GetStringAsync(path));
        var stats = schema.RootElement.GetProperty("paths").GetProperty("/api/admin/stats").GetProperty("get");
        var response = schema.RootElement.GetProperty("components").GetProperty("schemas").GetProperty("StatsResponse");

        Assert.True(stats.GetProperty("security")[0].TryGetProperty("Bearer", out _));
        Assert.True(stats.GetProperty("responses").TryGetProperty("200", out _));
        Assert.True(stats.GetProperty("responses").TryGetProperty("400", out _));
        Assert.True(stats.GetProperty("responses").TryGetProperty("404", out _));
        Assert.False(stats.GetProperty("responses").TryGetProperty("401", out _));
        Assert.False(stats.GetProperty("responses").TryGetProperty("403", out _));
        Assert.All(stats.GetProperty("parameters").EnumerateArray().Where(item => item.GetProperty("name").GetString() is "dateFrom" or "dateTo"), item =>
        {
            Assert.True(item.GetProperty("required").GetBoolean());
            Assert.Equal("date", item.GetProperty("schema").GetProperty("format").GetString());
        });
        Assert.Equal(new[] { "byBuilding", "byDay", "byHalfHour", "cells", "topRooms", "totals" },
            response.GetProperty("properties").EnumerateObject().Select(item => item.Name).Order().ToArray());
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
