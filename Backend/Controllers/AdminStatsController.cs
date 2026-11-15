using CampusFlow.Api.Configuration;
using CampusFlow.Api.Contracts;
using CampusFlow.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CampusFlow.Api.Controllers;

[ApiController]
[Authorize(Policy = AdminAccessRequirement.Policy)]
[Route("api/admin/stats")]
[ProducesResponseType<ApiError>(400)]
[ProducesResponseType(404)]
public sealed class AdminStatsController(StatsService stats) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<StatsResponse>(200)]
    public async Task<IActionResult> Get([FromQuery] StatsQuery query, CancellationToken cancellationToken) =>
        Ok(await stats.GetAsync(query, cancellationToken));
}
