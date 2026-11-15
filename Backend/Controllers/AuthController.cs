using CampusFlow.Api.Contracts;
using CampusFlow.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace CampusFlow.Api.Controllers;

[ApiController]
[Route("api/auth")]
[ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
[ProducesResponseType<ApiError>(403)]
public sealed class AuthController(AuthService auth, IConfiguration configuration) : ControllerBase
{
    private const string CookieName = "campusflow_refresh";

    [HttpPost("login")]
    [Consumes("application/json")]
    [ProducesResponseType<AuthResponse>(200)]
    [ProducesResponseType<ApiError>(400)]
    [ProducesResponseType<ApiError>(401)]
    public async Task<IActionResult> Login(LoginRequest request, CancellationToken cancellationToken)
    {
        if (!IsAllowedOrigin())
            return StatusCode(403, new ApiError("FORBIDDEN", "Источник запроса не разрешён"));
        var result = await auth.LoginAsync(request.Login!, request.Password!, cancellationToken);
        if (result is null)
            return Unauthorized(new ApiError("UNAUTHORIZED", "Неверный логин или пароль"));
        WriteCookie(result);
        return Ok(result.Response);
    }

    [HttpPost("refresh")]
    [ProducesResponseType<AuthResponse>(200)]
    [ProducesResponseType<ApiError>(401)]
    public async Task<IActionResult> Refresh(CancellationToken cancellationToken)
    {
        if (!IsAllowedOrigin())
            return StatusCode(403, new ApiError("FORBIDDEN", "Источник запроса не разрешён"));
        var rawToken = Request.Cookies[CookieName];
        var result = string.IsNullOrEmpty(rawToken) ? null : await auth.RefreshAsync(rawToken, cancellationToken);
        if (result is null)
        {
            Response.Cookies.Delete(CookieName, CookieOptions());
            return Unauthorized(new ApiError("UNAUTHORIZED", "Требуется повторный вход"));
        }
        WriteCookie(result);
        return Ok(result.Response);
    }

    [HttpPost("logout")]
    [ProducesResponseType(204)]
    public async Task<IActionResult> Logout(CancellationToken cancellationToken)
    {
        if (!IsAllowedOrigin())
            return StatusCode(403, new ApiError("FORBIDDEN", "Источник запроса не разрешён"));
        var rawToken = Request.Cookies[CookieName];
        if (!string.IsNullOrEmpty(rawToken))
            await auth.LogoutAsync(rawToken, cancellationToken);
        Response.Cookies.Delete(CookieName, CookieOptions());
        return NoContent();
    }

    private void WriteCookie(AuthResult result)
    {
        var options = CookieOptions();
        options.Expires = result.ExpiresAt;
        Response.Cookies.Append(CookieName, result.RefreshToken, options);
        Response.Headers.CacheControl = "no-store";
    }

    private static CookieOptions CookieOptions() => new()
    {
        HttpOnly = true, Secure = true, SameSite = SameSiteMode.Lax, Path = "/api/auth", IsEssential = true
    };

    private bool IsAllowedOrigin()
    {
        var origin = Request.Headers.Origin.ToString();
        if (string.IsNullOrEmpty(origin))
            return Request.Headers["Sec-Fetch-Site"] != "cross-site";
        var allowed = configuration.GetSection("Auth:AllowedOrigins").Get<string[]>() ?? [];
        return origin == $"{Request.Scheme}://{Request.Host}" || allowed.Contains(origin, StringComparer.OrdinalIgnoreCase);
    }
}
