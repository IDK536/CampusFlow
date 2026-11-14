using System.ComponentModel.DataAnnotations;

namespace CampusFlow.Api.Contracts;

public sealed class LoginRequest
{
    [Required(ErrorMessage = "Логин обязателен")]
    public string? Login { get; init; }

    [Required(AllowEmptyStrings = true, ErrorMessage = "Пароль обязателен")]
    [MinLength(1, ErrorMessage = "Пароль обязателен")]
    public string? Password { get; init; }
}

public sealed record UserResponse(int Id, string Login, string DisplayName, string Role);
public sealed record AuthResponse(string Token, UserResponse User);
public sealed record ApiError(string Code, string Message, object? Details = null);
