using System.ComponentModel.DataAnnotations;
using System.Globalization;
using Microsoft.AspNetCore.Mvc;
using CampusFlow.Api.Validation;

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

        var dateError = BookingTimeValidation.ValidateDate(Date, validationContext);
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
        var intervalError = BookingTimeValidation.ValidateInterval(StartTime, EndTime);
        if (intervalError is not null)
            yield return intervalError;
    }

    internal string[] GetEquipment() => Equipment?.Split(',').Select(value => value.Trim()).Distinct(StringComparer.Ordinal).ToArray() ?? [];

}

public sealed class RoomDateQuery : IValidatableObject
{
    [Required(ErrorMessage = "Дата обязательна")]
    [DisplayFormat(ConvertEmptyStringToNull = false)]
    [FromQuery(Name = "date")]
    public string? Date { get; init; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        var error = BookingTimeValidation.ValidateDate(Date, validationContext);
        if (error is not null)
            yield return error;
    }
}
