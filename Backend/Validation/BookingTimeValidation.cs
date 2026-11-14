using System.ComponentModel.DataAnnotations;
using System.Globalization;

namespace CampusFlow.Api.Validation;

internal static class BookingTimeValidation
{
    public static ValidationResult? ValidateDate(string? value, ValidationContext context)
    {
        if (value is null)
            return null;
        var clock = context.GetService(typeof(TimeProvider)) as TimeProvider ?? TimeProvider.System;
        if (!DateOnly.TryParseExact(value, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var date)
            || date < DateOnly.FromDateTime(clock.GetLocalNow().DateTime))
            return new ValidationResult("Дата должна иметь формат YYYY-MM-DD и быть не раньше сегодняшней", ["Date"]);
        return null;
    }

    public static ValidationResult? ValidateInterval(string? startText, string? endText)
    {
        var validStart = TimeOnly.TryParseExact(startText, "HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out var start);
        var validEnd = TimeOnly.TryParseExact(endText, "HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out var end);
        if (!validStart || !validEnd)
            return new ValidationResult("Время должно иметь формат HH:MM", ["StartTime", "EndTime"]);
        if (start >= end || start < new TimeOnly(9, 0) || end > new TimeOnly(18, 0) || start.Minute % 30 != 0 || end.Minute % 30 != 0)
            return new ValidationResult("Интервал должен быть внутри 09:00–18:00 с шагом 30 минут и концом позже начала", ["StartTime", "EndTime"]);
        return null;
    }

    public static bool HasStarted(string date, string start, TimeProvider clock)
    {
        var day = DateOnly.ParseExact(date, "yyyy-MM-dd", CultureInfo.InvariantCulture);
        var time = TimeOnly.ParseExact(start, "HH:mm", CultureInfo.InvariantCulture);
        return day.ToDateTime(time) < clock.GetLocalNow().DateTime;
    }
}
