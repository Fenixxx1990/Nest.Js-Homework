import { Injectable, NotFoundException } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcryptjs";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserModel, UserDocument } from "./user.model";
import { UserResponseDto } from "./dto/user.response.dto";
import { USER_VALIDATION_MESSAGES } from "./user.constants";

@Injectable()
export class UserService {
  constructor(@InjectModel(UserModel.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const salt = await bcrypt.genSalt(10);
    const { password, ...userData } = createUserDto;
    const passwordHash = await bcrypt.hash(password, salt);

    const createdUser = new this.userModel({
      ...userData,
      passwordHash,
    });

    const savedUser = await createdUser.save();
    return this.toResponseDto(savedUser);
  }

  async findByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(USER_VALIDATION_MESSAGES.NOT_FOUND_EMAIL_ERROR);
    }
    return this.toResponseDto(user);
  }

  async findByEmailForLogin(email: string): Promise<UserResponseDto> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(USER_VALIDATION_MESSAGES.NOT_FOUND_EMAIL_ERROR);
    }
    return user;
  }

  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(USER_VALIDATION_MESSAGES.NOT_FOUND_ID_ERROR);
    }
    return this.toResponseDto(user);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userModel.find().exec();
    return users.map(user => this.toResponseDto(user));
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const updateData: Partial<UserModel> = {};
    const { password, ...fieldsToUpdate } = updateUserDto;

    Object.assign(updateData, fieldsToUpdate);

    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(USER_VALIDATION_MESSAGES.NOT_FOUND_ID_ERROR);
    }

    return this.toResponseDto(updatedUser);
  }

  async delete(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(USER_VALIDATION_MESSAGES.NOT_FOUND_ID_ERROR);
    }
  }

  toResponseDto(user: UserDocument): UserResponseDto {
    const { _id, name, email, role, phoneNumber, createdAt, updatedAt } = user;
    return {
      id: _id.toString(),
      name,
      email,
      role,
      phoneNumber,
      createdAt,
      updatedAt,
    };
  }
}
