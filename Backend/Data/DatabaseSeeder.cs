using CampusFlow.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CampusFlow.Api.Data;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(CampusFlowDbContext db, TimeProvider clock,
        CancellationToken cancellationToken = default)
    {
        await using var transaction = await db.Database.BeginTransactionAsync(cancellationToken);

        await db.Database.ExecuteSqlRawAsync("SELECT pg_advisory_xact_lock(73942101)", cancellationToken);
        var today = DateOnly.FromDateTime(clock.GetLocalNow().DateTime);
        User[] users =
        [
            new() { Login = "student1", DisplayName = "Иван Студентов", Role = "student" },
            new() { Login = "student2", DisplayName = "Мария Студентова", Role = "student" },
            new() { Login = "admin", DisplayName = "Администратор Пупкин", Role = "admin" }
        ];
        var hasher = new PasswordHasher<User>();
        foreach (var user in users)
        {
            if (!await db.Users.AnyAsync(existing => existing.Login == user.Login, cancellationToken))
            {
                user.PasswordHash = hasher.HashPassword(user, user.Login);
                db.Users.Add(user);
            }
        }
        Room[] rooms =
        [

            new Room { Name = "A-101", Building = "A", Floor = 1, Capacity = 30, Equipment = ["projector", "whiteboard"] },
            new Room { Name = "A-102", Building = "A", Floor = 1, Capacity = 20, Equipment = ["whiteboard"] },
            new Room { Name = "A-203", Building = "A", Floor = 2, Capacity = 15, Equipment = ["computers", "projector"] },
            new Room { Name = "B-101", Building = "B", Floor = 1, Capacity = 40, Equipment = ["projector", "audio"] },
            new Room { Name = "B-204", Building = "B", Floor = 2, Capacity = 25, Equipment = ["projector", "whiteboard", "audio"] },
            new Room { Name = "B-305", Building = "B", Floor = 3, Capacity = 10, Equipment = ["whiteboard"] },
            new Room { Name = "C-110", Building = "C", Floor = 1, Capacity = 50, Equipment = ["projector", "audio", "video"] },
            new Room { Name = "C-210", Building = "C", Floor = 2, Capacity = 35, Equipment = ["computers"] },
            new Room { Name = "C-301", Building = "C", Floor = 3, Capacity = 12, Equipment = ["whiteboard", "projector"] },
            new Room { Name = "D-101", Building = "D", Floor = 1, Capacity = 60, Equipment = ["projector", "audio", "video"] },
            new Room { Name = "D-202", Building = "D", Floor = 2, Capacity = 18, Equipment = ["whiteboard"] },
            new Room { Name = "D-303", Building = "D", Floor = 3, Capacity = 24, Equipment = ["projector", "computers"] }
        ];
        foreach (var room in rooms)
        {
            if (!await db.Rooms.AnyAsync(existing => existing.Name == room.Name, cancellationToken))
                db.Rooms.Add(room);
        }
        await db.SaveChangesAsync(cancellationToken);
        var userIds = await db.Users.ToDictionaryAsync(user => user.Login, user => user.Id, cancellationToken);
        var roomIds = await db.Rooms.ToDictionaryAsync(room => room.Name, room => room.Id, cancellationToken);
        Booking[] bookings =
        [
            new Booking { RoomId = roomIds["A-101"], UserId = userIds["student1"], Date = today.AddDays(1), StartTime = new(10, 0), EndTime = new(11, 30), Comment = "Консультация" },
            new Booking { RoomId = roomIds["A-101"], UserId = userIds["student2"], Date = today.AddDays(1), StartTime = new(14, 0), EndTime = new(15, 30), Comment = "Подготовка к семинару" },
            new Booking { RoomId = roomIds["B-101"], UserId = userIds["student2"], Date = today.AddDays(1), StartTime = new(9, 0), EndTime = new(10, 30), Comment = "Собрание группы" },
            new Booking { RoomId = roomIds["A-101"], UserId = userIds["student1"], Date = today, StartTime = new(15, 0), EndTime = new(16, 0), Status = "cancelled", Comment = "Отменили" },
            new Booking { RoomId = roomIds["D-101"], UserId = userIds["student2"], Date = today.AddDays(2), StartTime = new(13, 0), EndTime = new(15, 0), Comment = "Лекция" },
            new Booking { RoomId = roomIds["B-204"], UserId = userIds["student1"], Date = today.AddDays(1), StartTime = new(16, 0), EndTime = new(17, 30), Comment = "Кружок" }
        ];
        foreach (var booking in bookings)
        {
            var exists = await db.Bookings.AnyAsync(existing =>
                existing.UserId == booking.UserId && existing.RoomId == booking.RoomId &&
                existing.Date == booking.Date && existing.StartTime == booking.StartTime &&
                existing.EndTime == booking.EndTime, cancellationToken);
            if (!exists)
                db.Bookings.Add(booking);
        }
        await db.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);
    }
}
