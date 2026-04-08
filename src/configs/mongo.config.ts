import type { ConfigService } from "@nestjs/config";
import type { MongooseModuleFactoryOptions } from "@nestjs/mongoose/dist";

export const getMongoConfig = (configService: ConfigService): MongooseModuleFactoryOptions => {
  return {
    uri: getMongoSrting(configService),
    // ...getMongoOptions(),
  };
};

const getMongoSrting = (configService: ConfigService): string =>
  `mongodb://${configService.get("MONGO_LOGIN")}:${configService.get(
    "MONGO_PASSWORD"
  )}@${configService.get("MONGO_HOST")}:${configService.get("MONGO_PORT")}/${configService.get(
    "MONGO_AUTHDATABASE"
  )}`;

// const getMongoOptions = () => ({
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useUnifiedTopology: true,
// });
