using CampusFlow.Api.Controllers;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace CampusFlow.Api.Configuration;

public sealed class AdminBookingsOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        if (context.MethodInfo.DeclaringType != typeof(AdminBookingsController) || context.MethodInfo.Name != nameof(AdminBookingsController.GetAll))
            return;
        foreach (var parameter in (operation.Parameters ?? []).OfType<OpenApiParameter>())
        {
            if (parameter.Name is "date" or "dateFrom" or "dateTo")
                parameter.Schema = new OpenApiSchema { Type = JsonSchemaType.String, Format = "date", Pattern = @"^\d{4}-\d{2}-\d{2}$" };
        }
        operation.Description = "date выбирает один день. dateFrom/dateTo ограничивают период включительно; каждая граница необязательна, прошлые даты разрешены. Все переданные фильтры применяются вместе. Начало периода позже конца даёт 400.";
    }
}
