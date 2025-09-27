import {EnvConst} from "../const/env/env.const";


export class EnvUtil {
  static getValue(key: string, defaultValue?: string): string | null {
    return process.env[key] || defaultValue || null;
  }

  static isLocal(): boolean {
    return process.env.NODE_ENV === EnvConst.LOCAL;
  }

  static isDev(): boolean {
    return process.env.NODE_ENV === EnvConst.DEV;
  }

  static isProd(): boolean {
    return process.env.NODE_ENV === EnvConst.PROD;
  }

  static isUat(): boolean {
    return process.env.NODE_ENV === EnvConst.UAT;
  }

  static isStg(): boolean {
    return process.env.NODE_ENV === EnvConst.STG;
  }

  static isNonProdEnv(): boolean {
    return !this.isProd();
  }

  static getFEEmailVerificationPageUrl() {
    return this.getValue('FRONTEND_EMAIL_VERIFICATION_PAGE');
  }

  static getCloudFlareConfig() {
    const apiKey = this.getValue('CLOUDFLARE_API_KEY');
    const email = this.getValue('CLOUDFLARE_ACCOUNT_ID');
    const dnsRecordApi = this.getValue('CLOUDFLARE_DNS_RECORD_API');
    const domainSSLApi = this.getValue('CLOUDFLARE_DOMAIN_SSL_API');
    return {
      apiKey,
      email,
      dnsRecordApi,
      domainSSLApi,
    };
  }

  static getTammStoresDomain() {
    return this.getValue('TAMM_STORES_DOMAIN', 'tamm-stores.com');
  }

  static getTammLoadBalancerDomain() {
    return this.getValue('TAMM_LOAD_BALANCER_DOMAIN');
  }

  static getInternalServiceApiKey() {
    return this.getValue('INTERNAL_SERVICE_API_KEY') as string;
  }

  static getS3BucketName() {
    return this.getValue('S3_BUCKET_NAME', '') as string;
  }
}
