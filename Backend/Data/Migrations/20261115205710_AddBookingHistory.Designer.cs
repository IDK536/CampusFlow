using System;
using CampusFlow.Api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace CampusFlow.Api.Data.Migrations
{
    [DbContext(typeof(CampusFlowDbContext))]
    [Migration("20261115205710_AddBookingHistory")]
    partial class AddBookingHistory
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "10.0.12")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.HasPostgresExtension(modelBuilder, "btree_gist");
            NpgsqlModelBuilderExtensions.UseIdentityAlwaysColumns(modelBuilder);

            modelBuilder.Entity("CampusFlow.Api.Models.Booking", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityAlwaysColumn(b.Property<int>("Id"));

                    b.Property<DateTimeOffset?>("CancelledAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("CancelledBy")
                        .HasMaxLength(5)
                        .HasColumnType("character varying(5)");

                    b.Property<string>("Comment")
                        .HasColumnType("text");

                    b.Property<DateTimeOffset?>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone")
                        .HasDefaultValueSql("clock_timestamp()");

                    b.Property<DateOnly>("Date")
                        .HasColumnType("date");

                    b.Property<TimeOnly>("EndTime")
                        .HasColumnType("time without time zone");

                    b.Property<int>("RoomId")
                        .HasColumnType("integer");

                    b.Property<TimeOnly>("StartTime")
                        .HasColumnType("time without time zone");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("UserId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.HasIndex("RoomId", "Date");

                    b.ToTable("Bookings", null, t =>
                        {
                            t.HasCheckConstraint("CK_Bookings_CancelledBy", "\"CancelledBy\" IS NULL OR \"CancelledBy\" IN ('owner', 'admin')");

                            t.HasCheckConstraint("CK_Bookings_Grid", "EXTRACT(MINUTE FROM \"StartTime\") IN (0, 30) AND EXTRACT(SECOND FROM \"StartTime\") = 0 AND EXTRACT(MINUTE FROM \"EndTime\") IN (0, 30) AND EXTRACT(SECOND FROM \"EndTime\") = 0");

                            t.HasCheckConstraint("CK_Bookings_Interval", "\"StartTime\" < \"EndTime\" AND \"StartTime\" >= TIME '09:00' AND \"EndTime\" <= TIME '18:00'");

                            t.HasCheckConstraint("CK_Bookings_Status", "\"Status\" IN ('active', 'cancelled')");
                        });
                });

            modelBuilder.Entity("CampusFlow.Api.Models.RefreshToken", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityAlwaysColumn(b.Property<long>("Id"));

                    b.Property<DateTimeOffset>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTimeOffset>("ExpiresAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTimeOffset?>("RevokedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid>("SessionId")
                        .HasColumnType("uuid");

                    b.Property<string>("TokenHash")
                        .IsRequired()
                        .HasMaxLength(64)
                        .HasColumnType("character varying(64)");

                    b.Property<DateTimeOffset?>("UsedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("UserId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("SessionId");

                    b.HasIndex("TokenHash")
                        .IsUnique();

                    b.HasIndex("UserId");

                    b.ToTable("RefreshTokens", null, t =>
                        {
                            t.HasCheckConstraint("CK_RefreshTokens_Expiry", "\"ExpiresAt\" > \"CreatedAt\"");
                        });
                });

            modelBuilder.Entity("CampusFlow.Api.Models.Room", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityAlwaysColumn(b.Property<int>("Id"));

                    b.Property<string>("Building")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("Capacity")
                        .HasColumnType("integer");

                    b.PrimitiveCollection<string[]>("Equipment")
                        .IsRequired()
                        .HasColumnType("text[]");

                    b.Property<int>("Floor")
                        .HasColumnType("integer");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.ToTable("Rooms", null, t =>
                        {
                            t.HasCheckConstraint("CK_Rooms_Building", "\"Building\" IN ('A', 'B', 'C', 'D')");

                            t.HasCheckConstraint("CK_Rooms_Capacity", "\"Capacity\" > 0");

                            t.HasCheckConstraint("CK_Rooms_Equipment", "\"Equipment\" <@ ARRAY['projector','whiteboard','computers','audio','video']::text[]");

                            t.HasCheckConstraint("CK_Rooms_Floor", "\"Floor\" >= 1");

                            t.HasCheckConstraint("CK_Rooms_Name", "length(btrim(\"Name\")) > 0");
                        });
                });

            modelBuilder.Entity("CampusFlow.Api.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityAlwaysColumn(b.Property<int>("Id"));

                    b.Property<string>("DisplayName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Login")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("Login")
                        .IsUnique();

                    b.ToTable("Users", null, t =>
                        {
                            t.HasCheckConstraint("CK_Users_DisplayName", "\"DisplayName\" ~ '[^[:space:]]'");

                            t.HasCheckConstraint("CK_Users_Login", "\"Login\" ~ '[^[:space:]]'");

                            t.HasCheckConstraint("CK_Users_Role", "\"Role\" IN ('student', 'admin')");
                        });
                });

            modelBuilder.Entity("CampusFlow.Api.Models.Booking", b =>
                {
                    b.HasOne("CampusFlow.Api.Models.Room", null)
                        .WithMany()
                        .HasForeignKey("RoomId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("CampusFlow.Api.Models.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                });

            modelBuilder.Entity("CampusFlow.Api.Models.RefreshToken", b =>
                {
                    b.HasOne("CampusFlow.Api.Models.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
