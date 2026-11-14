using System.ComponentModel.DataAnnotations;
using CampusFlow.Api.Validation;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;

namespace CampusFlow.Api.Contracts;

public sealed class CreateBookingRequest : IValidatableObject
{
    [Required(ErrorMessage = "Аудитория обязательна")]
    [Range(1, int.MaxValue, ErrorMessage = "ID аудитории должен быть положительным")]
    [JsonNumberHandling(JsonNumberHandling.Strict)]
    public int? RoomId { get; init; }

    [Required(ErrorMessage = "Дата обязательна")]
    [RegularExpression(@"^\d{4}-\d{2}-\d{2}$", ErrorMessage = "Дата должна иметь формат YYYY-MM-DD")]
    public string? Date { get; init; }

    [Required(ErrorMessage = "Начало интервала обязательно")]
    [RegularExpression(@"^([01]\d|2[0-3]):[0-5]\d$", ErrorMessage = "Время должно иметь формат HH:MM")]
    public string? StartTime { get; init; }

    [Required(ErrorMessage = "Конец интервала обязателен")]
    [RegularExpression(@"^([01]\d|2[0-3]):[0-5]\d$", ErrorMessage = "Время должно иметь формат HH:MM")]
    public string? EndTime { get; init; }

    public string? Comment { get; init; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        var dateError = BookingTimeValidation.ValidateDate(Date, validationContext);
        var intervalError = BookingTimeValidation.ValidateInterval(StartTime, EndTime);
        if (dateError is not null)
            yield return dateError;
        if (intervalError is not null)
            yield return intervalError;
        var clock = validationContext.GetService(typeof(TimeProvider)) as TimeProvider ?? TimeProvider.System;
        if (dateError is null && intervalError is null && Date is not null && StartTime is not null
            && BookingTimeValidation.HasStarted(Date, StartTime, clock))
            yield return new ValidationResult("Начало брони не может быть в прошлом", [nameof(StartTime)]);
    }
}

public sealed class MyBookingsQuery : IValidatableObject
{
    [FromQuery(Name = "status")]
    [DisplayFormat(ConvertEmptyStringToNull = false)]
    public string? Status { get; init; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (Status is not null && Status is not ("active" or "cancelled"))
            yield return new ValidationResult("Статус должен быть active или cancelled", [nameof(Status)]);
    }
}

public sealed record BookingResponse(int Id, int RoomId, string RoomName, int UserId, string UserDisplayName,
    string Date, string StartTime, string EndTime, string Status, string? Comment);

public sealed record BookingCancellationResponse(int Id, string Status);
