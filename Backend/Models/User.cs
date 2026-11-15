using System.Text.Json.Serialization;

namespace CampusFlow.Api.Models;

public sealed class User
{
    public int Id { get; set; }
    public required string Login { get; set; }
    public required string DisplayName { get; set; }
    public required string Role { get; set; }
    [JsonIgnore]
    public string PasswordHash { get; set; } = string.Empty;
}
