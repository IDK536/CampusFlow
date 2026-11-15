using System.ComponentModel.DataAnnotations;
using System.Globalization;
using Microsoft.AspNetCore.Mvc;

namespace CampusFlow.Api.Contracts;

public sealed class StatsQuery : IValidatableObject
{
    [Required(ErrorMessage = "Начало периода обязательно")]
    [FromQuery(Name = "dateFrom")]
    [DisplayFormat(ConvertEmptyStringToNull = false)]
    public string? DateFrom { get; init; }

    [Required(ErrorMessage = "Конец периода обязателен")]
    [FromQuery(Name = "dateTo")]
    [DisplayFormat(ConvertEmptyStringToNull = false)]
    public string? DateTo { get; init; }

    [FromQuery(Name = "building")]
    [DisplayFormat(ConvertEmptyStringToNull = false)]
    public string? Building { get; init; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        var validFrom = DateOnly.TryParseExact(DateFrom, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var from);
        var validTo = DateOnly.TryParseExact(DateTo, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var to);
        if (!validFrom)
            yield return new ValidationResult("Начало периода должно иметь формат YYYY-MM-DD", [nameof(DateFrom)]);
        if (!validTo)
            yield return new ValidationResult("Конец периода должен иметь формат YYYY-MM-DD", [nameof(DateTo)]);
        if (validFrom && validTo && from > to)
            yield return new ValidationResult("Начало периода не должно быть позже конца", [nameof(DateFrom), nameof(DateTo)]);
        if (Building is not null && Building is not ("A" or "B" or "C" or "D"))
            yield return new ValidationResult("Корпус должен быть A, B, C или D", [nameof(Building)]);
    }
}

public sealed record StatsResponse(StatsTotals Totals, BuildingStats[] ByBuilding, DayStats[] ByDay,
    LoadCell[] Cells, long[] ByHalfHour, RoomStats[] TopRooms);
public sealed record StatsTotals(long Bookings, long Minutes, decimal Percent);
public sealed record BuildingStats(string Building, int Rooms, long Minutes, decimal Percent);
public sealed record DayStats(string Date, long Bookings, long Minutes, decimal Percent);
public sealed record LoadCell(string Building, string Date, long Bookings, long Minutes, long CapacityMinutes, decimal Percent);
public sealed record RoomStats(int RoomId, string Name, long Minutes, long Bookings);
