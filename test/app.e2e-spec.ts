import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import type { App } from "supertest/types";
import { AppModule } from "./../src/app.module";
import type { CreateRoomDto } from "@/room/dto/create-room.dto";
import type { Room } from "@/room/room.model";
import type { CreateBookingDto } from "@/booking/dto/create-booking.dto";

const testRoomDto: CreateRoomDto = {
  roomNumber: "202",
  type: "для 2",
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
    return request(app.getHttpServer()).post("/rooms").send().expect(400);
  });

  it("/bookings (POST) - success", async () => {
    const createBookingDto: CreateBookingDto = {
      roomId: createRoomId,
      date: new Date(),
    };

    const response = await request(app.getHttpServer())
      .post("/bookings")
      .send(createBookingDto)
      .expect(201);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    createBookingId = response.body._id as string;
    console.log(createBookingId);
    expect(createBookingId).toBeDefined();
  });

  it("/rooms/:id (GET) - success", async () => {
    const response = await request(app.getHttpServer()).get(`/rooms/${createRoomId}`).expect(200);

    const result = response.body as Room;
    expect(result._id).toBe(createRoomId);
  });

  it("/rooms/:id (GET) - faild", async () => {
    return request(app.getHttpServer()).get(`/rooms/${createBookingId}`).expect(404);
  });

  it("/bookings/:id (GET) - faild", async () => {
    return request(app.getHttpServer()).get(`/bookings/${createRoomId}`).expect(404);
  });

  it("/rooms (GET) - success", async () => {
    const response = await request(app.getHttpServer()).get("/rooms").expect(200);

    const result = response.body as Room[];
    expect(result.length).toBe(1);
  });

  it("/bookings/:id (GET) - success", async () => {
    const response = await request(app.getHttpServer())
      .get(`/bookings/${createBookingId}`)
      .expect(200);

    const result = response.body as Room;
    expect(result._id).toBe(createBookingId);
  });

  it("/bookings (GET) - success", async () => {
    const response = await request(app.getHttpServer()).get("/bookings").expect(200);

    const result = response.body as Room[];
    expect(result.length).toBe(1);
  });

  it("/rooms/:id (DELET) - success", async () => {
    return request(app.getHttpServer()).delete(`/rooms/${createRoomId}`).expect(200);
  });

  it("/bookings/:id (DELET) - success", async () => {
    return request(app.getHttpServer()).delete(`/bookings/${createBookingId}`).expect(200);
  });

  afterEach(async () => {
    await app.close();
  });
});
