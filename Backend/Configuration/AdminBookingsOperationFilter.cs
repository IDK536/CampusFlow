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
            if (parameter.Name is "limit" or "offset")
                parameter.Schema = new OpenApiSchema { Type = JsonSchemaType.Integer, Format = "int32", Minimum = parameter.Name == "limit" ? "1" : "0",
                    Maximum = parameter.Name == "limit" ? "100" : null };
            if (parameter.Name is "date" or "dateFrom" or "dateTo")
                parameter.Schema = new OpenApiSchema { Type = JsonSchemaType.String, Format = "date", Pattern = @"^\d{4}-\d{2}-\d{2}$" };
        }
        var success = (OpenApiResponse)operation.Responses!["200"];
        success.Headers ??= new Dictionary<string, IOpenApiHeader>();
        success.Headers["X-Total-Count"] = new OpenApiHeader
        {
            Description = "Число записей после всех фильтров и до limit/offset",
            Schema = new OpenApiSchema { Type = JsonSchemaType.Integer, Format = "int32" }
        };
        success.Headers["X-Active-Count"] = new OpenApiHeader
        {
            Description = "Число active после всех фильтров и до limit/offset, независимо от текущей даты",
            Schema = new OpenApiSchema { Type = JsonSchemaType.Integer, Format = "int32" }
        };
        operation.Description = "q — полное имя пользователя ИЛИ полное название аудитории без учёта регистра, пробелы по краям удаляются; пустой q не фильтрует. По комментарию и подстроке поиска нет. building ограничивает корпус связанной аудитории (A, B, C или D). date выбирает один день. dateFrom/dateTo ограничивают период включительно; каждая граница необязательна, прошлые даты разрешены. Все переданные фильтры применяются вместе. Начало периода позже конца даёт 400. sort=date (по умолчанию) — дата/время/ID по возрастанию, -date — по убыванию, room — название аудитории, затем дата/время/ID по возрастанию. limit от 1 до 100, offset >= 0 (по умолчанию 0); без limit возвращаются все записи после offset. X-Total-Count считает все совпадения до пагинации, X-Active-Count — active среди них без ограничения текущей датой.";
    }
}
