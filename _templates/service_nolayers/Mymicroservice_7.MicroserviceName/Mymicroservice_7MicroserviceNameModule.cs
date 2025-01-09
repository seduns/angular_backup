using Medallion.Threading;
using Medallion.Threading.Redis;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.DataProtection;
using Volo.Abp;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.Autofac;
using Volo.Abp.Modularity;
using Volo.Abp.AspNetCore.Serilog;
using Microsoft.OpenApi.Models;
using Mymicroservice_7.MicroserviceName.Data;
using Prometheus;
using StackExchange.Redis;
using Swashbuckle.AspNetCore.SwaggerUI;
using Volo.Abp.AspNetCore.Mvc.AntiForgery;
using Volo.Abp.AutoMapper;
using Volo.Abp.BackgroundJobs.RabbitMQ;
using Volo.Abp.Caching;
using Volo.Abp.Caching.StackExchangeRedis;
using Volo.Abp.Data;
using Volo.Abp.DistributedLocking;
using Volo.Abp.VirtualFileSystem;
using Volo.Abp.EventBus.Distributed;
using Volo.Abp.EventBus.RabbitMq;
using Volo.Abp.FeatureManagement;
using Volo.Abp.LanguageManagement;
using Volo.Abp.PermissionManagement;
using Volo.Abp.SettingManagement;
using Volo.Abp.Studio.Client.AspNetCore;
using Volo.Abp.Swashbuckle;
using Volo.Abp.Security.Claims;
{{~ if config.database_provider == "ef" ~}}
using Volo.Abp.SettingManagement.EntityFrameworkCore;
using Volo.Abp.PermissionManagement.EntityFrameworkCore;
using Volo.Abp.LanguageManagement.EntityFrameworkCore;
using Volo.Abp.FeatureManagement.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore.SqlServer;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore.DistributedEvents;
using Volo.Abp.BlobStoring.Database.EntityFrameworkCore;
{{~ else if config.database_provider == "mongodb" ~}}
using Volo.Abp.SettingManagement.MongoDB;
using Volo.Abp.PermissionManagement.MongoDB;
using Volo.Abp.LanguageManagement.MongoDB;
using Volo.Abp.FeatureManagement.MongoDB;
using Volo.Abp.BlobStoring.Database.MongoDB;
using Volo.Abp.MongoDB.DistributedEvents;
{{~ end~}}

namespace Mymicroservice_7.MicroserviceName;

[DependsOn(
    {{~ if config.database_provider == "ef" ~}}
    typeof(BlobStoringDatabaseEntityFrameworkCoreModule),
    typeof(AbpSettingManagementEntityFrameworkCoreModule),
    typeof(LanguageManagementEntityFrameworkCoreModule),
    typeof(AbpPermissionManagementEntityFrameworkCoreModule),
    typeof(AbpFeatureManagementEntityFrameworkCoreModule),
    typeof(AbpEntityFrameworkCoreSqlServerModule),
    {{~ else if config.database_provider == "mongodb" ~}}
    typeof(BlobStoringDatabaseMongoDbModule),
    typeof(AbpSettingManagementMongoDbModule),
    typeof(LanguageManagementMongoDbModule),
    typeof(AbpPermissionManagementMongoDbModule),
    typeof(AbpFeatureManagementMongoDbModule),
    {{~ end~}}
    typeof(Mymicroservice_7MicroserviceNameContractsModule),
    typeof(AbpAutofacModule),
    typeof(AbpAspNetCoreSerilogModule),
    typeof(AbpSwashbuckleModule),
    typeof(AbpAspNetCoreMvcModule),
    typeof(AbpEventBusRabbitMqModule),
    typeof(AbpBackgroundJobsRabbitMqModule),
    typeof(AbpCachingStackExchangeRedisModule),
    typeof(AbpDistributedLockingModule),
    typeof(AbpStudioClientAspNetCoreModule)
    )]
