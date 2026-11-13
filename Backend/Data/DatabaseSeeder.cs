using CampusFlow.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CampusFlow.Api.Data;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(CampusFlowDbContext db, TimeProvider clock, TimeZoneInfo timeZone,
        CancellationToken cancellationToken = default)
    {
        await using var transaction = await db.Database.BeginTransactionAsync(cancellationToken);
        // Serialize concurrent seed invocations, including the empty-database check.
        await db.Database.ExecuteSqlRawAsync("SELECT pg_advisory_xact_lock(73942101)", cancellationToken);
        if (await db.Users.AnyAsync(cancellationToken))
        {
            await transaction.CommitAsync(cancellationToken);
            return;
        }
        if (await db.Rooms.AnyAsync(cancellationToken) || await db.Bookings.AnyAsync(cancellationToken))
            throw new InvalidOperationException("Seed requires an empty database; existing data was left unchanged.");

        var today = DateOnly.FromDateTime(TimeZoneInfo.ConvertTime(clock.GetUtcNow(), timeZone).DateTime);
        User[] users =
        [
            new() { Id = 1, Login = "student1", DisplayName = "Иван Студентов", Role = "student" },
            new() { Id = 2, Login = "student2", DisplayName = "Мария Студентова", Role = "student" },
            new() { Id = 3, Login = "admin", DisplayName = "Администратор Пупкин", Role = "admin" }
        ];
        var hasher = new PasswordHasher<User>();
        foreach (var user in users)
            user.PasswordHash = hasher.HashPassword(user, user.Login);
        db.Users.AddRange(users);
        db.Rooms.AddRange(
            new Room { Id = 1, Name = "A-101", Building = "A", Floor = 1, Capacity = 30, Equipment = ["projector", "whiteboard"] },
            new Room { Id = 2, Name = "A-102", Building = "A", Floor = 1, Capacity = 20, Equipment = ["whiteboard"] },
            new Room { Id = 3, Name = "A-203", Building = "A", Floor = 2, Capacity = 15, Equipment = ["computers", "projector"] },
            new Room { Id = 4, Name = "B-101", Building = "B", Floor = 1, Capacity = 40, Equipment = ["projector", "audio"] },
            new Room { Id = 5, Name = "B-204", Building = "B", Floor = 2, Capacity = 25, Equipment = ["projector", "whiteboard", "audio"] },
            new Room { Id = 6, Name = "B-305", Building = "B", Floor = 3, Capacity = 10, Equipment = ["whiteboard"] },
            new Room { Id = 7, Name = "C-110", Building = "C", Floor = 1, Capacity = 50, Equipment = ["projector", "audio", "video"] },
            new Room { Id = 8, Name = "C-210", Building = "C", Floor = 2, Capacity = 35, Equipment = ["computers"] },
            new Room { Id = 9, Name = "C-301", Building = "C", Floor = 3, Capacity = 12, Equipment = ["whiteboard", "projector"] },
            new Room { Id = 10, Name = "D-101", Building = "D", Floor = 1, Capacity = 60, Equipment = ["projector", "audio", "video"] },
            new Room { Id = 11, Name = "D-202", Building = "D", Floor = 2, Capacity = 18, Equipment = ["whiteboard"] },
            new Room { Id = 12, Name = "D-303", Building = "D", Floor = 3, Capacity = 24, Equipment = ["projector", "computers"] });
        db.Bookings.AddRange(
            new Booking { Id = 1, RoomId = 1, UserId = 1, Date = today.AddDays(1), StartTime = new(10, 0), EndTime = new(11, 30), Comment = "Консультация" },
            new Booking { Id = 2, RoomId = 1, UserId = 2, Date = today.AddDays(1), StartTime = new(14, 0), EndTime = new(15, 30), Comment = "Подготовка к семинару" },
            new Booking { Id = 3, RoomId = 4, UserId = 2, Date = today.AddDays(1), StartTime = new(9, 0), EndTime = new(10, 30), Comment = "Собрание группы" },
            new Booking { Id = 4, RoomId = 7, UserId = 3, Date = today.AddDays(1), StartTime = new(12, 0), EndTime = new(14, 0), Comment = "Встреча с деканом" },
            new Booking { Id = 5, RoomId = 1, UserId = 1, Date = today, StartTime = new(15, 0), EndTime = new(16, 0), Status = "cancelled", Comment = "Отменили" },
            new Booking { Id = 6, RoomId = 10, UserId = 2, Date = today.AddDays(2), StartTime = new(13, 0), EndTime = new(15, 0), Comment = "Лекция" },
            new Booking { Id = 7, RoomId = 5, UserId = 1, Date = today.AddDays(1), StartTime = new(16, 0), EndTime = new(17, 30), Comment = "Кружок" });
        await db.SaveChangesAsync(cancellationToken);
        // Explicit seed IDs must not collide with subsequent generated identities.
        await db.Database.ExecuteSqlRawAsync("""
            SELECT setval(pg_get_serial_sequence('"Users"', 'Id'), (SELECT MAX("Id") FROM "Users"));
            SELECT setval(pg_get_serial_sequence('"Rooms"', 'Id'), (SELECT MAX("Id") FROM "Rooms"));
            SELECT setval(pg_get_serial_sequence('"Bookings"', 'Id'), (SELECT MAX("Id") FROM "Bookings"));
            """, cancellationToken);
        await transaction.CommitAsync(cancellationToken);
    }
}
