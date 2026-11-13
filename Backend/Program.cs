using CampusFlow.Api.Data;
using Microsoft.EntityFrameworkCore;

var seedRequested = args.Contains("--seed");
var builder = WebApplication.CreateBuilder(args.Where(x => x != "--seed").ToArray());
builder.Services.AddDbContext<CampusFlowDbContext>(options => options.UseNpgsql(
    builder.Configuration.GetConnectionString("CampusFlow")
    ?? throw new InvalidOperationException("Set ConnectionStrings:CampusFlow before accessing the database.")));

var app = builder.Build();

if (seedRequested)
{
    var timeZoneId = builder.Configuration["Campus:TimeZone"]
        ?? throw new InvalidOperationException("Set Campus:TimeZone explicitly before loading seed data.");
    var timeZone = TimeZoneInfo.FindSystemTimeZoneById(timeZoneId);
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<CampusFlowDbContext>();
    await db.Database.MigrateAsync();
    await DatabaseSeeder.SeedAsync(db, TimeProvider.System, timeZone);
    return;
}

await app.RunAsync();
