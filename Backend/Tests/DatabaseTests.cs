using CampusFlow.Api.Data;
using CampusFlow.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Xunit;

namespace CampusFlow.Api.Tests;

public sealed class DatabaseTests : IAsyncLifetime
{
    private readonly List<string> Logins = [];
    private readonly List<string> RoomNames = [];

    public async Task InitializeAsync()
    {
        await using var db = CreateDbContext();
        await db.Database.OpenConnectionAsync();
        await TestDatabase.MigrateAsync(db);
    }

    public async Task DisposeAsync()
    {
        await using var db = CreateDbContext();
        await using var transaction = await db.Database.BeginTransactionAsync();
        var userIds = db.Users.Where(user => Logins.Contains(user.Login)).Select(user => user.Id);
        var roomIds = db.Rooms.Where(room => RoomNames.Contains(room.Name)).Select(room => room.Id);
        await db.RefreshTokens.Where(token => userIds.Contains(token.UserId)).ExecuteDeleteAsync();
        await db.Bookings.Where(booking => userIds.Contains(booking.UserId) || roomIds.Contains(booking.RoomId)).ExecuteDeleteAsync();
        await db.Rooms.Where(room => RoomNames.Contains(room.Name)).ExecuteDeleteAsync();
        await db.Users.Where(user => Logins.Contains(user.Login)).ExecuteDeleteAsync();
        await transaction.CommitAsync();
    }

    private async Task<(User User, Room Room)> CreateTestDataAsync(CampusFlowDbContext db)
    {
        var suffix = Guid.NewGuid().ToString("N");
        var user = new User { Login = "test_" + suffix, DisplayName = "Test", Role = "student", PasswordHash = "test" };
        var room = new Room { Name = "room_" + suffix, Building = "A", Floor = 1, Capacity = 10 };
        Logins.Add(user.Login);
        RoomNames.Add(room.Name);
        db.AddRange(user, room);
        await db.SaveChangesAsync();
        return (user, room);
    }

    private static CampusFlowDbContext CreateDbContext()
    {
        DotNetEnv.Env.NoClobber().TraversePath().Load();
        var connection = new NpgsqlConnectionStringBuilder(
            Environment.GetEnvironmentVariable("CAMPUSFLOW_TEST_CONNECTION")
            ?? throw new InvalidOperationException("Set CAMPUSFLOW_TEST_CONNECTION to the existing campusflow_test database."));
        if (connection.Database != "campusflow_test")
            throw new InvalidOperationException("Database tests require Database=campusflow_test.");

        var options = new DbContextOptionsBuilder<CampusFlowDbContext>()
            .UseNpgsql(connection.ConnectionString)
            .Options;
        return new CampusFlowDbContext(options);
    }

    [Fact]
    public async Task SeedCompletesPartialDataAndPreservesExistingBookings()
    {
        await using var db = CreateDbContext();
        var clock = new FixedClock(new DateTimeOffset(2026, 11, 14, 12, 0, 0, TimeSpan.Zero));
        var other = await CreateTestDataAsync(db);
        string[] seedLogins = ["student1", "student2", "admin"];
        string[] seedRooms = ["A-101", "A-102", "A-203", "B-101", "B-204", "B-305", "C-110", "C-210", "C-301", "D-101", "D-202", "D-303"];
        Logins.AddRange(seedLogins);
        RoomNames.AddRange(seedRooms);
        var seedUserIds = db.Users.Where(user => seedLogins.Contains(user.Login)).Select(user => user.Id);
        var bookings = db.Bookings.Where(booking => seedUserIds.Contains(booking.UserId));

        await DatabaseSeeder.SeedAsync(db, clock);
        var initialUserCount = await db.Users.CountAsync(user => seedLogins.Contains(user.Login));
        var initialRoomCount = await db.Rooms.CountAsync(room => seedRooms.Contains(room.Name));
        var initialBookingCount = await bookings.CountAsync();
        var booking = await bookings.FirstAsync(x => x.Status == "active");
        booking.Status = "cancelled";
        var removed = await bookings.FirstAsync(x => x.Id != booking.Id);
        db.Bookings.Remove(removed);
        await db.SaveChangesAsync();
        await DatabaseSeeder.SeedAsync(db, clock);
        db.ChangeTracker.Clear();
        var repeatedBookingCount = await bookings.CountAsync();
        var cancelledStatus = (await bookings.SingleAsync(x => x.Id == booking.Id)).Status;
        var seededUsers = await db.Users.Where(x => seedLogins.Contains(x.Login)).AsNoTracking().ToListAsync();
        var cancelledDate = (await bookings.SingleAsync(x => x.Comment == "Отменили")).Date;
        await bookings.ExecuteDeleteAsync();
        db.ChangeTracker.Clear();
        db.Rooms.Remove(await db.Rooms.SingleAsync(x => x.Name == "A-101"));
        db.Users.Remove(await db.Users.SingleAsync(x => x.Login == "student1"));
        await db.SaveChangesAsync();
        await DatabaseSeeder.SeedAsync(db, clock);

        var adminId = await db.Users.Where(user => user.Login == "admin").Select(user => user.Id).SingleAsync();
        var adminBookingCount = await db.Bookings.CountAsync(item => item.UserId == adminId);

        Assert.Equal(3, initialUserCount);
        Assert.Equal(12, initialRoomCount);
        Assert.Equal(6, initialBookingCount);
        Assert.Equal(6, repeatedBookingCount);
        Assert.Equal(0, adminBookingCount);
        Assert.Equal("cancelled", cancelledStatus);
        foreach (var user in seededUsers)
            Assert.NotEqual(PasswordVerificationResult.Failed, new PasswordHasher<User>().VerifyHashedPassword(user, user.PasswordHash, user.Login));
        Assert.Equal(DateOnly.FromDateTime(clock.GetLocalNow().DateTime), cancelledDate);
        Assert.Equal(3, await db.Users.CountAsync(user => seedLogins.Contains(user.Login)));
        Assert.Equal(12, await db.Rooms.CountAsync(room => seedRooms.Contains(room.Name)));
        Assert.Equal(6, await bookings.CountAsync());
        Assert.True(await db.Users.AnyAsync(user => user.Id == other.User.Id));
        Assert.True(await db.Rooms.AnyAsync(room => room.Id == other.Room.Id));
    }

