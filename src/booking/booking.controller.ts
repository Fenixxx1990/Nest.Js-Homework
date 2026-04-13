import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from "@nestjs/common";
import { BookingService } from "./booking.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingDto } from "./dto/update-booking.dto";
import { RolesGuard } from "@/user/guards/roles.guard";
import { AuthGuard } from "@nestjs/passport";
import { Roles } from "@/user/decorators/roles.decorator";
import { TelegramService } from "@/telegram/telegram.service";

@Controller("bookings")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly telegramService: TelegramService
  ) {}

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createBookingDto: CreateBookingDto) {
    const createBooking = this.bookingService.create(createBookingDto);
    const message = `Комната ${createBookingDto.roomId.toString()} забронирована ${createBookingDto.date.toString()} числа`;
    await this.telegramService.sendMessage(message);
    return createBooking;
  }

  @Get()
  findAll() {
    return this.bookingService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.bookingService.findOne(id);
  }

  @Put(":id")
  @UsePipes(ValidationPipe)
  update(@Param("id") id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(id, updateBookingDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    const deletBooking = this.bookingService.remove(id);
    const message = `Бронирование ${id} отменено ${new Date().toDateString()} числа`;
    await this.telegramService.sendMessage(message);
    return deletBooking;
  }

  @Get("/statistic/:monthNumber")
  @Roles("admin")
  getStatistic(@Param("monthNumber") monthNumber: string) {
    const monthNum = parseInt(monthNumber, 10);

    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      throw new Error("Month must be a number between 1 and 12");
    }

    return this.bookingService.getStatistic(monthNum);
  }
}
