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
            if (parameter.Name is "minCapacity" or "floor" or "minDuration")
                parameter.Schema = new OpenApiSchema { Type = JsonSchemaType.Integer, Format = "int32" };
            if (parameter.Name == "date")
                parameter.Schema = new OpenApiSchema { Type = JsonSchemaType.String, Format = "date", Pattern = @"^\d{4}-\d{2}-\d{2}$" };
            if (parameter.Name is "startTime" or "endTime")
                parameter.Schema = new OpenApiSchema { Type = JsonSchemaType.String, Pattern = @"^([01]\d|2[0-3]):[0-5]\d$" };
        }
        if (context.MethodInfo.Name is nameof(RoomsController.Search) or nameof(RoomsController.GetById))
            operation.Description = "Только подтверждённый JWT admin с актуальной ролью admin в БД получает activeBookings (active с датой >= сегодня, включая закончившиеся сегодня) и hasBookings (любая история). Студент получает прежние поля. Счётчики не зависят от даты поиска.";
        if (context.ApiDescription.RelativePath != "api/rooms")
            return;
        operation.Description += " q — полное название аудитории без учёта регистра, пробелы по краям удаляются; пустой q не фильтрует. Поиска по подстроке нет. Без date возвращает массив Room. С date возвращает {date, serverTime, utcOffset, rooms} со свободными интервалами. serverTime — UTC, utcOffset — смещение сервера в минутах. floor — точный этаж >= 1. startTime и endTime передаются вместе с date и отбирают аудитории, свободные на весь интервал. С minDuration (минуты >= 30, кратные 30) ищет непрерывное окно внутри интервала и возвращает подходящие окна, обрезанные по его границам. Прошедшие часы не исключаются.";
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
