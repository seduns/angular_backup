# Mymicroservice_7.MicroserviceName

If you check the *Enable integration* option when creating the microservice, the necessary configurations are made automatically, so no manual configuration is needed. For more information, refer to the [Adding New Microservices](https://abp.io/docs/latest/solution-templates/microservice/adding-new-microservices) document.

{%{{{~ if completed[gateway_urls] == null || completed[auth_server_urls_authority] == null || completed[auth_server_urls_meta_address] == null ||  completed[identity_api_scope] == null || completed[identity_swagger_client_scope] == null || completed[identity_swagger_client_redirect] == null || completed[identity_app_client_scope] == null || completed[identity_resources] == null || completed[auth_server_cors_origins] == null || completed[auth_server_redirect] == null ||completed[gateway_routes] == null || completed[gateway_clusters] == null || completed[gateway_scopes] == null || completed[ui_app_scopes] == null || completed[angular_scopes] == null ~}}}%}
## Integrating to other services
{%{{{~ if completed[gateway_urls] == null || completed[auth_server_urls_authority] == null || completed[auth_server_urls_meta_address] == null ~}}}%}

### Replacing placeholders

#### Configuring the appsettings.json

The new microservice is created with the necessary configurations and dependencies. We need to configure several sections by modifying the `appsettings.json` file. Open the `appsettings.json` file in the created microservice host application, and edit the following sections:

    {%{{{~ if completed[gateway_urls] == null ~}}}%}
 * Set the `CorsOrigins` to allow the web gateway to access the microservice.
    {%{{{~ end ~}}}%}
    {%{{{~ if completed[auth_server_urls_authority] == null || completed[auth_server_urls_meta_address] == null ~}}}%}
 * Set the `AuthServer` configurations to enable the microservice to authenticate and authorize users.
    {%{{{~ end ~}}}%}

You can copy the configurations from the existing microservices and modify them according to the new microservice.
{%{{{~ end ~}}}%}
{%{{{~ if completed[identity_api_scope] == null || completed[identity_swagger_client_scope] == null || completed[identity_swagger_client_redirect] == null || completed[identity_app_client_scope] == null || completed[identity_resources] == null || completed[auth_server_cors_origins] == null || completed[auth_server_redirect] == null ~}}}%}

### Configuring Authority
{%{{{~ if completed[identity_api_scope] == null || completed[identity_swagger_client_scope] == null || completed[identity_swagger_client_redirect] == null || completed[identity_app_client_scope] == null ~}}}%}

#### Configuring the OpenId Options

You need to introduce the new service to OpenIddict. To do that, open `OpenIddictDataSeeder` in the `Identity` service, and add necessary information like other services.
{%{{{~ if completed[identity_api_scope] == null || completed[identity_swagger_client_scope] == null ~}}}%}

```diff
{%{{{~ if completed[identity_api_scope] == null ~}}}%}
    private async Task CreateApiScopesAsync()
    {
        await CreateScopesAsync("AuthServer");
        await CreateScopesAsync("IdentityService");
        await CreateScopesAsync("AdministrationService");
+       await CreateScopesAsync("MicroserviceName");
    }
    
{%{{{~ end ~}}}%}
{%{{{~ if completed[identity_swagger_client_scope] == null ~}}}%}
    private async Task CreateSwaggerClientsAsync()
    {
        await CreateSwaggerClientAsync("SwaggerTestUI", new[]
        {
            "AuthServer",
            "IdentityService",
            "AdministrationService",
+           "MicroserviceName"
        });
    }
{%{{{~ end ~}}}%}
```
{%{{{~ end ~}}}%}
{%{{{~ if completed[identity_swagger_client_redirect] == null ~}}}%}

Add the redirect URL for the new service in the `CreateSwaggerClientAsync` method.

```diff
    private async Task CreateSwaggerClientAsync(string clientId, string[] scopes)
    {
        ...
        ...
        ...
        var administrationServiceRootUrl = _configuration["OpenIddict:Resources:AdministrationService:RootUrl"]!.TrimEnd('/');
+       var microserviceNameRootUrl = _configuration["OpenIddict:Resources:MicroserviceName:RootUrl"]!.TrimEnd('/');

        await CreateOrUpdateApplicationAsync(
            name: clientId,
            type:  OpenIddictConstants.ClientTypes.Public,
            consentType: OpenIddictConstants.ConsentTypes.Implicit,
            displayName: "Swagger Test Client",
            secret: null,
            grantTypes: new List<string>
            {
                OpenIddictConstants.GrantTypes.AuthorizationCode,
            },
            scopes: commonScopes.Union(scopes).ToList(),
            redirectUris: new List<string> {
                $"{webGatewaySwaggerRootUrl}/swagger/oauth2-redirect.html",
                $"{authServerRootUrl}/swagger/oauth2-redirect.html",
                $"{identityServiceRootUrl}/swagger/oauth2-redirect.html",
                $"{administrationServiceRootUrl}/swagger/oauth2-redirect.html",
+               $"{microserviceNameRootUrl}/swagger/oauth2-redirect.html",
            }
        );
    }
```
{%{{{~ end ~}}}%}
{%{{{~ if completed[identity_app_client_scope] == null ~}}}%}

Add the allowed scope for the web (front-end) application(s) in the `CreateClientsAsync` method. You might have different clients for different UI applications such as web, Angular, React, etc. Ensure you add the new microservice to the allowed scopes of these clients.

```diff
private async Task CreateClientsAsync()
{
    var commonScopes = new List<string>
    {
        OpenIddictConstants.Permissions.Scopes.Address,
        OpenIddictConstants.Permissions.Scopes.Email,
        OpenIddictConstants.Permissions.Scopes.Phone,
        OpenIddictConstants.Permissions.Scopes.Profile,
        OpenIddictConstants.Permissions.Scopes.Roles
    };

    //Web Client
    var webClientRootUrl = _configuration["OpenIddict:Applications:Web:RootUrl"]!.EnsureEndsWith('/');
    await CreateOrUpdateApplicationAsync(
        name: "Web",
        type: OpenIddictConstants.ClientTypes.Confidential,
        consentType: OpenIddictConstants.ConsentTypes.Implicit,
        displayName: "Web Client",
        secret: "1q2w3e*",
        grantTypes: new List<string>
        {
            OpenIddictConstants.GrantTypes.AuthorizationCode,
            OpenIddictConstants.GrantTypes.Implicit
        },
        scopes: commonScopes.Union(new[]
        {
            "AuthServer", 
            "IdentityService",
            "SaasService",
            "AuditLoggingService",
            "AdministrationService",
+           "MicroserviceName"
        }).ToList(),
        redirectUris: new List<string> { $"{webClientRootUrl}signin-oidc" },
        postLogoutRedirectUris: new List<string>() { $"{webClientRootUrl}signout-callback-oidc" },
        clientUri: webClientRootUrl,
        logoUri: "/images/clients/aspnetcore.svg"
    );
}
```
{%{{{~ end ~}}}%}
{%{{{~ end ~}}}%}
{%{{{~ if completed[identity_resources] == null ~}}}%}

Add the new service URL to the `appsettings.json` file in the `Identity` microservice host application. 

```diff
  "OpenIddict": {
    "Applications": {
      ...
    },
    "Resources": {
      ...
      "AdministrationService": {
        "RootUrl": "http://localhost:****"
      },
+     "MicroserviceName": {
+       "RootUrl": "http://localhost:{{ config.launch_ports["service"] }}"
+     }
    }
  }
```
{%{{{~ end ~}}}%}
{%{{{~ if completed[auth_server_cors_origins] == null || completed[auth_server_redirect] == null ~}}}%}

#### Adding CORS to AuthServer

We should configure the *AuthServer* application `appsettings.json` file for the **CorsOrigins** and **RedirectAllowedUrls** sections.

```diff
  "App": {
    "SelfUrl": "http://localhost:***",
{%{{{~ if completed[auth_server_cors_origins] == null ~}}}%}
-   "CorsOrigins": "http://localhost:***",
+   "CorsOrigins": "http://localhost:***, http://localhost:{{ config.launch_ports["service"] }}",
{%{{{ else }}}%}
    "CorsOrigins": "http://localhost:***, http://localhost:{{ config.launch_ports["service"] }}",
{%{{{~ end ~}}}%}
    "EnablePII": false,
-   "RedirectAllowedUrls": "http://localhost:***"
{%{{{~ if completed[auth_server_cors_origins] == null ~}}}%}
+   "RedirectAllowedUrls": "http://localhost:***, http://localhost:{{ config.launch_ports["service"] }}"
{%{{{ else }}}%}
    "RedirectAllowedUrls": "http://localhost:***, http://localhost:{{ config.launch_ports["service"] }}"
{%{{{~ end ~}}}%}
  },
```
{%{{{~ end ~}}}%}
{%{{{~ end ~}}}%}
{%{{{~ if completed[gateway_routes] == null || completed[gateway_clusters] == null || completed[gateway_scopes] == null ~}}}%}

### Configuring the API Gateway

We should configure the API Gateway to access the new microservice.
{%{{{~ if completed[gateway_routes] == null || completed[gateway_clusters] == null ~}}}%}

First, add the **MicroserviceName** sections to the `appsettings.json` file in the `WebGateway` project. 

- Add the new service to clusters and routes:

```diff
{%{{{~ if completed[gateway_routes] == null ~}}}%}
   "ReverseProxy": {
    "Routes": {
      ...
+      "ServiceNameWithoutSuffix": {
+        "ClusterId": "ServiceNameWithoutSuffix",
+        "Match": {
+          "Path": "/api/servicenamewithoutsuffix/{**catch-all}"
+        }
+      },
+      "ServiceNameWithoutSuffixSwagger": {
+        "ClusterId": "ServiceNameWithoutSuffix",
+        "Match": {
+          "Path": "/swagger-json/ServiceNameWithoutSuffix/swagger/v1/swagger.json"
+        },
+        "Transforms": [
+          { "PathRemovePrefix": "/swagger-json/ServiceNameWithoutSuffix" }
+        ]
+      }
    },
{%{{{~ end ~}}}%}
{%{{{~ if completed[gateway_clusters] == null ~}}}%}
    "Clusters": {
      ...
+      "ServiceNameWithoutSuffix": {
+        "Destinations": {
+          "ServiceNameWithoutSuffix": {
+            "Address": "http://localhost:{{ config.launch_ports["service"] }}/"
+          }
+        }
+      }
    }
{%{{{~ end ~}}}%}
```
{%{{{~ end ~}}}%}
{%{{{~ if completed[gateway_scopes] == null ~}}}%}

- Open the `Mymicroservice_7WebGatewayModule` class in the `WebGateway` project and add the `MicroserviceName` to the `ConfigureSwaggerUI` method. 

```diff
private static void ConfigureSwaggerUI(
    IProxyConfig proxyConfig,
    SwaggerUIOptions options,
    IConfiguration configuration)
{
    foreach (var cluster in proxyConfig.Clusters)
    {
        options.SwaggerEndpoint($"/swagger-json/{cluster.ClusterId}/swagger/v1/swagger.json", $"{cluster.ClusterId} API");
    }

    options.OAuthClientId(configuration["AuthServer:SwaggerClientId"]);
    options.OAuthScopes(
        "AdministrationService",
        "AuthServer",
        ...,
+       "MicroserviceName"
    );
}
```
{%{{{~ end ~}}}%}
{%{{{~ end ~}}}%}
{%{{{~ if completed[ui_app_scopes] == null || completed[angular_scopes] == null ~}}}%}

### Configuring the UI Services

We should configure the UI application(s) to allow the new microservice to access through the web gateway.
{%{{{~ if completed[ui_app_scopes] == null ~}}}%}

To do this, we should add the new microservice scope to the `ConfigureAuthentication` method in the `ProjectName...Module` class in the `Web` or `Blazor` application. 

```diff
private void ConfigureAuthentication(ServiceConfigurationContext context, IConfiguration configuration)
{
  context.Services.AddAuthentication(options =>
  {
    options.DefaultScheme = "Cookies";
    options.DefaultChallengeScheme = "oidc";
  })
  .AddCookie("Cookies", options =>
  {
    options.ExpireTimeSpan = TimeSpan.FromDays(365);
  })
  .AddAbpOpenIdConnect("oidc", options =>
  {
    ...
    options.Scope.Add("AuthServer");
    options.Scope.Add("IdentityService");
    options.Scope.Add("AdministrationService");
+  	options.Scope.Add("MicroserviceName");
  });
  ...
}
```
{%{{{~ end ~}}}%}
{%{{{~ if completed[angular_scopes] == null ~}}}%}

if you have an Angular application, you should add the new service scope to the `oAuthConfig` in `environment.ts`:

```diff
const baseUrl = 'http://localhost:4200';

const oAuthConfig = {
  issuer: 'http://localhost:44387',
  redirectUri: baseUrl,
  clientId: 'Angular',
  responseType: 'code',
- scope: 'openid profile email roles AuthServer IdentityService AdministrationService',
+ scope: 'openid profile email roles AuthServer IdentityService AdministrationService MicroserviceName',
  requireHttps: false
};
```
{%{{{~ end ~}}}%}
{%{{{~ end ~}}}%}
{%{{{~ end ~}}}%}
{%{{{~ if completed[docker_prometheus] == null ~}}}%}

## Docker Configuration for Prometheus

If you want to monitor the new microservice with Prometheus when you debug the solution, you should add the new microservice to the `prometheus.yml` file in the `etc/docker/prometheus` folder. You can copy the configurations from the existing microservices and modify them according to the new microservice. Below is an example of the `prometheus.yml` file for the `Product` microservice.

```diff
  - job_name: 'authserver'
    scheme: http
    metrics_path: 'metrics'
    static_configs:
    - targets: ['host.docker.internal:***']
    ...
+ - job_name: 'servicenamewithoutsuffix'
+   scheme: http
+   metrics_path: 'metrics'
+   static_configs:
+   - targets: ['host.docker.internal:{{ config.launch_ports["service"] }}']
```
{%{{{~ end ~}}}%}
{%{{{~ if completed[build_images] == null || completed[helm_connection_string] == null || completed[helm_create_charts] == null || completed[helm_add_charts] == null || completed[helm_identity] == null || completed[helm_auth_server] == null || completed[helm_gateway] == null ~}}}%}

## Creating Helm Chart for the MicroserviceName

If you want to deploy the new microservice to Kubernetes, you should create a Helm chart for the new microservice.
{%{{{~ if completed[build_images] == null ~}}}%}

First, we need to add the new microservice to the `build-all-images.ps1` script in the `etc/helm` folder. You can copy the configurations from the existing microservices and modify them according to the new microservice.

```diff
...
  ./build-image.ps1 -ProjectPath "../../apps/auth-server/Mymicroservice_7.AuthServer/Mymicroservice_7.AuthServer.csproj" -ImageName mymicroservice_7/authserver
+ ./build-image.ps1 -ProjectPath "../../services/servicenamewithoutsuffix/Mymicroservice_7.MicroserviceName/Mymicroservice_7.MicroserviceName.csproj" -ImageName mymicroservice_7/servicenamewithoutsuffix
```
{%{{{~ end ~}}}%}
{%{{{~ if completed[helm_connection_string] == null ~}}}%}

We need to add the connection string to the `values.mymicroservice_7-local.yaml` file in the `etc/helm/mymicroservice_7` folder.

```diff
global:
  ...
  connectionStrings:
    ...
+   servicenamewithoutsuffix: "Server=[RELEASE_NAME]-sqlserver,1433; Database=Mymicroservice_7_MicroserviceName; User Id=sa; Password=myPassw@rd; TrustServerCertificate=True"
```
{%{{{~ end ~}}}%}
{%{{{~ if completed[helm_create_charts] == null ~}}}%}

We need to create a new Helm chart for the new microservice. You can copy the configurations from the existing microservices and modify them according to the new microservice.

ServiceNameWithoutSuffix microservice `values.yaml` file. 

```yaml
image:
  repository: "mymicroservice_7/servicenamewithoutsuffix"
  tag: "latest"
  pullPolicy: IfNotPresent
swagger:
  isEnabled: "true"
```

ServiceNameWithoutSuffix microservice `Chart.yaml` file. 

```yaml
apiVersion: v2
name: servicenamewithoutsuffix
version: 1.0.0
appVersion: "1.0"
description: Mymicroservice_7 ServiceNameWithoutSuffix Service
```

ServiceNameWithoutSuffix microservice `servicenamewithoutsuffix.yaml` file. 

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: "{%{{%{{{ .Release.Name }}}%}}%}-{%{{%{{{ .Chart.Name }}}%}}%}"
spec:
  selector:
    matchLabels:
      app: "{%{{%{{{ .Release.Name }}}%}}%}-{%{{%{{{ .Chart.Name }}}%}}%}"
  template:
    metadata:
      labels:
        app: "{%{{%{{{ .Release.Name }}}%}}%}-{%{{%{{{ .Chart.Name }}}%}}%}"
    spec:
      containers:
      - image: "{%{{%{{{ .Values.image.repository }}}%}}%}:{%{{%{{{ .Values.image.tag }}}%}}%}"
        imagePullPolicy: "{%{{%{{{ .Values.image.pullPolicy }}}%}}%}"
        name: "{%{{%{{{ .Release.Name }}}%}}%}-{%{{%{{{ .Chart.Name }}}%}}%}"
        ports:
        - name: "http"
          containerPort: 80
        env:
        - name: "DOTNET_ENVIRONMENT"
          value: "{%{{%{{{ .Values.global.dotnetEnvironment }}}%}}%}"
        - name: "ConnectionStrings__Administration"
          value: "{%{{%{{{ .Values.global.connectionStrings.administration | replace "[RELEASE_NAME]" .Release.Name }}}%}}%}"
        - name: "ConnectionStrings__AbpBlobStoring"
          value: "{%{{%{{{ .Values.global.connectionStrings.blobStoring | replace "[RELEASE_NAME]" .Release.Name }}}%}}%}"
        - name: "ConnectionStrings__MicroserviceName"
          value: "{%{{%{{{ .Values.global.connectionStrings.servicenamewithoutsuffix | replace "[RELEASE_NAME]" .Release.Name }}}%}}%}"
          ...
```

ServiceNameWithoutSuffix microservice `servicenamewithoutsuffix-service.yaml` file. 

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    name: "{%{{%{{{ .Release.Name }}}%}}%}-{%{{%{{{ .Chart.Name }}}%}}%}"
  name: "{%{{%{{{ .Release.Name }}}%}}%}-{%{{%{{{ .Chart.Name }}}%}}%}"
spec:
  ports:
    - name: "80"
      port: 80
  selector:
    app: "{%{{%{{{ .Release.Name }}}%}}%}-{%{{%{{{ .Chart.Name }}}%}}%}"
```
{%{{{~ end ~}}}%}
{%{{{~ if completed[helm_add_charts] == null ~}}}%}

You can *Refresh Sub Charts* in ABP Studio. Don't forget to add the following *Metadata* information to the sub-chart's *Metadata* keys. You can access this menu by opening the *Kubernetes* menu, right-clicking the *servicenamewithoutsuffix* sub-chart, and selecting *Properties* -> *Metadata* tab.

- `projectPath`: **../../services/servicenamewithoutsuffix/Mymicroservice_7.MicroserviceName/Mymicroservice_7.MicroserviceName.csproj**
- `imageName`: **mymicroservice_7/servicenamewithoutsuffix**
- `projectType`: **dotnet**

Afterward, you should add the *Kubernetes Services* in the *Chart Properties* -> *Kubernetes Services* tab. You can add additional keys; it applies the regex patterns.

- `Key`: **.*-servicenamewithoutsuffix$**

> This value should be the same as the [solution runner application](https://abp.io/docs/latest/studio/running-applications#properties) *Kubernetes service* value. It's necessary for browsing because when we connect to the Kubernetes cluster, we should browse the Kubernetes services instead of using the Launch URL.
{%{{{~ end ~}}}%}
{%{{{~ if completed[helm_identity] == null || completed[helm_auth_server] == null || completed[helm_gateway] == null ~}}}%}

We need to configure the helm chart environments for other applications.
{%{{{~ if completed[helm_identity] == null ~}}}%}

Below is an example of the *Identity* microservice `identity.yaml` file. 

```diff
apiVersion: apps/v1
kind: Deployment
metadata:
  name: "{%{{%{{{ .Release.Name }}}%}}%}-{%{{%{{{ .Chart.Name }}}%}}%}"
spec:
  selector:
    matchLabels:
      app: "{%{{%{{{ .Release.Name }}}%}}%}-{%{{%{{{ .Chart.Name }}}%}}%}"
  template:
    metadata:
      labels:
        app: "{%{{%{{{ .Release.Name }}}%}}%}-{%{{%{{{ .Chart.Name }}}%}}%}"
    spec:
      containers:
      - image: "{%{{%{{{ .Values.image.repository }}}%}}%}:{%{{%{{{ .Values.image.tag }}}%}}%}"
        imagePullPolicy: "{%{{%{{{ .Values.image.pullPolicy }}}%}}%}"
        name: "{%{{%{{{ .Release.Name }}}%}}%}-{%{{%{{{ .Chart.Name }}}%}}%}"
        ports:
        - name: "http"
          containerPort: 80
        env:
        ...
+       - name: "OpenIddict__Resources__MicroserviceName__RootUrl"
+         value: "http://{%{{%{{{ .Release.Name }}}%}}%}-servicenamewithoutsuffix"
```
{%{{{~ end ~}}}%}
{%{{{~ if completed[helm_auth_server] == null ~}}}%}

Below is an example of the *AuthServer* application `authserver.yaml` file. 

```diff
apiVersion: apps/v1
kind: Deployment
metadata:
  name: "{%{{%{{{ .Release.Name }}}%}}%}-{%{{%{{{ .Chart.Name }}}%}}%}"
spec:
  selector:
    matchLabels:
      app: "{%{{%{{{ .Release.Name }}}%}}%}-{%{{%{{{ .Chart.Name }}}%}}%}"
  template:
    metadata:
      labels:
        app: "{%{{%{{{ .Release.Name }}}%}}%}-{%{{%{{{ .Chart.Name }}}%}}%}"
    spec:
      containers:
      - image: "{%{{%{{{ .Values.image.repository }}}%}}%}:{%{{%{{{ .Values.image.tag }}}%}}%}"
        imagePullPolicy: "{%{{%{{{ .Values.image.pullPolicy }}}%}}%}"
        name: "{%{{%{{{ .Release.Name }}}%}}%}-{%{{%{{{ .Chart.Name }}}%}}%}"
        ports:
        - name: "http"
          containerPort: 80
        env:
        ...
        - name: "App__CorsOrigins"
-         value: "...,http://{%{{%{{{ .Release.Name }}}%}}%}-administration"
+         value: "...,http://{%{{%{{{ .Release.Name }}}%}}%}-administration,http://{%{{%{{{ .Release.Name }}}%}}%}-servicenamewithoutsuffix"
```
{%{{{~ end ~}}}%}
{%{{{~ if completed[helm_gateway] == null ~}}}%}

Below is an example of the *WebApiGateway* application `webapigateway.yaml` file.

```diff
apiVersion: apps/v1
kind: Deployment
metadata:
  name: "{%{{%{{{ .Release.Name }}}%}}%}-{%{{%{{{ .Chart.Name }}}%}}%}"
spec:
  selector:
    matchLabels:
      app: "{%{{%{{{ .Release.Name }}}%}}%}-{%{{%{{{ .Chart.Name }}}%}}%}"
  template:
    metadata:
      labels:
        app: "{%{{%{{{ .Release.Name }}}%}}%}-{%{{%{{{ .Chart.Name }}}%}}%}"
    spec:
      containers:
      - image: "{%{{%{{{ .Values.image.repository }}}%}}%}:{%{{%{{{ .Values.image.tag }}}%}}%}"
        imagePullPolicy: "{%{{%{{{ .Values.image.pullPolicy }}}%}}%}"
        name: "{%{{%{{{ .Release.Name }}}%}}%}-{%{{%{{{ .Chart.Name }}}%}}%}"
        ports:
        - name: "http"
          containerPort: 80
        env:
        ...
+       - name: "ReverseProxy__Clusters__ServicenameWithoutSuffix__Destinations__ServicenameWithoutSuffix__Address"
+         value: "http://{%{{%{{{ .Release.Name }}}%}}%}-servicenamewithoutsuffix"
```
{%{{{~ end ~}}}%}
{%{{{~ end ~}}}%}
{%{{{~ end ~}}}%}

## Developing the UI for the New Microservice

After adding the new microservice to the solution, you can develop the UI for the new microservice. For .NET applications, you can add the *Mymicroservice_7.Microservicename.Contracts* package to the UI application(s) to access the services provided by the new microservice. Afterwards, you can use the [generate-proxy](https://abp.io/docs/latest/cli#generate-proxy) command to generate the proxy classes for the new microservice.

```bash
abp generate-proxy -t csharp -url http://localhost:{{ config.launch_ports["service"] }}/ -m servicenamewithoutsuffix --without-contracts
```

Next, start creating *Pages* and *Components* for the new microservice in the UI application(s). Similarly, if you have an Angular application, you can use the [generate-proxy](https://abp.io/docs/latest/cli#generate-proxy) command to generate the proxy classes for the new microservice and start developing the UI.

```bash
abp generate-proxy -t ng -url http://localhost:{{ config.launch_ports["service"] }}/ -m servicenamewithoutsuffix
```