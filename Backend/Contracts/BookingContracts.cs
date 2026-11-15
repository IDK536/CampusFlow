using System.ComponentModel.DataAnnotations;
using System.Globalization;
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
    [FromQuery(Name = "scope")]
    [DisplayFormat(ConvertEmptyStringToNull = false)]
    public string? Scope { get; init; }

    [FromQuery(Name = "status")]
    [DisplayFormat(ConvertEmptyStringToNull = false)]
    public string? Status { get; init; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (Scope is not null && Scope is not ("upcoming" or "past"))
            yield return new ValidationResult("Период должен быть upcoming или past", [nameof(Scope)]);
        if (Status is not null && Status is not ("active" or "cancelled"))
            yield return new ValidationResult("Статус должен быть active или cancelled", [nameof(Status)]);
    }
}

public sealed record BookingResponse(int Id, int RoomId, string RoomName, int UserId, string UserDisplayName,
    string Date, string StartTime, string EndTime, string Status, string? Comment,
    DateTimeOffset? CreatedAt = null, DateTimeOffset? CancelledAt = null, string? CancelledBy = null);

public sealed record BookingCancellationResponse(int Id, string Status);

public sealed class AdminBookingsQuery : IValidatableObject
{
    [FromQuery(Name = "sort")]
    [DisplayFormat(ConvertEmptyStringToNull = false)]
    public string? Sort { get; init; }

    [FromQuery(Name = "limit")]
    [DisplayFormat(ConvertEmptyStringToNull = false)]
    public string? Limit { get; init; }

    [FromQuery(Name = "offset")]
    [DisplayFormat(ConvertEmptyStringToNull = false)]
    public string? Offset { get; init; }

    [FromQuery(Name = "q")]
    [DisplayFormat(ConvertEmptyStringToNull = false)]
    public string? Q { get; init; }

    [FromQuery(Name = "building")]
    [DisplayFormat(ConvertEmptyStringToNull = false)]
    public string? Building { get; init; }

    [FromQuery(Name = "date")]
    [DisplayFormat(ConvertEmptyStringToNull = false)]
    public string? Date { get; init; }

    [FromQuery(Name = "dateFrom")]
    [DisplayFormat(ConvertEmptyStringToNull = false)]
    public string? DateFrom { get; init; }

    [FromQuery(Name = "dateTo")]
    [DisplayFormat(ConvertEmptyStringToNull = false)]
    public string? DateTo { get; init; }

    [FromQuery(Name = "roomId")]
    [Range(1, int.MaxValue)]
    public int? RoomId { get; init; }

    [FromQuery(Name = "userId")]
    [Range(1, int.MaxValue)]
    public int? UserId { get; init; }

    [FromQuery(Name = "status")]
    [DisplayFormat(ConvertEmptyStringToNull = false)]
    public string? Status { get; init; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (Sort is not null && Sort is not ("date" or "-date" or "room"))
            yield return new ValidationResult("Сортировка должна быть date, -date или room", [nameof(Sort)]);
        if (Limit is not null && (!int.TryParse(Limit, NumberStyles.None, CultureInfo.InvariantCulture, out var limit) || limit is < 1 or > 100))
            yield return new ValidationResult("Размер страницы должен быть целым числом от 1 до 100", [nameof(Limit)]);
        if (Offset is not null && !int.TryParse(Offset, NumberStyles.None, CultureInfo.InvariantCulture, out _))
            yield return new ValidationResult("Смещение должно быть целым числом не меньше 0", [nameof(Offset)]);
        if (Building is not null && Building is not ("A" or "B" or "C" or "D"))
            yield return new ValidationResult("Корпус должен быть A, B, C или D", [nameof(Building)]);
        foreach (var field in new[] { (Name: nameof(Date), Value: Date), (Name: nameof(DateFrom), Value: DateFrom), (Name: nameof(DateTo), Value: DateTo) })
        {
            if (field.Value is not null && !DateOnly.TryParseExact(field.Value, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out _))
                yield return new ValidationResult("Дата должна иметь формат YYYY-MM-DD", [field.Name]);
        }
        if (DateOnly.TryParseExact(DateFrom, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var from)
            && DateOnly.TryParseExact(DateTo, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var to) && from > to)
            yield return new ValidationResult("Начало периода не должно быть позже конца", [nameof(DateFrom), nameof(DateTo)]);
        if (Status is not null && Status is not ("active" or "cancelled"))
            yield return new ValidationResult("Статус должен быть active или cancelled", [nameof(Status)]);
    }
}
