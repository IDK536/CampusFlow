using System.Globalization;
using System.Security.Claims;
using CampusFlow.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace CampusFlow.Api.Configuration;

public sealed class AdminAccessRequirement : IAuthorizationRequirement
{
    public const string Policy = "AdminAccess";
}

public sealed class AdminAuthorizationHandler(CampusFlowDbContext db, ILogger<AdminAuthorizationHandler> logger)
    : AuthorizationHandler<AdminAccessRequirement>
{
    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, AdminAccessRequirement requirement)
    {
        if (context.User.Identity?.IsAuthenticated != true || !context.User.IsInRole("admin")
            || !int.TryParse(context.User.FindFirstValue("sub"), NumberStyles.None, CultureInfo.InvariantCulture, out var userId) || userId <= 0)
        {
            logger.LogInformation("Administrative access denied: no authenticated administrator claim.");
            return;
        }
        var cancellationToken = (context.Resource as HttpContext)?.RequestAborted ?? CancellationToken.None;
        if (await db.Users.AnyAsync(user => user.Id == userId && user.Role == "admin", cancellationToken))
            context.Succeed(requirement);
        else
            logger.LogInformation("Administrative access denied: account {UserId} is missing or is no longer an administrator.", userId);
    }
}
