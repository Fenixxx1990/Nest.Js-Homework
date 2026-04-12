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

@Controller("bookings")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
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
  @Roles("admin")
  remove(@Param("id") id: string) {
    return this.bookingService.remove(id);
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
