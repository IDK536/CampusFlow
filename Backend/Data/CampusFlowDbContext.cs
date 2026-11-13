using CampusFlow.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CampusFlow.Api.Data;

public sealed class CampusFlowDbContext(DbContextOptions<CampusFlowDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Room> Rooms => Set<Room>();
    public DbSet<Booking> Bookings => Set<Booking>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasPostgresExtension("btree_gist");

        var users = modelBuilder.Entity<User>();
        users.ToTable("Users", table => table.HasCheckConstraint("CK_Users_Role", "\"Role\" IN ('student', 'admin')"));
        users.HasKey(x => x.Id);
        users.HasIndex(x => x.Login).IsUnique();
        users.Property(x => x.Login).IsRequired();
        users.Property(x => x.DisplayName).IsRequired();
        users.Property(x => x.Role).IsRequired();
        users.Property(x => x.PasswordHash).IsRequired();

        var rooms = modelBuilder.Entity<Room>();
        rooms.ToTable("Rooms", table =>
        {
            table.HasCheckConstraint("CK_Rooms_Name", "length(btrim(\"Name\")) > 0");
            table.HasCheckConstraint("CK_Rooms_Building", "\"Building\" IN ('A', 'B', 'C', 'D')");
            table.HasCheckConstraint("CK_Rooms_Floor", "\"Floor\" >= 1");
            table.HasCheckConstraint("CK_Rooms_Capacity", "\"Capacity\" > 0");
            table.HasCheckConstraint("CK_Rooms_Equipment", "\"Equipment\" <@ ARRAY['projector','whiteboard','computers','audio','video']::text[] AND array_position(\"Equipment\", NULL) IS NULL");
        });
        rooms.HasKey(x => x.Id);
        rooms.HasIndex(x => x.Name).IsUnique();
        rooms.Property(x => x.Name).IsRequired();
        rooms.Property(x => x.Building).IsRequired();
        rooms.Property(x => x.Equipment).HasColumnType("text[]").IsRequired();

        var bookings = modelBuilder.Entity<Booking>();
        bookings.ToTable("Bookings", table =>
        {
            table.HasCheckConstraint("CK_Bookings_Status", "\"Status\" IN ('active', 'cancelled')");
            table.HasCheckConstraint("CK_Bookings_Interval", "\"StartTime\" < \"EndTime\" AND \"StartTime\" >= TIME '09:00' AND \"EndTime\" <= TIME '18:00'");
            table.HasCheckConstraint("CK_Bookings_Grid", "EXTRACT(MINUTE FROM \"StartTime\") IN (0, 30) AND EXTRACT(SECOND FROM \"StartTime\") = 0 AND EXTRACT(MINUTE FROM \"EndTime\") IN (0, 30) AND EXTRACT(SECOND FROM \"EndTime\") = 0");
        });
        bookings.HasKey(x => x.Id);
        bookings.Property(x => x.Date).HasColumnType("date");
        bookings.Property(x => x.StartTime).HasColumnType("time without time zone");
        bookings.Property(x => x.EndTime).HasColumnType("time without time zone");
        bookings.Property(x => x.Status).IsRequired();
        // Preserve booking history: deletion policy for rooms will be implemented with admin CRUD.
        bookings.HasOne<Room>().WithMany().HasForeignKey(x => x.RoomId).OnDelete(DeleteBehavior.Restrict);
        bookings.HasOne<User>().WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Restrict);
        bookings.HasIndex(x => new { x.RoomId, x.Date });
    }
}
