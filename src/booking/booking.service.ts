import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Booking, BookingDocument } from "./booking.model";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingDto } from "./dto/update-booking.dto";

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name)
    private bookingModel: Model<BookingDocument>
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    try {
      const booking = await this.bookingModel
        .findOne({ roomId: createBookingDto.roomId.toString(), deletedAt: null })
        .exec();
      if (booking) {
        if (
          new Date(booking.date).toDateString() === new Date(createBookingDto.date).toDateString()
        ) {
          throw new ConflictException("Booking already exists for this room and date");
        }
      }
      const createdBooking = new this.bookingModel(createBookingDto);
      return await createdBooking.save();
    } catch (error: unknown) {
      if (error instanceof Error && "code" in error && error.code === 11000) {
        throw new ConflictException("Booking already exists for this room and date");
      }
      throw error;
    }
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingModel.find({ deletedAt: null }).exec();
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingModel
      .findOne({ _id: id, deletedAt: null })
      .populate("roomId")
      .exec();

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    if (updateBookingDto.roomId || updateBookingDto.date) {
      const existingBooking = await this.bookingModel.findOne({
        roomId: updateBookingDto.roomId,
        date: updateBookingDto.date,
        _id: { $ne: new Types.ObjectId(id) },
        deletedAt: null,
      });

      if (existingBooking) {
        throw new ConflictException("Cannot update: booking already exists for this room and date");
      }
    }

    const updatedBooking = await this.bookingModel.findByIdAndUpdate(id, updateBookingDto, {
      new: true,
    });

    if (!updatedBooking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return updatedBooking;
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.bookingModel.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      { new: true }
    );

    if (!result) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return { message: "Booking deleted successfully" };
  }

  async isRoomBooked(roomId: string): Promise<boolean> {
    const existingBooking = await this.bookingModel.findOne({
      roomId: roomId,
      deletedAt: null,
    });

    return !!existingBooking;
  }

  async getStatistic(month: number) {
    return this.bookingModel
      .aggregate([
        {
          $match: {
            $expr: { $eq: [{ $month: "$date" }, month] },
          },
        },
        {
          $group: {
            _id: "$roomId",
            bookedDays: { $addToSet: "$date" },
          },
        },
        // Диагностика: выводим _id перед lookup
        {
          $addFields: {
            debug_roomId: "$_id",
            debug_type: { $type: "$_id" },
          },
        },
        {
          $addFields: {
            roomIdAsObjectId: { $toObjectId: "$_id" },
          },
        },
        {
          $lookup: {
            from: "rooms",
            localField: "roomIdAsObjectId",
            foreignField: "_id",
            as: "roomInfo",
          },
        },
        {
          $unwind: {
            path: "$roomInfo",
            preserveNullAndEmptyArrays: true, // сохраняем документы без комнаты
          },
        },
        {
          $project: {
            roomName: {
              $ifNull: ["$roomInfo.roomNumber", "Номер не найден"],
            },
            bookedCount: { $size: "$bookedDays" },
            _id: 0,
          },
        },
        { $sort: { bookedCount: -1 } },
      ])
      .exec();
  }
}
