namespace NodeJS {
  interface ProcessEnv {
    PORT: number;
    BASE_URL: string;

    MONGO_URI: string;

    JWT_SECRET: string;
  }
}