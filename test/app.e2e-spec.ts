import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { ValidationPipe, type INestApplication } from "@nestjs/common";
import request from "supertest";
import type { App } from "supertest/types";
import { AppModule } from "./../src/app.module";
import type { CreateRoomDto } from "@/room/dto/create-room.dto";
import type { Room } from "@/room/room.model";
import type { CreateBookingDto } from "@/booking/dto/create-booking.dto";
import { Types } from "mongoose";
import type { Booking } from "@/booking/booking.model";

const fixRoomIdforBooking = new Types.ObjectId();
const fixBookingIdforRoom = new Types.ObjectId();

const createBookingDto: CreateBookingDto = {
  roomId: fixRoomIdforBooking,
  date: new Date(),
};

const UpdateCreateBookingDto: CreateBookingDto = {
  roomId: new Types.ObjectId(),
  date: new Date(),
};

const testRoomDto: CreateRoomDto = {
  roomNumber: "202",
  type: "для 2",
  hasSeaView: true,
};

const updateTestRoomDto: CreateRoomDto = {
  roomNumber: "202",
  type: "для 3",
  hasSeaView: true,
};

describe("AppController (e2e)", () => {
  let app: INestApplication<App>;
  let createRoomId: string;
  let createBookingId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  it("/rooms (POST) - success", async () => {
    const response = await request(app.getHttpServer())
      .post("/rooms")
      .send(testRoomDto)
      .expect(201);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    createRoomId = response.body._id as string;
    expect(createRoomId).toBeDefined();
  });

  it("/rooms (POST) - faild", async () => {
    return request(app.getHttpServer())
      .post("/rooms")
      .send({ ...testRoomDto, hasSeaView: "asd" })
      .expect(400);
  });

  it("/rooms/:id (GET) - success", async () => {
    const response = await request(app.getHttpServer()).get(`/rooms/${createRoomId}`).expect(200);

    const result = response.body as Room;
    expect(result._id).toBe(createRoomId);
  });

  it("/rooms/:id (GET) - faild", async () => {
    return request(app.getHttpServer()).get(`/rooms/${fixBookingIdforRoom.toString()}`).expect(404);
  });

  it("/rooms (GET) - success", async () => {
    const response = await request(app.getHttpServer()).get("/rooms").expect(200);

    const result = response.body as Room[];
    expect(result.length).toBe(1);
  });

  it("/rooms/:id (PUT) - success", async () => {
    const response = await request(app.getHttpServer())
      .put(`/rooms/${createRoomId}`)
      .send(updateTestRoomDto)
      .expect(200);

    const result = response.body as Room;
    expect(result.type).toBe(updateTestRoomDto.type);
  });

  it("/rooms/:id (DELET) - success", async () => {
    return request(app.getHttpServer()).delete(`/rooms/${createRoomId}`).expect(200);
  });

  it("/bookings (POST) - success", async () => {
    const response = await request(app.getHttpServer())
      .post("/bookings")
      .send(createBookingDto)
      .expect(201);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    createBookingId = response.body._id as string;
    expect(createBookingId).toBeDefined();
  });

  it("/bookings (POST) - fail", () => {
    return request(app.getHttpServer())
      .post("/bookings")
      .send({ ...createBookingDto, date: "q2341" })
      .expect(400);
  });

  it("/bookings/:id (GET) - success", async () => {
    const response = await request(app.getHttpServer())
      .get(`/bookings/${createBookingId}`)
      .expect(200);

    const result = response.body as Room;
    expect(result._id).toBe(createBookingId);
  });

  it("/bookings/:id (GET) - faild", async () => {
    return request(app.getHttpServer())
      .get(`/bookings/${new Types.ObjectId().toString()}`)
      .expect(404);
  });

  it("/bookings (GET) - success", async () => {
    const response = await request(app.getHttpServer()).get("/bookings").expect(200);

    const result = response.body as Room[];
    expect(result.length).toBe(1);
  });

  it("/bookings/:id (PUT) - success", async () => {
    const response = await request(app.getHttpServer())
      .put(`/bookings/${createBookingId}`)
      .send(UpdateCreateBookingDto)
      .expect(200);

    const result = response.body as Booking;
    expect(result.roomId).toBe(UpdateCreateBookingDto.roomId.toString());
  });

  it("/bookings/:id (DELET) - success", async () => {
    return request(app.getHttpServer()).delete(`/bookings/${createBookingId}`).expect(200);
  });

  afterEach(async () => {
    await app.close();
  });
});