public class Mymicroservice_7MicroserviceNameModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        var configuration = context.Services.GetConfiguration();
        var env = context.Services.GetHostingEnvironment();
        
        var redis = CreateRedisConnection(configuration);

        ConfigurePII(configuration);
        ConfigureJwtBearer(context, configuration);
        ConfigureCors(context, configuration);
        ConfigureSwagger(context, configuration);
        ConfigureDatabase(context);
        ConfigureDistributedCache(configuration);
        ConfigureDataProtection(context, configuration, redis);
        ConfigureDistributedLock(context, redis);
        ConfigureDistributedEventBus();
        ConfigureIntegrationServices();
        ConfigureAntiForgery(env);
        ConfigureVirtualFileSystem();
        ConfigureObjectMapper();
        ConfigureAutoControllers();
        ConfigureDynamicClaims(context);
    }

    public override void OnApplicationInitialization(ApplicationInitializationContext context)
    {
        var app = context.GetApplicationBuilder();
        var env = context.GetEnvironment();
        var configuration = context.GetConfiguration();

        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseCorrelationId();
        app.UseAbpRequestLocalization();
        app.UseStaticFiles();
        app.UseAbpStudioLink();
        app.UseCors();
        app.UseRouting();
        app.UseHttpMetrics();
        app.UseAuthentication();
        app.UseAbpClaimsMap();
        app.UseAuthorization();

        if (IsSwaggerEnabled(configuration))
        {
            app.UseSwagger();
            app.UseAbpSwaggerUI(options => { ConfigureSwaggerUI(options, configuration); });
        }
        
        app.UseAbpSerilogEnrichers();
        app.UseAuditing();
        app.UseUnitOfWork();
        app.UseDynamicClaims();
        app.UseConfiguredEndpoints(endpoints =>
        {
            endpoints.MapMetrics();
        });
    }
    
    public override async Task OnPostApplicationInitializationAsync(ApplicationInitializationContext context)
    {
        using var scope = context.ServiceProvider.CreateScope();
        {{~ if config.database_provider == "ef" ~}}
        await scope.ServiceProvider
            .GetRequiredService<MicroserviceNameRuntimeDatabaseMigrator>()
            .CheckAndApplyDatabaseMigrationsAsync();
        {{~ else if config.database_provider == "mongodb" ~}}
        await scope.ServiceProvider
            .GetRequiredService<MicroserviceNameDataSeeder>()
            .SeedAsync();
        {{~ end~}}
    }
    
    private ConnectionMultiplexer CreateRedisConnection(IConfiguration configuration)
    {
        return ConnectionMultiplexer.Connect(configuration["Redis:Configuration"]);
    }
    
    private void ConfigurePII(IConfiguration configuration)
    {
        if (configuration.GetValue<bool>(configuration["App:EnablePII"] ?? "false"))
        {
            Microsoft.IdentityModel.Logging.IdentityModelEventSource.ShowPII = true;
            Microsoft.IdentityModel.Logging.IdentityModelEventSource.LogCompleteSecurityArtifact = true;
        }
    }

    private void ConfigureJwtBearer(ServiceConfigurationContext context, IConfiguration configuration)
    {
        context.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddAbpJwtBearer(options =>
            {
                options.Authority = configuration["AuthServer:Authority"];
                options.MetadataAddress = configuration["AuthServer:MetaAddress"]!.EnsureEndsWith('/') + ".well-known/openid-configuration";
                options.RequireHttpsMetadata = configuration.GetValue<bool>(configuration["AuthServer:RequireHttpsMetadata"]);
                options.Audience = configuration["AuthServer:Audience"];
            });
    }

    private void ConfigureVirtualFileSystem()
    {
        Configure<AbpVirtualFileSystemOptions>(options =>
        {
            options.FileSets.AddEmbedded<Mymicroservice_7MicroserviceNameModule>();
        });
    }

    private void ConfigureCors(ServiceConfigurationContext context, IConfiguration configuration)
    {
        var corsOrigins = configuration["App:CorsOrigins"];
        context.Services.AddCors(options =>
        {
            options.AddDefaultPolicy(builder =>
            {
                if (corsOrigins != null)
                {
                    builder
                        .WithOrigins(
                            corsOrigins
                                .Split(",", StringSplitOptions.RemoveEmptyEntries)
                                .Select(o => o.RemovePostFix("/"))
                                .ToArray()
                        )
                        .WithAbpExposedHeaders()
                        .SetIsOriginAllowedToAllowWildcardSubdomains()
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                }
            });
        });
    }

    private void ConfigureSwagger(ServiceConfigurationContext context, IConfiguration configuration)
    {
        if (IsSwaggerEnabled(configuration))
        {
            context.Services.AddAbpSwaggerGenWithOAuth(
                authority: configuration["AuthServer:Authority"],
                scopes: new Dictionary<string, string>
                {
                    {"MicroserviceName", "MicroserviceName Service API"}
                },
                options =>
                {
                    options.SwaggerDoc("v1", new OpenApiInfo {Title = "MicroserviceName API", Version = "v1"});
                    options.DocInclusionPredicate((_, _) => true);
                    options.CustomSchemaIds(type => type.FullName);
                });
        }
    }

    private void ConfigureDatabase(ServiceConfigurationContext context)
    {
        Configure<AbpDbConnectionOptions>(options =>
        {
            options.Databases.Configure("Administration", database =>
            {
                database.MappedConnections.Add(AbpPermissionManagementDbProperties.ConnectionStringName);
                database.MappedConnections.Add(AbpFeatureManagementDbProperties.ConnectionStringName);
                database.MappedConnections.Add(AbpSettingManagementDbProperties.ConnectionStringName);
                database.MappedConnections.Add(LanguageManagementDbProperties.ConnectionStringName);
            });
        });
            
        {{~ if config.database_provider == "ef" ~}}
        context.Services.AddAbpDbContext<MicroserviceNameDbContext>(options =>
        {
            options.AddDefaultRepositories();
        });

        Configure<AbpDbContextOptions>(options =>
        {
            options.Configure(opts =>
            {
                /* Sets default DBMS for this service */
                opts.UseSqlServer();
            });
            
            options.Configure<MicroserviceNameDbContext>(c =>
            {
                c.UseSqlServer(b =>
                {
                    b.MigrationsHistoryTable("__MicroserviceName_Migrations");
                });
            });
        });
        {{~ else if config.database_provider == "mongodb" ~}}
        context.Services.AddMongoDbContext<MicroserviceNameDbContext>(options =>
        {
            options.AddDefaultRepositories();
        });
        {{~ end~}}
    }
    
    private void ConfigureDistributedCache(IConfiguration configuration)
    {
        Configure<AbpDistributedCacheOptions>(options =>
        {
            options.KeyPrefix = configuration["AbpDistributedCache:KeyPrefix"] ?? "";
        });
    }
    
    private void ConfigureDataProtection(ServiceConfigurationContext context, IConfiguration configuration, IConnectionMultiplexer redis)
    {
        context.Services
            .AddDataProtection()
            .SetApplicationName(configuration["DataProtection:ApplicationName"]!)
            .PersistKeysToStackExchangeRedis(redis, configuration["DataProtection:Keys"]);
    }

    private void ConfigureDistributedLock(ServiceConfigurationContext context, IConnectionMultiplexer redis)
    {
        context.Services.AddSingleton<IDistributedLockProvider>(
            _ => new RedisDistributedSynchronizationProvider(redis.GetDatabase())
        );
    }

    private void ConfigureDistributedEventBus()
    {
        Configure<AbpDistributedEventBusOptions>(options =>
        {
            options.Inboxes.Configure(config =>
            {
                {{~ if config.database_provider == "ef" ~}}
                config.UseDbContext<MicroserviceNameDbContext>();
                {{~ else if config.database_provider == "mongodb" ~}}
                config.UseMongoDbContext<MicroserviceNameDbContext>();
                {{~ end~}}
            });

            options.Outboxes.Configure(config =>
            {
                {{~ if config.database_provider == "ef" ~}}
                config.UseDbContext<MicroserviceNameDbContext>();
                {{~ else if config.database_provider == "mongodb" ~}}
                config.UseMongoDbContext<MicroserviceNameDbContext>();
                {{~ end~}}
            });
        });
    }
    
    private void ConfigureIntegrationServices()
    {
        Configure<AbpAspNetCoreMvcOptions>(options =>
        {
            options.ExposeIntegrationServices = true;
        });
    }
    
    private void ConfigureAntiForgery(IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            Configure<AbpAntiForgeryOptions>(options =>
            {
                /* Disabling ABP's auto anti forgery validation feature, because
                 * when we run the application in "localhost" domain, it will share
                 * the cookies between other applications (like the authentication server)
                 * and anti-forgery validation filter uses the other application's tokens
                 * which will fail the process unnecessarily.
                 */
                options.AutoValidate = false;
            });
        }
    }
    
    private void ConfigureObjectMapper()
    {
        Configure<AbpAutoMapperOptions>(options =>
        {
            options.AddMaps<Mymicroservice_7MicroserviceNameModule>(validate: true);
        });
    }
    
    private void ConfigureAutoControllers()
    {
        Configure<AbpAspNetCoreMvcOptions>(options =>
        {
            options
                .ConventionalControllers
                .Create(typeof(Mymicroservice_7MicroserviceNameModule).Assembly, opts =>
                {
                    opts.RemoteServiceName = "MicroserviceName";
                    opts.RootPath = "servicenamewithoutsuffix";
                });
        });
    }
    
    private static void ConfigureSwaggerUI(SwaggerUIOptions options, IConfiguration configuration)
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "MicroserviceName API");
        options.OAuthClientId(configuration["AuthServer:SwaggerClientId"]);
        options.OAuthScopes("MicroserviceName");
    }
    
    private static bool IsSwaggerEnabled(IConfiguration configuration)
    {
        return bool.Parse(configuration["Swagger:IsEnabled"] ?? "true");
    }

    private void ConfigureDynamicClaims(ServiceConfigurationContext context)
    {
        context.Services.Configure<AbpClaimsPrincipalFactoryOptions>(options =>
        {
            options.IsDynamicClaimsEnabled = true;
        });
    }


}