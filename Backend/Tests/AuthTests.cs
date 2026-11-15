using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using CampusFlow.Api.Contracts;
using CampusFlow.Api.Data;
using CampusFlow.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.IdentityModel.Tokens;
using Xunit;

namespace CampusFlow.Api.Tests;

public sealed class AuthTests : IAsyncLifetime
{
    private readonly string login = "auth_" + Guid.NewGuid().ToString("N");
    private const string Password = " secret password ";
    private readonly string signingKey = Convert.ToBase64String(RandomNumberGenerator.GetBytes(48));
    private readonly TestClock clock = new();
    private WebApplicationFactory<Program> factory = null!;
    private HttpClient client = null!;
    private string connection = null!;

    public async Task InitializeAsync()
    {
        DotNetEnv.Env.NoClobber().TraversePath().Load();
        connection = Environment.GetEnvironmentVariable("CAMPUSFLOW_TEST_CONNECTION")
            ?? throw new InvalidOperationException("CAMPUSFLOW_TEST_CONNECTION is required.");
        if (new Npgsql.NpgsqlConnectionStringBuilder(connection).Database != "campusflow_test")
            throw new InvalidOperationException("Auth tests require campusflow_test.");
        await using var db = CreateDbContext();
        await db.Database.OpenConnectionAsync();
        await TestDatabase.MigrateAsync(db);
        var user = new User { Login = login, DisplayName = "Auth Test", Role = "student" };
        user.PasswordHash = new PasswordHasher<User>().HashPassword(user, Password);
        db.Users.Add(user);
        await db.SaveChangesAsync();
        factory = new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
        {
            builder.ConfigureAppConfiguration((_, configuration) => configuration.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:CampusFlow"] = connection,
                ["Jwt:Key"] = signingKey, ["Jwt:Issuer"] = "CampusFlow", ["Jwt:Audience"] = "CampusFlowClient",
                ["Auth:CookieSecure"] = "true",
                ["Jwt:AccessTokenMinutes"] = "60", ["Jwt:RefreshTokenDays"] = "7"
            }));
            builder.ConfigureServices(services =>
            {
                services.RemoveAll<TimeProvider>();
                services.AddSingleton<TimeProvider>(clock);
                services.AddControllers().AddApplicationPart(typeof(AuthProbeController).Assembly);
            });
        });
        client = factory.CreateClient(new WebApplicationFactoryClientOptions { BaseAddress = new Uri("https://localhost"), HandleCookies = false });
    }

    public async Task DisposeAsync()
    {
        client?.Dispose();
        if (factory is not null)
            await factory.DisposeAsync();
        if (connection is null)
            return;
        await using var db = CreateDbContext();
        await using var transaction = await db.Database.BeginTransactionAsync();
        var userIds = db.Users.Where(user => user.Login == login).Select(user => user.Id);
        await db.RefreshTokens.Where(token => userIds.Contains(token.UserId)).ExecuteDeleteAsync();
        await db.Users.Where(user => user.Login == login).ExecuteDeleteAsync();
        await transaction.CommitAsync();
    }

    [Theory]
    [InlineData("student")]
    [InlineData("admin")]
    public async Task LoginReturnsSignedJwtAndHttpOnlyRefreshCookie(string role)
    {
        await using var db = CreateDbContext();
        await db.Users.Where(user => user.Login == login).ExecuteUpdateAsync(update => update.SetProperty(user => user.Role, role));

        using var response = await LoginAsync();
        var result = await response.Content.ReadFromJsonAsync<AuthResponse>();
        var cookieHeader = response.Headers.GetValues("Set-Cookie").Single();
        var cookie = Cookie(response);
        var principal = new JwtSecurityTokenHandler().ValidateToken(result!.Token, new TokenValidationParameters
        {
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signingKey)),
            ValidIssuer = "CampusFlow", ValidAudience = "CampusFlowClient", ClockSkew = TimeSpan.Zero
        }, out var validated);
        var stored = await db.RefreshTokens.SingleAsync(token => token.UserId == result.User.Id);
        using var body = JsonDocument.Parse(await response.Content.ReadAsStringAsync());

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal(role, result.User.Role);
        Assert.Equal(login, result.User.Login);
        Assert.Contains(principal.Claims, claim => claim.Value == role);
        Assert.Equal(clock.GetUtcNow().AddMinutes(60).ToUnixTimeSeconds(), new DateTimeOffset(validated.ValidTo).ToUnixTimeSeconds());
        Assert.Equal(clock.GetUtcNow().AddDays(7), stored.ExpiresAt);
        Assert.Equal(Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(cookie.Split('=', 2)[1]))), stored.TokenHash);
        Assert.Contains("httponly", cookieHeader.ToLowerInvariant());
        Assert.Contains("secure", cookieHeader.ToLowerInvariant());
        Assert.Contains("samesite=lax", cookieHeader.ToLowerInvariant());
        Assert.Contains("path=/api/auth", cookieHeader);
        Assert.Equal("no-store", response.Headers.CacheControl?.ToString());
        Assert.False(body.RootElement.GetProperty("user").TryGetProperty("passwordHash", out _));
        Assert.False(body.RootElement.TryGetProperty("refreshToken", out _));
    }

    [Theory]
    [InlineData(null, "password")]
    [InlineData("", "password")]
    [InlineData("   ", "password")]
    [InlineData("login", null)]
    [InlineData("login", "")]
    public async Task InvalidLoginInputReturnsValidationError(string? requestedLogin, string? password)
    {
        var request = new { login = requestedLogin, password };

        using var response = await client.PostAsJsonAsync("/api/auth/login", request);
        var error = await response.Content.ReadFromJsonAsync<ApiError>();

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal("VALIDATION_ERROR", error!.Code);
        Assert.False(response.Headers.Contains("Set-Cookie"));
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public async Task WrongCredentialsReturnUnauthorized(bool unknownUser)
    {
        var requestedLogin = unknownUser ? "missing_" + Guid.NewGuid().ToString("N") : login;

        using var response = await client.PostAsJsonAsync("/api/auth/login", new { login = requestedLogin, password = "wrong" });
        var error = await response.Content.ReadFromJsonAsync<ApiError>();
        await using var db = CreateDbContext();

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        Assert.Equal("UNAUTHORIZED", error!.Code);
        Assert.Equal("Неверный логин или пароль", error.Message);
        Assert.False(response.Headers.Contains("Set-Cookie"));
        Assert.False(await db.RefreshTokens.AnyAsync(token => db.Users.Any(user => user.Id == token.UserId && user.Login == login)));
    }

    [Fact]
    public async Task RotationAndOldTokenReuseRevokeTheWholeSession()
    {
        using var initial = await LoginAsync();
        var oldCookie = Cookie(initial);

        using var rotated = await PostCookieAsync("refresh", oldCookie);
        var newCookie = Cookie(rotated);
        using var reuse = await PostCookieAsync("refresh", oldCookie);
        using var revoked = await PostCookieAsync("refresh", newCookie);
        await using var db = CreateDbContext();
        var tokens = await db.RefreshTokens.Where(token => db.Users.Any(user => user.Id == token.UserId && user.Login == login)).ToListAsync();

        Assert.Equal(HttpStatusCode.OK, rotated.StatusCode);
        Assert.NotEqual(oldCookie, newCookie);
        Assert.Equal(HttpStatusCode.Unauthorized, reuse.StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, revoked.StatusCode);
        Assert.Equal(2, tokens.Count);
        Assert.All(tokens, token => Assert.NotNull(token.RevokedAt));
        Assert.Single(tokens, token => token.UsedAt is not null);
    }

    [Fact]
    public async Task ConcurrentRefreshConsumesTokenOnceAndDetectsReuse()
    {
        using var initial = await LoginAsync();
        var cookie = Cookie(initial);

        var responses = await Task.WhenAll(PostCookieAsync("refresh", cookie), PostCookieAsync("refresh", cookie));
        var statuses = responses.Select(response => response.StatusCode).ToArray();
        var accepted = responses.FirstOrDefault(response => response.StatusCode == HttpStatusCode.OK);
        var nextCookie = accepted is null ? cookie : Cookie(accepted);
        using var rejected = await PostCookieAsync("refresh", nextCookie);
        foreach (var response in responses)
            response.Dispose();

        Assert.Single(statuses, status => status == HttpStatusCode.OK);
        Assert.Single(statuses, status => status == HttpStatusCode.Unauthorized);
        Assert.Equal(HttpStatusCode.Unauthorized, rejected.StatusCode);
    }

    [Fact]
    public async Task RefreshKeepsOriginalExpiryAndRejectsExpiredToken()
    {
        using var initial = await LoginAsync();
        await using var db = CreateDbContext();
        var userId = await db.Users.Where(user => user.Login == login).Select(user => user.Id).SingleAsync();
        var originalExpiry = await db.RefreshTokens.Where(token => token.UserId == userId).Select(token => token.ExpiresAt).SingleAsync();
        clock.Advance(TimeSpan.FromDays(2));

        using var rotated = await PostCookieAsync("refresh", Cookie(initial));
        var nextCookie = Cookie(rotated);
        var expiries = await db.RefreshTokens.Where(token => token.UserId == userId).Select(token => token.ExpiresAt).ToListAsync();
        clock.Advance(TimeSpan.FromDays(5));
        using var expired = await PostCookieAsync("refresh", nextCookie);

        Assert.Equal(HttpStatusCode.OK, rotated.StatusCode);
        Assert.Equal(2, expiries.Count);
        Assert.All(expiries, expiry => Assert.Equal(originalExpiry, expiry));
        Assert.Equal(HttpStatusCode.Unauthorized, expired.StatusCode);
    }

    [Fact]
    public async Task LogoutRevokesOnlyTheCurrentSession()
    {
        using var first = await LoginAsync();
        using var second = await LoginAsync();

        using var logout = await PostCookieAsync("logout", Cookie(first));
        using var rejected = await PostCookieAsync("refresh", Cookie(first));
        using var otherSession = await PostCookieAsync("refresh", Cookie(second));

        Assert.Equal(HttpStatusCode.NoContent, logout.StatusCode);
        Assert.Contains("expires=", logout.Headers.GetValues("Set-Cookie").Single());
        Assert.Equal(HttpStatusCode.Unauthorized, rejected.StatusCode);
        Assert.Equal(HttpStatusCode.OK, otherSession.StatusCode);
    }

    [Fact]
    public async Task CookieEndpointsRejectForeignOriginsAndMissingRefresh()
    {
        using var initial = await LoginAsync();
        using var request = new HttpRequestMessage(HttpMethod.Post, "/api/auth/refresh");
        request.Headers.Add("Cookie", Cookie(initial));
        request.Headers.Add("Origin", "https://untrusted.example");

        using var foreign = await client.SendAsync(request);
        using var missing = await PostCookieAsync("refresh", "");
        using var stillValid = await PostCookieAsync("refresh", Cookie(initial));

        Assert.Equal(HttpStatusCode.Forbidden, foreign.StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, missing.StatusCode);
        Assert.Equal(HttpStatusCode.OK, stillValid.StatusCode);
    }

    [Fact]
    public async Task BearerMiddlewareChecksTokenAndRole()
    {
        using var initial = await LoginAsync();
        var result = await initial.Content.ReadFromJsonAsync<AuthResponse>();
        var expired = new JwtSecurityToken("CampusFlow", "CampusFlowClient", [new Claim("sub", result!.User.Id.ToString())],
            DateTime.UtcNow.AddHours(-2), DateTime.UtcNow.AddHours(-1),
            new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signingKey)), SecurityAlgorithms.HmacSha256));
        using var validRequest = new HttpRequestMessage(HttpMethod.Get, "/test-auth/current");
        validRequest.Headers.Authorization = new("Bearer", result.Token);
        using var roleRequest = new HttpRequestMessage(HttpMethod.Get, "/test-auth/admin");
        roleRequest.Headers.Authorization = new("Bearer", result.Token);
        using var expiredRequest = new HttpRequestMessage(HttpMethod.Get, "/test-auth/current");
        expiredRequest.Headers.Authorization = new("Bearer", new JwtSecurityTokenHandler().WriteToken(expired));
        using var invalidRequest = new HttpRequestMessage(HttpMethod.Get, "/test-auth/current");
        invalidRequest.Headers.Authorization = new("Bearer", "invalid-token");
        var forged = new JwtSecurityToken("CampusFlow", "CampusFlowClient", [new Claim("role", "admin")],
            DateTime.UtcNow.AddMinutes(-1), DateTime.UtcNow.AddMinutes(10),
            new SigningCredentials(new SymmetricSecurityKey(RandomNumberGenerator.GetBytes(32)), SecurityAlgorithms.HmacSha256));
        using var forgedRequest = new HttpRequestMessage(HttpMethod.Get, "/test-auth/current");
        forgedRequest.Headers.Authorization = new("Bearer", new JwtSecurityTokenHandler().WriteToken(forged));

        using var valid = await client.SendAsync(validRequest);
        using var forbidden = await client.SendAsync(roleRequest);
        using var missing = await client.GetAsync("/test-auth/current");
        using var expiredResponse = await client.SendAsync(expiredRequest);
        using var invalid = await client.SendAsync(invalidRequest);
        using var forgedResponse = await client.SendAsync(forgedRequest);
        var forbiddenError = await forbidden.Content.ReadFromJsonAsync<ApiError>();
        var unauthorizedError = await missing.Content.ReadFromJsonAsync<ApiError>();

        Assert.Equal(HttpStatusCode.OK, valid.StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, forbidden.StatusCode);
        Assert.Equal("FORBIDDEN", forbiddenError!.Code);
        Assert.Equal(HttpStatusCode.Unauthorized, missing.StatusCode);
        Assert.Equal("UNAUTHORIZED", unauthorizedError!.Code);
        Assert.Equal(HttpStatusCode.Unauthorized, expiredResponse.StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, invalid.StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, forgedResponse.StatusCode);
    }

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public async Task CookieConfigurationSupportsLoginRefreshAndLogout(bool secure)
    {
        await using var configured = factory.WithWebHostBuilder(builder => builder.ConfigureAppConfiguration((_, configuration) =>
            configuration.AddInMemoryCollection(new Dictionary<string, string?> { ["Auth:CookieSecure"] = secure.ToString() })));
        using var browser = configured.CreateClient(new WebApplicationFactoryClientOptions
        {
            BaseAddress = new Uri(secure ? "https://localhost" : "http://localhost"), HandleCookies = true
        });

        using var initial = await browser.PostAsJsonAsync("/api/auth/login", new { login, password = Password });
        var initialCookie = initial.Headers.GetValues("Set-Cookie").Single();
        using var refreshed = await browser.PostAsync("/api/auth/refresh", null);
        var refreshCookie = refreshed.Headers.GetValues("Set-Cookie").Single();
        using var logout = await browser.PostAsync("/api/auth/logout", null);
        var deletedCookie = logout.Headers.GetValues("Set-Cookie").Single();
        using var rejected = await browser.PostAsync("/api/auth/refresh", null);

        Assert.Equal(HttpStatusCode.OK, initial.StatusCode);
        Assert.Equal(HttpStatusCode.OK, refreshed.StatusCode);
        Assert.Equal(HttpStatusCode.NoContent, logout.StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, rejected.StatusCode);
        Assert.NotEqual(Cookie(initial), Cookie(refreshed));
        Assert.All(new[] { initialCookie, refreshCookie, deletedCookie }, cookie =>
        {
            Assert.Equal(secure, cookie.Contains("; secure", StringComparison.OrdinalIgnoreCase));
            Assert.Contains("httponly", cookie.ToLowerInvariant());
            Assert.Contains("samesite=lax", cookie.ToLowerInvariant());
            Assert.Contains("path=/api/auth", cookie);
        });
    }

    [Theory]
    [InlineData("http://localhost:3000", true)]
    [InlineData("http://localhost:5173", true)]
    [InlineData("http://untrusted.example", false)]
    public async Task ExplicitOriginsWorkBehindHttpProxy(string origin, bool allowed)
    {
        await using var configured = factory.WithWebHostBuilder(builder => builder.ConfigureAppConfiguration((_, configuration) =>
            configuration.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Auth:CookieSecure"] = "false", ["Auth:AllowedOrigins:0"] = "http://localhost:3000",
                ["Auth:AllowedOrigins:1"] = "http://localhost:5173"
            })));
        using var browser = configured.CreateClient(new WebApplicationFactoryClientOptions
        {
            BaseAddress = new Uri("http://backend:8080"), HandleCookies = true
        });
        browser.DefaultRequestHeaders.Add("Origin", origin);

        using var initial = await browser.PostAsJsonAsync("/api/auth/login", new { login, password = Password });
        using var refreshed = await browser.PostAsync("/api/auth/refresh", null);
        using var logout = await browser.PostAsync("/api/auth/logout", null);
        using var preflight = new HttpRequestMessage(HttpMethod.Options, "/api/rooms");
        preflight.Headers.Add("Access-Control-Request-Method", "GET");
        preflight.Headers.Add("Access-Control-Request-Headers", "authorization");
        using var cors = await browser.SendAsync(preflight);

        Assert.Equal(allowed ? HttpStatusCode.OK : HttpStatusCode.Forbidden, initial.StatusCode);
        Assert.Equal(allowed ? HttpStatusCode.OK : HttpStatusCode.Forbidden, refreshed.StatusCode);
        Assert.Equal(allowed ? HttpStatusCode.NoContent : HttpStatusCode.Forbidden, logout.StatusCode);
        if (allowed)
        {
            Assert.Equal(origin, cors.Headers.GetValues("Access-Control-Allow-Origin").Single());
            Assert.Equal("true", cors.Headers.GetValues("Access-Control-Allow-Credentials").Single());
        }
        else
            Assert.False(cors.Headers.Contains("Access-Control-Allow-Origin"));
    }

    private Task<HttpResponseMessage> LoginAsync() => client.PostAsJsonAsync("/api/auth/login", new { login, password = Password });

    private async Task<HttpResponseMessage> PostCookieAsync(string action, string cookie)
    {
        using var request = new HttpRequestMessage(HttpMethod.Post, "/api/auth/" + action);
        if (cookie.Length > 0)
            request.Headers.Add("Cookie", cookie);
        return await client.SendAsync(request);
    }

    private static string Cookie(HttpResponseMessage response) => response.Headers.GetValues("Set-Cookie").Single().Split(';', 2)[0];

    private CampusFlowDbContext CreateDbContext() => new(new DbContextOptionsBuilder<CampusFlowDbContext>().UseNpgsql(connection).Options);

    private sealed class TestClock : TimeProvider
    {
        private DateTimeOffset now = DateTimeOffset.FromUnixTimeMilliseconds(DateTimeOffset.UtcNow.ToUnixTimeMilliseconds());
        public override DateTimeOffset GetUtcNow() => now;
        public void Advance(TimeSpan duration) => now += duration;
    }
}

[ApiController]
[Route("test-auth")]
public sealed class AuthProbeController : ControllerBase
{
    [Authorize]
    [HttpGet("current")]
    public IActionResult Current() => Ok();

    [Authorize(Roles = "admin")]
    [HttpGet("admin")]
    public IActionResult Admin() => Ok();
}
