namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    BASE_URL: string;
    MONGO_URL: string;
    JWT_SECRET: string;
    SMTP_HOST: string;
    SMTP_PORT: string;
    SMTP_SECURE: string;
    SMTP_USER: string;
    SMTP_PASS: string;
    SMTP_FROM: string;
  }
}