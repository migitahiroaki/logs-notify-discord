import {
  CloudWatchLogsDecodedData,
  CloudWatchLogsEvent,
  CloudWatchLogsLogEvent,
} from "aws-lambda";
import * as zlib from "zlib";
import { promisify } from "util";
import {
  DiscordEmbed,
  DiscordNotification,
  VedustSeekerRecord,
} from "./types/message";
import { postWebhook, toDiscordEmbed } from "./libs/discord";

const gunzip = promisify(zlib.gunzip);
const webhookUrl = process.env.WEBHOOK_URL!;
const CACHE_LIMIT = 16;
const cache: { [id: string]: number } = {};

export const handler = async (event: CloudWatchLogsEvent): Promise<void> => {
  console.debug("event", event);

  // Base64デコード
  const decoded = Buffer.from(event.awslogs.data, "base64");
  // gz解凍
  const decompressed = await gunzip(decoded);
  // 3. 文字列変換 & JSONパース
  const data: CloudWatchLogsDecodedData = JSON.parse(
    decompressed.toString("utf-8"),
  );

  const records: VedustSeekerRecord[] = data.logEvents.reduce(
    (acc: VedustSeekerRecord[], record: CloudWatchLogsLogEvent) => {
      const parsed = JSON.parse(record.message);
      const vsr = parsed.message as VedustSeekerRecord;

      // cache がすでに存在して安くなってない場合、skip
      if (vsr.id in cache && cache[vsr.id] <= vsr.dustUnitPrice) return acc;
      // cache と acc 両方を更新
      cache[vsr.id] = vsr.dustUnitPrice;
      acc.push(vsr);
      return acc;
    },
    [],
  );
  console.debug("records", records);

  // 破壊的削除（リミットからあふれる古いレコードを消す）
  const currentSize = Object.keys(cache).length;
  if (currentSize > CACHE_LIMIT) {
    const overflowCount = currentSize - CACHE_LIMIT;
    const keysToDelete = Object.keys(cache).slice(0, overflowCount);
    console.debug("キャッシュから削除対象のkeys", keysToDelete);
    keysToDelete.forEach((key) => delete cache[key]);
  }

  const embeds: DiscordEmbed[] = toDiscordEmbed(records);
  const payload: DiscordNotification = {
    embeds,
  };

  console.debug("payload", JSON.stringify(payload));
  await postWebhook(webhookUrl, payload);
};
