using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace CampusFlow.Api.Configuration;

public sealed class ServerTimeOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        foreach (var response in operation.Responses!.Values.OfType<OpenApiResponse>())
        {
            response.Headers ??= new Dictionary<string, IOpenApiHeader>();
            response.Headers["X-Server-Time"] = new OpenApiHeader
            {
                Description = "Время сервера при получении запроса, ISO 8601 UTC",
                Schema = new OpenApiSchema { Type = JsonSchemaType.String, Format = "date-time" }
            };
            response.Headers["X-Server-Utc-Offset"] = new OpenApiHeader
            {
                Description = "Смещение локального времени сервера относительно UTC, в минутах",
                Schema = new OpenApiSchema { Type = JsonSchemaType.Integer, Format = "int32" }
            };
        }
    }
}
