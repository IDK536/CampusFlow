namespace CampusFlow.Api.Models;

public sealed class RefreshToken
{
    public long Id { get; set; }
    public int UserId { get; set; }
    public Guid SessionId { get; set; }
    public required string TokenHash { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset ExpiresAt { get; set; }
    public DateTimeOffset? UsedAt { get; set; }
    public DateTimeOffset? RevokedAt { get; set; }
}
