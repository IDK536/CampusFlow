using CampusFlow.Api.Data;
using CampusFlow.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Npgsql;
using Xunit;

namespace CampusFlow.Api.Tests;

public sealed class DatabaseTests : IAsyncLifetime
{
    private readonly List<string> testConnections = [];

    public Task InitializeAsync() => Task.CompletedTask;

    public async Task DisposeAsync()
    {
        foreach (var connection in testConnections)
        {
            await using var db = new CampusFlowDbContext(new DbContextOptionsBuilder<CampusFlowDbContext>().UseNpgsql(connection).Options);
            await db.Database.EnsureDeletedAsync();
        }
    }

    [Fact]
    public async Task SeedUsesCampusDateHashesPasswordsAndPreservesDataOnRepeat()
    {
        await using var db = await CreateDatabaseAsync();
        var clock = new FixedClock(new DateTimeOffset(2026, 11, 13, 23, 30, 0, TimeSpan.Zero));
        var zone = TimeZoneInfo.CreateCustomTimeZone("TestCampus", TimeSpan.FromHours(3), "TestCampus", "TestCampus");
        await DatabaseSeeder.SeedAsync(db, clock, zone);
        Assert.Equal(3, await db.Users.CountAsync());
        Assert.Equal(12, await db.Rooms.CountAsync());
        Assert.Equal(7, await db.Bookings.CountAsync());
        Assert.Equal(new DateOnly(2026, 11, 14), (await db.Bookings.FindAsync(5))!.Date);
        Assert.Equal(new DateOnly(2026, 11, 15), (await db.Bookings.FindAsync(1))!.Date);
        Assert.Equal(new DateOnly(2026, 11, 16), (await db.Bookings.FindAsync(6))!.Date);
        foreach (var user in await db.Users.ToListAsync())
        {
            Assert.NotEqual(user.Login, user.PasswordHash);
            Assert.NotEqual(PasswordVerificationResult.Failed,
                new PasswordHasher<User>().VerifyHashedPassword(user, user.PasswordHash, user.Login));
        }
        var firstHash = (await db.Users.FindAsync(1))!.PasswordHash;
        await DatabaseSeeder.SeedAsync(db, new FixedClock(clock.GetUtcNow().AddDays(1)), zone);
        Assert.Equal(7, await db.Bookings.CountAsync());
        Assert.Equal(firstHash, (await db.Users.FindAsync(1))!.PasswordHash);
        Assert.Equal(new DateOnly(2026, 11, 15), (await db.Bookings.FindAsync(1))!.Date);

        var userNext = new User { Login = "test", DisplayName = "Test", Role = "student", PasswordHash = "test-only" };
        var roomNext = new Room { Name = "D-404", Building = "D", Floor = 4, Capacity = 20 };
        var bookingNext = new Booking { RoomId = 2, UserId = 1, Date = new(2026, 11, 15), StartTime = new(9, 0), EndTime = new(10, 0) };
        db.AddRange(userNext, roomNext, bookingNext);
        await db.SaveChangesAsync();
        Assert.True(userNext.Id > 3 && roomNext.Id > 12 && bookingNext.Id > 7);
        // Full rollback and reapplication also exercise the migration's Down method.
        await db.GetService<Microsoft.EntityFrameworkCore.Migrations.IMigrator>().MigrateAsync("0");
        await db.Database.MigrateAsync();
        Assert.Empty(await db.Users.ToListAsync());
    }

    [Fact]
    public async Task ConcurrentOverlapsAllowOnlyOneInsert()
    {
        await using var db = await CreateDatabaseAsync();
        await DatabaseSeeder.SeedAsync(db, TimeProvider.System, TimeZoneInfo.Utc);
        var connection = db.Database.GetConnectionString()!;
        await using var first = new CampusFlowDbContext(new DbContextOptionsBuilder<CampusFlowDbContext>().UseNpgsql(connection).Options);
        await using var second = new CampusFlowDbContext(new DbContextOptionsBuilder<CampusFlowDbContext>().UseNpgsql(connection).Options);
        first.Bookings.Add(new Booking { RoomId = 2, UserId = 1, Date = new(2030, 1, 1), StartTime = new(10, 0), EndTime = new(12, 0) });
        second.Bookings.Add(new Booking { RoomId = 2, UserId = 2, Date = new(2030, 1, 1), StartTime = new(11, 0), EndTime = new(13, 0) });
        var results = await Task.WhenAll(Record.ExceptionAsync(() => first.SaveChangesAsync()), Record.ExceptionAsync(() => second.SaveChangesAsync()));
        Assert.Single(results, x => x is null);
        var failure = Assert.IsType<DbUpdateException>(Assert.Single(results, x => x is not null));
        Assert.Equal(PostgresErrorCodes.ExclusionViolation, Assert.IsType<PostgresException>(failure.InnerException).SqlState);
        Assert.Equal(1, await db.Bookings.CountAsync(x => x.Date == new DateOnly(2030, 1, 1)));
    }

    [Fact]
    public async Task AdjacentIntervalsAndCancelledBookingsDoNotBlockTime()
    {
        await using var db = await CreateDatabaseAsync();
        await DatabaseSeeder.SeedAsync(db, TimeProvider.System, TimeZoneInfo.Utc);
        db.Bookings.AddRange(
            new Booking { RoomId = 2, UserId = 1, Date = new(2030, 1, 1), StartTime = new(9, 0), EndTime = new(10, 0) },
            new Booking { RoomId = 2, UserId = 1, Date = new(2030, 1, 1), StartTime = new(10, 0), EndTime = new(11, 0) });
        await db.SaveChangesAsync();
        var previous = await db.Bookings.SingleAsync(x => x.RoomId == 2 && x.Date == new DateOnly(2030, 1, 1) && x.StartTime == new TimeOnly(9, 0));
        previous.Status = "cancelled";
        await db.SaveChangesAsync();
        db.Bookings.Add(new Booking { RoomId = 2, UserId = 2, Date = new(2030, 1, 1), StartTime = new(9, 0), EndTime = new(10, 0) });
        await db.SaveChangesAsync();
        Assert.Equal(3, await db.Bookings.CountAsync(x => x.Date == new DateOnly(2030, 1, 1)));

        db.Bookings.Add(new Booking { RoomId = 3, UserId = 1, Date = new(2030, 1, 1), StartTime = new(9, 15), EndTime = new(10, 0) });
        var failure = await Assert.ThrowsAsync<DbUpdateException>(() => db.SaveChangesAsync());
        Assert.Equal(PostgresErrorCodes.CheckViolation, Assert.IsType<PostgresException>(failure.InnerException).SqlState);
    }

    private async Task<CampusFlowDbContext> CreateDatabaseAsync()
    {
        // A new database per test; never modify an existing application database.
        var connection = new NpgsqlConnectionStringBuilder(
            Environment.GetEnvironmentVariable("CAMPUSFLOW_TEST_CONNECTION")
            ?? throw new InvalidOperationException("CAMPUSFLOW_TEST_CONNECTION is required for PostgreSQL integration tests."))
        { Database = "campusflow_test_" + Guid.NewGuid().ToString("N") };
        testConnections.Add(connection.ConnectionString);
        var db = new CampusFlowDbContext(new DbContextOptionsBuilder<CampusFlowDbContext>().UseNpgsql(connection.ConnectionString).Options);
        await db.Database.MigrateAsync();
        return db;
    }

    private sealed class FixedClock(DateTimeOffset now) : TimeProvider
    {
        public override DateTimeOffset GetUtcNow() => now;
    }
}
