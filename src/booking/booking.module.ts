import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BookingController } from "./booking.controller";
import { BookingService } from "./booking.service";
import { Booking, BookingSchema } from "./booking.model";
import { JwtModule } from "@nestjs/jwt";
import { TelegramModule } from "@/telegram/telegram.module";

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    TelegramModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
