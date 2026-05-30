import { CloudWatchLogsDecodedData, CloudWatchLogsEvent } from "aws-lambda";
import * as zlib from "zlib";
import { promisify } from "util";
import { DiscordNotification } from "./types/message";
import { postWebhook, toDiscordEmbed } from "./libs/discord";
import { JsonBin } from "./libs/jsonbin";
import { filterAndUpdateCache } from "./libs/deduplication";

const gunzip = promisify(zlib.gunzip);
const webhookUrl = process.env.WEBHOOK_URL!;
const jsonBin = new JsonBin(
  process.env.JSONBIN_BIN_ID!,
  process.env.JSONBIN_API_KEY!,
);

export const handler = async (event: CloudWatchLogsEvent): Promise<void> => {
  try {
    console.debug("event", event);

    // Base64デコード & gz解凍 & JSON パース
    const decoded = Buffer.from(event.awslogs.data, "base64");
    const decompressed = await gunzip(decoded);
    const data: CloudWatchLogsDecodedData = JSON.parse(
      decompressed.toString("utf-8"),
    );

    // ログをフィルタリングしてキャッシュを更新
    const { notifyRecords, existingIdSet } = await filterAndUpdateCache(
      data.logEvents,
      jsonBin,
    );

    if (notifyRecords.length === 0) {
      console.debug("新着・更新レコードなし");
      return;
    }

    // Discord に通知
    const embeds = toDiscordEmbed(notifyRecords, existingIdSet);
    const payload: DiscordNotification = { embeds };

    console.debug("payload", JSON.stringify(payload));
    await postWebhook(webhookUrl, payload);
  } catch (error) {
    console.error("ハンドラエラー:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorPayload: DiscordNotification = {
      content: `❌ ERROR: ${errorMessage}`,
    };
    await postWebhook(webhookUrl, errorPayload);
  }
};
