using CampusFlow.Api.Controllers;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace CampusFlow.Api.Configuration;

public sealed class MyBookingsOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        if (context.MethodInfo.DeclaringType != typeof(BookingsController) || context.MethodInfo.Name != nameof(BookingsController.GetMine))
            return;
        operation.Description = "scope=upcoming — активные брони, которые ещё не закончились, включая текущую. scope=past — брони, время окончания которых наступило, независимо от статуса. Граница определяется по локальному времени сервера. Без scope возвращаются все собственные брони. Будущие отменённые доступны без scope через status=cancelled. status и scope применяются через AND. Неизвестный или пустой scope даёт 400.";
    }
}