    private sealed class FixedClock(DateTimeOffset now) : TimeProvider
    {
        public override DateTimeOffset GetUtcNow() => now;
    }

    [Fact]
    public async Task ConcurrentOverlapsAllowOnlyOneInsert()
    {
        await using var db = CreateDbContext();
        var data = await CreateTestDataAsync(db);
        var connection = db.Database.GetConnectionString()!;
        await using var first = new CampusFlowDbContext(new DbContextOptionsBuilder<CampusFlowDbContext>().UseNpgsql(connection).Options);
        await using var second = new CampusFlowDbContext(new DbContextOptionsBuilder<CampusFlowDbContext>().UseNpgsql(connection).Options);
        first.Bookings.Add(new Booking { RoomId = data.Room.Id, UserId = data.User.Id, Date = new(2030, 1, 1), StartTime = new(10, 0), EndTime = new(12, 0) });
        second.Bookings.Add(new Booking { RoomId = data.Room.Id, UserId = data.User.Id, Date = new(2030, 1, 1), StartTime = new(11, 0), EndTime = new(13, 0) });

        var results = await Task.WhenAll(Record.ExceptionAsync(() => first.SaveChangesAsync()), Record.ExceptionAsync(() => second.SaveChangesAsync()));

        Assert.Single(results, x => x is null);
        var failure = Assert.Single(results, x => x is not null)!;
        var postgres = Assert.IsType<PostgresException>(failure.GetBaseException());
        Assert.Contains(postgres.SqlState, new[] { PostgresErrorCodes.ExclusionViolation, PostgresErrorCodes.DeadlockDetected });
        if (postgres.SqlState == PostgresErrorCodes.ExclusionViolation)
            Assert.Equal("Bookings_NoOverlap", postgres.ConstraintName);
        Assert.Equal(1, await db.Bookings.CountAsync(x => x.RoomId == data.Room.Id && x.Date == new DateOnly(2030, 1, 1)));
    }

    [Fact]
    public async Task AdjacentIntervalsAndCancelledBookingsDoNotBlockTime()
    {
        await using var db = CreateDbContext();
        var data = await CreateTestDataAsync(db);
        db.Bookings.AddRange(
            new Booking { RoomId = data.Room.Id, UserId = data.User.Id, Date = new(2030, 1, 1), StartTime = new(9, 0), EndTime = new(10, 0) },
            new Booking { RoomId = data.Room.Id, UserId = data.User.Id, Date = new(2030, 1, 1), StartTime = new(10, 0), EndTime = new(11, 0) });

        await db.SaveChangesAsync();
        var previous = await db.Bookings.SingleAsync(x => x.RoomId == data.Room.Id && x.Date == new DateOnly(2030, 1, 1) && x.StartTime == new TimeOnly(9, 0));
        previous.Status = "cancelled";
        await db.SaveChangesAsync();
        db.Bookings.Add(new Booking { RoomId = data.Room.Id, UserId = data.User.Id, Date = new(2030, 1, 1), StartTime = new(9, 0), EndTime = new(10, 0) });
        await db.SaveChangesAsync();
        var bookingCount = await db.Bookings.CountAsync(x => x.RoomId == data.Room.Id && x.Date == new DateOnly(2030, 1, 1));
        db.Bookings.Add(new Booking { RoomId = data.Room.Id, UserId = data.User.Id, Date = new(2030, 1, 2), StartTime = new(9, 15), EndTime = new(10, 0) });
        var exception = await Record.ExceptionAsync(() => db.SaveChangesAsync());

        Assert.Equal(3, bookingCount);
        var failure = Assert.IsType<DbUpdateException>(exception);
        Assert.Equal(PostgresErrorCodes.CheckViolation, Assert.IsType<PostgresException>(failure.InnerException).SqlState);
    }

}
