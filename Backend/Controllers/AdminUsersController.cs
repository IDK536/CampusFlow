using CampusFlow.Api.Configuration;
using CampusFlow.Api.Contracts;
using CampusFlow.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CampusFlow.Api.Controllers;

[ApiController]
[Authorize(Policy = AdminAccessRequirement.Policy)]
[Route("api/admin/users")]
[ProducesResponseType(404)]
public sealed class AdminUsersController(UserService users) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<UserResponse[]>(200)]
    public async Task<IActionResult> GetStudents(CancellationToken cancellationToken) =>
        Ok(await users.GetStudentsAsync(cancellationToken));
}
