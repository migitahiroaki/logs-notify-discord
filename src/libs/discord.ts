import {
  DiscordEmbed,
  DiscordNotification,
  VedustSeekerRecord,
} from "@/types/message";

const FRACTION_DIGITS = 2;
const SIGNIFICANT_DIGITS = 4;
const DUST_EMOJI = "<:DUST:1427844717634388019>";

export const toDiscordEmbed = (
  records: VedustSeekerRecord[],
): DiscordEmbed[] => {
  return records.map(
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
};

export const postWebhook = async (
  url: string,
  payload: DiscordNotification,
): Promise<Response> => {
  try {
    const response = await fetch(url, {
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
    return response;
  } catch (e) {
    console.error("エラーが発生しました:", e);
    throw e;
  }
};
