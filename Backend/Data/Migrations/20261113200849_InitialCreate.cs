using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace CampusFlow.Api.Data.Migrations
{

    public partial class InitialCreate : Migration
    {

        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:PostgresExtension:btree_gist", ",,");

            migrationBuilder.CreateTable(
                name: "Rooms",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Building = table.Column<string>(type: "text", nullable: false),
                    Floor = table.Column<int>(type: "integer", nullable: false),
                    Capacity = table.Column<int>(type: "integer", nullable: false),
                    Equipment = table.Column<string[]>(type: "text[]", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rooms", x => x.Id);
                    table.CheckConstraint("CK_Rooms_Building", "\"Building\" IN ('A', 'B', 'C', 'D')");
                    table.CheckConstraint("CK_Rooms_Capacity", "\"Capacity\" > 0");
                    table.CheckConstraint("CK_Rooms_Equipment", "\"Equipment\" <@ ARRAY['projector','whiteboard','computers','audio','video']::text[] AND array_position(\"Equipment\", NULL) IS NULL");
                    table.CheckConstraint("CK_Rooms_Floor", "\"Floor\" >= 1");
                    table.CheckConstraint("CK_Rooms_Name", "length(btrim(\"Name\")) > 0");
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Login = table.Column<string>(type: "text", nullable: false),
                    DisplayName = table.Column<string>(type: "text", nullable: false),
                    Role = table.Column<string>(type: "text", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                    table.CheckConstraint("CK_Users_Role", "\"Role\" IN ('student', 'admin')");
                });

            migrationBuilder.CreateTable(
                name: "Bookings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RoomId = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    Date = table.Column<DateOnly>(type: "date", nullable: false),
                    StartTime = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    EndTime = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    Comment = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bookings", x => x.Id);
                    table.CheckConstraint("CK_Bookings_Grid", "EXTRACT(MINUTE FROM \"StartTime\") IN (0, 30) AND EXTRACT(SECOND FROM \"StartTime\") = 0 AND EXTRACT(MINUTE FROM \"EndTime\") IN (0, 30) AND EXTRACT(SECOND FROM \"EndTime\") = 0");
                    table.CheckConstraint("CK_Bookings_Interval", "\"StartTime\" < \"EndTime\" AND \"StartTime\" >= TIME '09:00' AND \"EndTime\" <= TIME '18:00'");
                    table.CheckConstraint("CK_Bookings_Status", "\"Status\" IN ('active', 'cancelled')");
                    table.ForeignKey(
                        name: "FK_Bookings_Rooms_RoomId",
                        column: x => x.RoomId,
                        principalTable: "Rooms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Bookings_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_RoomId_Date",
                table: "Bookings",
                columns: new[] { "RoomId", "Date" });

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_UserId",
                table: "Bookings",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Rooms_Name",
                table: "Rooms",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Login",
                table: "Users",
                column: "Login",
                unique: true);

            migrationBuilder.Sql("""
                ALTER TABLE "Bookings"
                ADD CONSTRAINT "Bookings_NoOverlap"
                EXCLUDE USING gist (
                    "RoomId" WITH =,
                    tsrange("Date" + "StartTime", "Date" + "EndTime", '[)') WITH &&
                ) WHERE ("Status" = 'active');
                """);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Bookings");

            migrationBuilder.DropTable(
                name: "Rooms");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
