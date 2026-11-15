using CampusFlow.Api.Middleware;
using CampusFlow.Api.Data;
using System.Text;
using CampusFlow.Api.Configuration;
using CampusFlow.Api.Contracts;
using CampusFlow.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Policy;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi;
using Microsoft.IdentityModel.Tokens;

DotNetEnv.Env.NoClobber().TraversePath().Load();
var seedRequested = args.Contains("--seed");
var builder = WebApplication.CreateBuilder(args.Where(x => x != "--seed").ToArray());
builder.Services.AddControllers().ConfigureApiBehaviorOptions(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var errors = context.ModelState.Where(field => field.Value?.Errors.Count > 0)
            .ToDictionary(field => System.Text.Json.JsonNamingPolicy.CamelCase.ConvertName(field.Key),
                field => field.Value!.Errors.Select(error => string.IsNullOrEmpty(error.ErrorMessage)
                    ? "Некорректное значение" : error.ErrorMessage).ToArray());
        return new BadRequestObjectResult(new ApiError("VALIDATION_ERROR", "Некорректные данные запроса", errors));
    };
});
builder.Services.AddOptions<JwtOptions>().BindConfiguration("Jwt")
    .Validate(options => Encoding.UTF8.GetByteCount(options.Key) >= 32, "Jwt:Key must contain at least 32 UTF-8 bytes.")
    .Validate(options => !string.IsNullOrWhiteSpace(options.Issuer) && !string.IsNullOrWhiteSpace(options.Audience), "Jwt:Issuer and Jwt:Audience are required.")
    .Validate(options => options.AccessTokenMinutes > 0 && options.RefreshTokenDays > 0, "Token lifetimes must be positive.")
    .ValidateOnStart();
builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<RoomService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<BookingService>();
builder.Services.AddScoped<StatsService>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer();
builder.Services.AddOptions<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme)
    .Configure<IOptions<JwtOptions>>((options, settings) =>
    {
        options.MapInboundClaims = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(settings.Value.Key)),
            ValidateIssuer = true, ValidIssuer = settings.Value.Issuer,
            ValidateAudience = true, ValidAudience = settings.Value.Audience,
            ValidateLifetime = true, RequireExpirationTime = true, ClockSkew = TimeSpan.Zero,
            ValidAlgorithms = [SecurityAlgorithms.HmacSha256], NameClaimType = "sub", RoleClaimType = "role"
        };
        options.Events = new JwtBearerEvents
        {
            OnChallenge = context =>
            {
                context.HandleResponse();
                context.Response.StatusCode = 401;
                context.Response.Headers.WWWAuthenticate = "Bearer";
                return context.Response.WriteAsJsonAsync(new ApiError("UNAUTHORIZED", "Требуется авторизация"));
            },
            OnForbidden = context =>
            {
                context.Response.StatusCode = 403;
                return context.Response.WriteAsJsonAsync(new ApiError("FORBIDDEN", "Доступ запрещён"));
            }
        };
    });
builder.Services.AddAuthorization(options => options.AddPolicy(AdminAccessRequirement.Policy,
    policy => policy.RequireAuthenticatedUser().RequireRole("admin").AddRequirements(new AdminAccessRequirement())));
builder.Services.AddScoped<IAuthorizationHandler, AdminAuthorizationHandler>();
builder.Services.AddSingleton<IAuthorizationMiddlewareResultHandler, AdminAuthorizationResultHandler>();
builder.Services.AddCors();
builder.Services.AddOptions<CorsOptions>().Configure<IConfiguration>((options, configuration) =>
{
    var allowedOrigins = configuration.GetSection("Auth:AllowedOrigins").Get<string[]>() ?? [];
    options.AddDefaultPolicy(policy =>
    {
        if (allowedOrigins.Length > 0)
            policy.WithOrigins(allowedOrigins).AllowCredentials().AllowAnyHeader().AllowAnyMethod()
                .WithExposedHeaders("X-Server-Time", "X-Server-Utc-Offset", "X-Total-Count", "X-Active-Count");
    });
});
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "CampusFlow API", Version = "v1" });
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.Http, Scheme = "bearer", BearerFormat = "JWT"
    });
    options.OperationFilter<RoomSearchOperationFilter>();
    options.OperationFilter<AdminBookingsOperationFilter>();
    options.OperationFilter<MyBookingsOperationFilter>();
    options.OperationFilter<StatsOperationFilter>();
    options.OperationFilter<AuthorizationOperationFilter>();
    options.OperationFilter<ServerTimeOperationFilter>();
    options.SchemaFilter<BookingRequestSchemaFilter>();
});
builder.Services.AddDbContext<CampusFlowDbContext>(options => options.UseNpgsql(
    builder.Configuration.GetConnectionString("CampusFlow")
    ?? throw new InvalidOperationException("Set ConnectionStrings:CampusFlow before accessing the database.")));

var app = builder.Build();

if (seedRequested)
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<CampusFlowDbContext>();
    await db.Database.MigrateAsync();
    await DatabaseSeeder.SeedAsync(db, TimeProvider.System);
    return;
}

app.UseSwagger();
app.UseSwaggerUI(options => options.SwaggerEndpoint("/swagger/v1/swagger.json", "CampusFlow API v1"));
app.UseMiddleware<ServerTimeMiddleware>();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapFallback("/api/admin/{**path}", () => Results.NotFound()).RequireAuthorization(AdminAccessRequirement.Policy);
await app.RunAsync();


