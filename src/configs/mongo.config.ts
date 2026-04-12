import type { ConfigService } from "@nestjs/config";
import type { MongooseModuleFactoryOptions } from "@nestjs/mongoose";

export const getMongoConfig = (configService: ConfigService): MongooseModuleFactoryOptions => {
  return {
    uri: getMongoString(configService),
    retryWrites: true,
    w: "majority",
  };
};

const getMongoString = (configService: ConfigService): string => {
  const login = configService.get<string>("MONGO_LOGIN");
  const password = configService.get<string>("MONGO_PASSWORD");
  const host = configService.get<string>("MONGO_HOST");
  const port = configService.get<number>("MONGO_PORT");
  const authDb = configService.get<string>("MONGO_AUTHDATABASE");
  const targetDb = configService.get<string>("MONGO_DATABASE");

  // Валидация обязательных параметров
  if (!login || !password || !host || !port || !authDb || !targetDb) {
    throw new Error(
      "Missing MongoDB configuration. Please check your environment variables: MONGO_LOGIN, MONGO_PASSWORD, MONGO_HOST, MONGO_PORT, MONGO_AUTHDATABASE, MONGO_DATABASE"
    );
  }

  // Экранирование пароля для безопасности (на случай специальных символов)
  const encodedPassword = encodeURIComponent(password);

  // Формирование URI: целевая база в пути, база аутентификации в параметре authSource
  return `mongodb://${login}:${encodedPassword}@${host}:${port}/${targetDb}?authSource=${authDb}`;
};
