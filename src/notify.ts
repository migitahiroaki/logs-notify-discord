import { CloudWatchLogsDecodedData, CloudWatchLogsEvent } from "aws-lambda";
import * as zlib from "zlib";
import { promisify } from "util";
import {
  DiscordEmbed,
  DiscordNotification,
  VedustSeekerRecord,
} from "./types/message";

const gunzip = promisify(zlib.gunzip);
const webhookUrl = process.env.WEBHOOK_URL!;
const FRACTION_DIGITS = 2;
const SIGNIFICANT_DIGITS = 4;
const DUST_EMOJI = "<:DUST:1427844717634388019>";

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

  const records: VedustSeekerRecord[] = data.logEvents.map((o) => {
    const parsed = JSON.parse(o.message);
    const vsr = parsed.message as VedustSeekerRecord;
    return vsr;
  });

  console.debug("records", records);

  const embeds: DiscordEmbed[] = records.map(
    (le) =>
      ({
        author: {
          name: `${le.character}#${le.id}`,
        },
        title: `${le.priceInMon.toFixed(FRACTION_DIGITS)} MON ($${le.priceInUsd.toFixed(FRACTION_DIGITS)})`,
        description: `${DUST_EMOJI} ${le.treasuryDust.toFixed(FRACTION_DIGITS)} DUST`,
        thumbnail: {
          url: le.imageUrl,
        },
        color: le.deviation < 0 ? 0x00ff00 : 0xff0000,
        fields: [
          {
            name: "archeType",
            value: le.archeType,
            inline: true,
          },
          {
            name: "rarity",
            value: le.rarity,
            inline: true,
          },
          {
            name: "dustUnitPrice",
            value: `$${le.dustUnitPrice.toFixed(FRACTION_DIGITS)} / DUST`,
            inline: true,
          },
          {
            name: "deviation",
            value: (le.deviation * 100).toPrecision(SIGNIFICANT_DIGITS),
            inline: true,
          },
        ],
      }) as DiscordEmbed,
  );

  const payload: DiscordNotification = {
    embeds,
  };

  console.debug("payload", JSON.stringify(payload));

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.info("送信成功");
    } else {
      console.error("送信失敗:", response.statusText);
    }
  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
};
