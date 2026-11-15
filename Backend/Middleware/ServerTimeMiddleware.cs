using System.Globalization;

namespace CampusFlow.Api.Middleware;

public sealed record ServerTimeSnapshot(DateTime ServerTime, int UtcOffset);

public sealed class ServerTimeMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context, TimeProvider clock)
    {
        if (context.Request.Path.StartsWithSegments("/api"))
        {
            var utc = clock.GetUtcNow();
            var snapshot = new ServerTimeSnapshot(utc.UtcDateTime,
                (int)TimeZoneInfo.ConvertTime(utc, clock.LocalTimeZone).Offset.TotalMinutes);
            context.Items[typeof(ServerTimeSnapshot)] = snapshot;
            context.Response.OnStarting(() =>
            {
                context.Response.Headers["X-Server-Time"] = snapshot.ServerTime.ToString("O", CultureInfo.InvariantCulture);
                context.Response.Headers["X-Server-Utc-Offset"] = snapshot.UtcOffset.ToString(CultureInfo.InvariantCulture);
                return Task.CompletedTask;
            });
        }
        await next(context);
    }
}
