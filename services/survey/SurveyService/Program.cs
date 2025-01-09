using Microsoft.EntityFrameworkCore;
using SurveyService.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddDbContext<SurveyServiceDbContext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("Devconnection")));


builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder =>
    {
        builder.WithOrigins("http://localhost:4200") // Adjust as needed
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials();
    });
});

var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "SurveyForm"));
}

// Redirect root URL to Swagger UI
    app.Use(async (context, next) =>
    {
        if (context.Request.Path == "/")
        {
            context.Response.Redirect("/swagger/index.html", permanent: false);
            return;
        }

        await next();
    });

app.UseHttpsRedirection();

app.UseCors("CorsPolicy"); // Apply CORS policy

app.UseAuthorization();

app.MapControllers();

app.Run();
