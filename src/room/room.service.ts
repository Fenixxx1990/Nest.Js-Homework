import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Room, RoomDocument } from "./room.model";
import { CreateRoomDto } from "./dto/create-room.dto";
import { UpdateRoomDto } from "./dto/update-room.dto";

@Injectable()
export class RoomService {
  constructor(@InjectModel(Room.name) private roomModel: Model<RoomDocument>) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    // Проверка уникальности номера комнаты
    const existingRoom = await this.roomModel.findOne({
      roomNumber: createRoomDto.roomNumber,
    });

    if (existingRoom) {
      throw new ConflictException(`Room with number ${createRoomDto.roomNumber} already exists`);
    }

    const createdRoom = new this.roomModel(createRoomDto);
    return createdRoom.save();
  }

  async findAll(): Promise<Room[]> {
    return this.roomModel.find().exec();
  }

  async findOne(id: string): Promise<Room> {
    const room = await this.roomModel.findById(id).exec();
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    return room;
  }

  async update(id: string, updateRoomDto: UpdateRoomDto): Promise<Room> {
    // Если обновляется номер комнаты, проверяем его уникальность
    if (updateRoomDto.roomNumber) {
      const existingRoom = await this.roomModel.findOne({
        roomNumber: updateRoomDto.roomNumber,
        _id: { $ne: id }, // Исключаем текущую комнату из проверки
      });

      if (existingRoom) {
        throw new ConflictException(`Room with number ${updateRoomDto.roomNumber} already exists`);
      }
    }

    const room = await this.roomModel
      .findByIdAndUpdate(id, updateRoomDto, {
        new: true,
      })
      .exec();

    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    return room;
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.roomModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    return { message: "Room deleted successfully" };
  }
}
