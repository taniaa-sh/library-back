namespace NodeJS {
  interface ProcessEnv {
    PORT: number;
    BASE_URL: string;

    MONGO_URI: string;

    SMTP_HOST: string;
    SMTP_PORT: string;
    SMTP_SECURE: string;
    SMTP_USER: string;
    SMTP_PASS: string;
    SMTP_FROM: string;

    SMS_TOKEN: string;

    JWT_SECRET: string;
  }
}