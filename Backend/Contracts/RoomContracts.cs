using System.ComponentModel.DataAnnotations;
using System.Globalization;
using Microsoft.AspNetCore.Mvc;

namespace CampusFlow.Api.Contracts;

public sealed record RoomResponse(int Id, string Name, string Building, int Floor, int Capacity, string[] Equipment);
public sealed record FreeSlotResponse(string StartTime, string EndTime);
public sealed record AvailableRoomResponse(int Id, string Name, string Building, int Floor, int Capacity,
    string[] Equipment, FreeSlotResponse[] FreeSlots);
public sealed record AvailableRoomsResponse(string Date, AvailableRoomResponse[] Rooms);
public sealed record RoomFreeSlotsResponse(int RoomId, string Date, FreeSlotResponse[] FreeSlots);

public sealed class RoomSearchQuery : IValidatableObject
{
    private static readonly string[] EquipmentNames = ["projector", "whiteboard", "computers", "audio", "video"];

    [DisplayFormat(ConvertEmptyStringToNull = false)]
    [FromQuery(Name = "building")]
    public string? Building { get; init; }

    [DisplayFormat(ConvertEmptyStringToNull = false)]
    [FromQuery(Name = "minCapacity")]
    public string? MinCapacity { get; init; }

    [DisplayFormat(ConvertEmptyStringToNull = false)]
    [FromQuery(Name = "equipment")]
    public string? Equipment { get; init; }

    [DisplayFormat(ConvertEmptyStringToNull = false)]
    [FromQuery(Name = "date")]
    public string? Date { get; init; }

    [DisplayFormat(ConvertEmptyStringToNull = false)]
    [FromQuery(Name = "startTime")]
    public string? StartTime { get; init; }

    [DisplayFormat(ConvertEmptyStringToNull = false)]
    [FromQuery(Name = "endTime")]
    public string? EndTime { get; init; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (Building is not null && Building is not ("A" or "B" or "C" or "D"))
            yield return new ValidationResult("Корпус должен быть A, B, C или D", [nameof(Building)]);
        if (MinCapacity is not null && (!int.TryParse(MinCapacity, NumberStyles.None, CultureInfo.InvariantCulture, out var capacity) || capacity <= 0))
            yield return new ValidationResult("Вместимость должна быть целым положительным числом", [nameof(MinCapacity)]);
        if (Equipment is not null && Equipment.Split(',').Select(value => value.Trim()).Any(value => !EquipmentNames.Contains(value, StringComparer.Ordinal)))
            yield return new ValidationResult("Укажите допустимое оборудование через запятую", [nameof(Equipment)]);

        var dateError = ValidateDate(Date, validationContext);
        if (dateError is not null)
            yield return dateError;
        if (StartTime is null && EndTime is null)
            yield break;
        if (Date is null)
            yield return new ValidationResult("Для поиска по времени требуется дата", [nameof(Date)]);
        if (StartTime is null || EndTime is null)
        {
            yield return new ValidationResult("Начало и конец интервала передаются вместе", [nameof(StartTime), nameof(EndTime)]);
            yield break;
        }
        var validStart = TimeOnly.TryParseExact(StartTime, "HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out var start);
        var validEnd = TimeOnly.TryParseExact(EndTime, "HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out var end);
        if (!validStart || !validEnd)
        {
            yield return new ValidationResult("Время должно иметь формат HH:MM", [nameof(StartTime), nameof(EndTime)]);
            yield break;
        }
        if (start >= end || start < new TimeOnly(9, 0) || end > new TimeOnly(18, 0) || start.Minute % 30 != 0 || end.Minute % 30 != 0)
            yield return new ValidationResult("Интервал должен быть внутри 09:00–18:00 с шагом 30 минут и концом позже начала", [nameof(StartTime), nameof(EndTime)]);
    }

    internal string[] GetEquipment() => Equipment?.Split(',').Select(value => value.Trim()).Distinct(StringComparer.Ordinal).ToArray() ?? [];

    internal static ValidationResult? ValidateDate(string? value, ValidationContext context)
    {
        if (value is null)
            return null;
        var clock = context.GetService(typeof(TimeProvider)) as TimeProvider ?? TimeProvider.System;
        if (!DateOnly.TryParseExact(value, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var date)
            || date < DateOnly.FromDateTime(clock.GetLocalNow().DateTime))
            return new ValidationResult("Дата должна иметь формат YYYY-MM-DD и быть не раньше сегодняшней", [nameof(Date)]);
        return null;
    }
}

public sealed class RoomDateQuery : IValidatableObject
{
    [Required(ErrorMessage = "Дата обязательна")]
    [DisplayFormat(ConvertEmptyStringToNull = false)]
    [FromQuery(Name = "date")]
    public string? Date { get; init; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        var error = RoomSearchQuery.ValidateDate(Date, validationContext);
        if (error is not null)
            yield return error;
    }
}
