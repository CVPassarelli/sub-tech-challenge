export interface AppConfig {
  port: number;
  database: {
    url: string;
  };
  keycloak: {
    issuerUrl: string;
    jwksUri: string;
    audience: string;
  };
}

export default (): AppConfig => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  database: {
    url: process.env.DATABASE_URL ?? '',
  },
  keycloak: {
    issuerUrl: process.env.KEYCLOAK_ISSUER_URL ?? '',
    jwksUri: process.env.KEYCLOAK_JWKS_URI ?? '',
    audience: process.env.KEYCLOAK_AUDIENCE ?? '',
  },
});
