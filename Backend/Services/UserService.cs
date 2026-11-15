using CampusFlow.Api.Contracts;
using CampusFlow.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace CampusFlow.Api.Services;

public sealed class UserService(CampusFlowDbContext db)
{
    public Task<UserResponse[]> GetStudentsAsync(CancellationToken cancellationToken) => db.Users.AsNoTracking()
        .Where(user => user.Role == "student")
        .OrderBy(user => user.DisplayName).ThenBy(user => user.Id)
        .Select(user => new UserResponse(user.Id, user.Login, user.DisplayName, user.Role))
        .ToArrayAsync(cancellationToken);
}
