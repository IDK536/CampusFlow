using CampusFlow.Api.Contracts;
using CampusFlow.Api.Controllers;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace CampusFlow.Api.Configuration;

public sealed class RoomSearchOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        if (context.MethodInfo.DeclaringType != typeof(RoomsController))
            return;
        foreach (var parameter in (operation.Parameters ?? []).OfType<OpenApiParameter>())
        {
            if (parameter.Name == "minCapacity")
                parameter.Schema = new OpenApiSchema { Type = JsonSchemaType.Integer, Format = "int32" };
            if (parameter.Name == "date")
                parameter.Schema = new OpenApiSchema { Type = JsonSchemaType.String, Format = "date", Pattern = @"^\d{4}-\d{2}-\d{2}$" };
            if (parameter.Name is "startTime" or "endTime")
                parameter.Schema = new OpenApiSchema { Type = JsonSchemaType.String, Pattern = @"^([01]\d|2[0-3]):[0-5]\d$" };
        }
        if (context.ApiDescription.RelativePath != "api/rooms")
            return;
        operation.Description = "Без date возвращает массив Room. С date возвращает {date, rooms} со свободными интервалами. startTime и endTime передаются вместе с date и отбирают аудитории, свободные на весь интервал.";
        var schema = new OpenApiSchema
        {
            OneOf =
            [
                context.SchemaGenerator.GenerateSchema(typeof(RoomResponse[]), context.SchemaRepository),
                context.SchemaGenerator.GenerateSchema(typeof(AvailableRoomsResponse), context.SchemaRepository)
            ]
        };
        foreach (var content in operation.Responses!["200"].Content!.Values)
            content.Schema = schema;
    }
}
