import { Environment } from '@abp/ng.core';

const baseUrl = 'http://localhost:4200';

const oAuthConfig = {
  issuer: 'https://localhost:44390/',
  redirectUri: baseUrl,
  clientId: 'Mymicroservice_7_App',
  responseType: 'code',
  scope: 'offline_access openid profile email phone AuthServer IdentityService AdministrationService AuditLoggingService GdprService ChatService SaasService FileManagementService',
  requireHttps: true,
  impersonation: {
    tenantImpersonation: true,
    userImpersonation: true,
  }
};

export const environment = {
  production: true,
  application: {
    baseUrl,
    name: 'Mymicroservice_7',
  },
  oAuthConfig,
  apis: {
    default: {
      url: 'http://localhost:44305',
      rootNamespace: 'Mymicroservice_7',
    },
    AbpAccountPublic: {
      url: oAuthConfig.issuer,
      rootNamespace: 'AbpAccountPublic',
    },
  },
  remoteEnv: {
    url: '/getEnvConfig',
    mergeStrategy: 'overwrite',
  },
} as Environment;
