import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { RoomModule } from "./room/room.module";
import { BookingModule } from "./booking/booking.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { getMongoConfig } from "./configs/mongo.config";

@Module({
  imports: [
    RoomModule,
    BookingModule,
    ConfigModule.forRoot({
      isGlobal: true, // теперь должно работать
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
