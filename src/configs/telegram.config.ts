import type { ITelegramOptions } from "@/telegram/telegram.interface";
import type { ConfigService } from "@nestjs/config";

export const getTelegramConfig = async (
  configService: ConfigService
): Promise<ITelegramOptions> => {
  const token = await configService.get<Promise<string>>("TELEGRAM_TOKEN");
  if (!token) {
    throw new Error("TELEGRAM_TOKEN не задан");
  }
  return {
    token,
    chatId: (await configService.get("CHAT_ID")) ?? "",
  };
};
