import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { ValidationPipe, type INestApplication } from "@nestjs/common";
import request from "supertest";
import type { App } from "supertest/types";
import { AppModule } from "../src/app.module";
import type { CreateUserDto } from "@/user/dto/create-user.dto";
import type { UserRole } from "@/user/user.model";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZlbml4QGdtYWlsLmNvbSIsImlhdCI6MTc3NTgzNDcyMX0.zBrA55W2mnIy9e1ps72kttIQmKBU-dnsqkA0zEevfxU";

const testUser: CreateUserDto = {
  name: "Test User",
  email: "test@example.com",
  password: "Password123",
  role: "user" as UserRole,
};

const adminUser: CreateUserDto = {
  name: "Admin User",
  email: "admin@example.com",
  password: "AdminPass123",
  role: "admin" as UserRole,
};

describe("AppController (e2e)", () => {
  let app: INestApplication<App>;
  let createUserId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  it("/auth/register (POST) - success", async () => {
    const response = await request(app.getHttpServer())
      .post("/auth/register")
      .send(testUser)
      .expect(201);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    createUserId = response.body.id;
  });

  it("/users (GET) - success", async () => {
    const response = await request(app.getHttpServer())
      .get("/users")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const result = response.body as CreateUserDto[];
    expect(result.length).toBe(1);
  });

  it("/users/test/:id (DELETE) - success", async () => {
    return request(app.getHttpServer())
      .delete(`/users/test/${createUserId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);
  });

  afterEach(async () => {
    await app.close();
  });
});
