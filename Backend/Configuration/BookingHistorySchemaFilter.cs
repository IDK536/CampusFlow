using CampusFlow.Api.Contracts;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace CampusFlow.Api.Configuration;

public sealed class BookingHistorySchemaFilter : ISchemaFilter
{
    public void Apply(IOpenApiSchema schema, SchemaFilterContext context)
    {
        if (context.Type != typeof(BookingResponse) || schema is not OpenApiSchema response)
            return;
        response.Description = "История: createdAt — время создания PostgreSQL в UTC, null у старых записей без известного времени. cancelledAt — время первой отмены UTC либо null; cancelledBy — owner/admin либо null. Старые отменённые записи могут иметь null в обоих полях отмены. Все три поля задаёт сервер, повторная отмена историю не меняет.";
    }
}
