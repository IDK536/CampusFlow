using CampusFlow.Api.Controllers;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace CampusFlow.Api.Configuration;

public sealed class StatsOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        if (context.MethodInfo.DeclaringType != typeof(AdminStatsController))
            return;
        foreach (var parameter in (operation.Parameters ?? []).OfType<OpenApiParameter>())
        {
            if (parameter.Name is "dateFrom" or "dateTo")
            {
                parameter.Required = true;
                parameter.Schema = new OpenApiSchema { Type = JsonSchemaType.String, Format = "date", Pattern = @"^\d{4}-\d{2}-\d{2}$" };
            }
        }
        operation.Description = "dateFrom/dateTo обязательны, границы включительные, прошлые даты разрешены. building=A|B|C|D ограничивает все блоки. Только active; 540 минут на аудиторию в каждый календарный день. Проценты не округляются до целого; при нулевой ёмкости процент 0. Пустые даты/корпуса сохраняются, рейтинг содержит до 10 аудиторий с бронями. byHalfHour — 18 счётчиков покрытия слотов 09:00–17:30 за весь период, конец брони исключён.";
    }
}
