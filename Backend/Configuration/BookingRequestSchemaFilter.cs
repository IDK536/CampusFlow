using CampusFlow.Api.Contracts;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace CampusFlow.Api.Configuration;

public sealed class BookingRequestSchemaFilter : ISchemaFilter
{
    public void Apply(IOpenApiSchema schema, SchemaFilterContext context)
    {
        if ((context.Type == typeof(CreateBookingRequest) || context.Type == typeof(RoomWriteRequest)) && schema is OpenApiSchema requestSchema)
            requestSchema.AdditionalPropertiesAllowed = true;
    }
}
