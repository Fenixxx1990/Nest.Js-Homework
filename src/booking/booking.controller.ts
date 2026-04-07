import { Controller, Get, Post, Put, Delete, Param, Body } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingDto } from "./dto/update-booking.dto";

@Controller("bookings")
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }

  @Get()
  async findAll() {
    return this.bookingService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.bookingService.findOne(id);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(id, updateBookingDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.bookingService.remove(id);
  }

  @Get(":roomId/availability")
  async checkRoomAvailability(@Param("roomId") roomId: string) {
    const isBooked = await this.bookingService.isRoomBooked(roomId);

    return {
      roomId,
      available: !isBooked,
      message: isBooked ? "Room is currently booked" : "Room is available for booking",
    };
  }
}
