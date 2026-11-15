using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using CampusFlow.Api.Configuration;
using CampusFlow.Api.Contracts;
using CampusFlow.Api.Data;
using CampusFlow.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace CampusFlow.Api.Services;

public sealed record AuthResult(AuthResponse Response, string RefreshToken, DateTimeOffset ExpiresAt);

public sealed class AuthService(CampusFlowDbContext db, IOptions<JwtOptions> options, TimeProvider clock)
{
    private readonly JwtOptions settings = options.Value;

    public async Task<AuthResult?> LoginAsync(string login, string password, CancellationToken cancellationToken)
    {
        var user = await db.Users.SingleOrDefaultAsync(user => user.Login == login, cancellationToken);
        if (user is null || new PasswordHasher<User>().VerifyHashedPassword(user, user.PasswordHash, password) == PasswordVerificationResult.Failed)
            return null;

        var now = clock.GetUtcNow();
        var result = CreateTokens(user, Guid.NewGuid(), now, now.AddDays(settings.RefreshTokenDays));
        await db.SaveChangesAsync(cancellationToken);
        return result;
    }

    public async Task<AuthResult?> RefreshAsync(string rawToken, CancellationToken cancellationToken)
    {
        var hash = Hash(rawToken);
        var sessionId = await db.RefreshTokens.Where(token => token.TokenHash == hash)
            .Select(token => (Guid?)token.SessionId).SingleOrDefaultAsync(cancellationToken);
        if (sessionId is null)
            return null;

        await using var transaction = await db.Database.BeginTransactionAsync(cancellationToken);
        await db.Database.ExecuteSqlInterpolatedAsync($"SELECT pg_advisory_xact_lock(hashtextextended({sessionId.Value.ToString()}, 0))", cancellationToken);
        var token = await db.RefreshTokens.SingleAsync(token => token.TokenHash == hash, cancellationToken);
        var now = clock.GetUtcNow();
        if (token.UsedAt is not null)
        {
            await db.RefreshTokens.Where(item => item.SessionId == sessionId && item.RevokedAt == null)
                .ExecuteUpdateAsync(update => update.SetProperty(item => item.RevokedAt, now), cancellationToken);
            await transaction.CommitAsync(cancellationToken);
            return null;
        }
        if (token.RevokedAt is not null || token.ExpiresAt <= now)
            return null;

        var user = await db.Users.SingleAsync(user => user.Id == token.UserId, cancellationToken);
        token.UsedAt = now;
        var result = CreateTokens(user, token.SessionId, now, token.ExpiresAt);
        await db.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);
        return result;
    }

    public async Task LogoutAsync(string rawToken, CancellationToken cancellationToken)
    {
        var hash = Hash(rawToken);
        var sessionId = await db.RefreshTokens.Where(token => token.TokenHash == hash)
            .Select(token => (Guid?)token.SessionId).SingleOrDefaultAsync(cancellationToken);
        if (sessionId is null)
            return;

        await using var transaction = await db.Database.BeginTransactionAsync(cancellationToken);
        await db.Database.ExecuteSqlInterpolatedAsync($"SELECT pg_advisory_xact_lock(hashtextextended({sessionId.Value.ToString()}, 0))", cancellationToken);
        var now = clock.GetUtcNow();
        await db.RefreshTokens.Where(token => token.SessionId == sessionId && token.RevokedAt == null)
            .ExecuteUpdateAsync(update => update.SetProperty(token => token.RevokedAt, now), cancellationToken);
        await transaction.CommitAsync(cancellationToken);
    }

    private AuthResult CreateTokens(User user, Guid sessionId, DateTimeOffset now, DateTimeOffset expiresAt)
    {
        var refresh = Convert.ToHexString(RandomNumberGenerator.GetBytes(32));
        db.RefreshTokens.Add(new RefreshToken
        {
            UserId = user.Id, SessionId = sessionId, TokenHash = Hash(refresh), CreatedAt = now, ExpiresAt = expiresAt
        });
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString(System.Globalization.CultureInfo.InvariantCulture)),
            new Claim("role", user.Role),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString("N"))
        };
        var jwt = new JwtSecurityToken(settings.Issuer, settings.Audience, claims,
            now.UtcDateTime, now.AddMinutes(settings.AccessTokenMinutes).UtcDateTime,
            new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(settings.Key)), SecurityAlgorithms.HmacSha256));
        return new AuthResult(new AuthResponse(new JwtSecurityTokenHandler().WriteToken(jwt),
            new UserResponse(user.Id, user.Login, user.DisplayName, user.Role)), refresh, expiresAt);
    }

    private static string Hash(string token) => Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token)));
}
