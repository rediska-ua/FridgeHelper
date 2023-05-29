using System.Reflection;
using API.ActionFilterAttributes;
using API.Extensions;
using API.Services;
using Core.Interfaces.IServices;
using DataAccess.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.OpenApi.Models;
using Serilog;
using Serilog.Events;
using Serilog.Sinks.MSSqlServer;
using Services.Realizations;

var fridgeHelperSpecificOrigins = "_fridgeHelperSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddAppDbContext(builder.Configuration.GetConnectionString("LocalDB"));

builder.Services.AddRepositories();

builder.Services.AddIdentityEF();

builder.Services.AddScoped<AuthService>();

builder.Services.AddScoped<IUserSettingsService, SettingsService>();

builder.Services.AddScoped<IProductService, ProductService>();

builder.Services.AddScoped<IStatisticsService, StatisticsService>();

builder.Services.AddScoped<IRecipeService, RecipeService>();

builder.Services.AddScoped<IUserInfoService, UserInfoService>();

builder.Services
    .AddJwtAuthentication(builder.Configuration)
    .AddGoogleAuthentication(builder.Configuration);

builder.Services.AddCookiesForExternalAuth();


builder.Services.AddCors(options =>
{
    options.AddPolicy(
        name: fridgeHelperSpecificOrigins,
        policy =>
        {
            policy.WithOrigins("http://localhost:4200");
            policy.AllowAnyHeader();
            policy.AllowAnyMethod();
        });
});

// setup Serilog
builder.Host.UseSerilog((ctx, lc) => lc
  .ReadFrom.Configuration(ctx.Configuration)
  .WriteTo.MSSqlServer(
      connectionString:
      ctx.Configuration.GetConnectionString("LocalDB"),
      restrictedToMinimumLevel: LogEventLevel.Information,
      sinkOptions: new MSSqlServerSinkOptions
      {
          TableName = "LogEvents",
          AutoCreateSqlTable = true,
      })
  .WriteTo.Console());

builder.Services.AddControllers(options =>
{
    options.Filters.Add<ValidateModelAttribute>();
});

builder.Services.AddHttpContextAccessor();

builder.Services.AddRazorPages();

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(option =>
{
    option.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "FridgeHelper",
        Version = "v1",
        Description = "Helper for searching recipes and managing your inventory",
    });
    option.EnableAnnotations();

    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";

    var jwtSecurityScheme = new OpenApiSecurityScheme
    {
        Scheme = JwtBearerDefaults.AuthenticationScheme,
        BearerFormat = "JWT",
        Name = "JWT Authentication",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Description = "Put **_ONLY_** your JWT Bearer token on textbox below!",

        Reference = new OpenApiReference
        {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme,
        },
    };

    option.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);

    option.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { jwtSecurityScheme, Array.Empty<string>() },
    });
});

var app = builder.Build();

app.UseExceptionMiddleware();

app.UseSerilogRequestLogging();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseUpdateDb();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors(fridgeHelperSpecificOrigins);

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.MapRazorPages();

app.Run();
