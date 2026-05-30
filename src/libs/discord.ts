import {
  DiscordEmbed,
  DiscordEmbedSchema,
  DiscordNotification,
  VedustSeekerRecord,
} from "@/types/message";

const FRACTION_DIGITS = 2;
const SIGNIFICANT_DIGITS = 4;
const DUST_EMOJI = "<:DUST:1427844717634388019>";
const MARKET_BASE_URL =
  "https://opensea.io/item/monad/0xBB4738D05AD1b3Da57a4881baE62Ce9bb1eEeD6C";

export const toDiscordEmbed = (
  records: VedustSeekerRecord[],
  existingIdSet: Set<string>,
): DiscordEmbed[] => {
  return records.map((r) =>
    DiscordEmbedSchema.parse({
      author: {
        name: `${r.character}#${r.id}`,
      },
      title: `${r.priceInMon.toFixed(FRACTION_DIGITS)} MON ($${r.priceInUsd.toFixed(FRACTION_DIGITS)})`,
      url: `${MARKET_BASE_URL}/${r.id}`,
      description: `${DUST_EMOJI} ${r.treasuryDust.toFixed(FRACTION_DIGITS)} DUST`,
      thumbnail: {
        url: r.imageUrl,
      },
      color: existingIdSet.has(r.id) ? 0x0000ff : 0x00ff00, // 新着は緑、更新は青
      fields: [
        {
          name: "dustUnitPrice",
          value: `$${r.dustUnitPrice.toPrecision(SIGNIFICANT_DIGITS)} / DUST`,
          inline: false,
        },
        {
          name: "archeType",
          value: r.archeType,
          inline: true,
        },
        {
          name: "rarity",
          value: r.rarity,
          inline: true,
        },
        {
          name: "deviation",
          value: `${(r.deviation * 100).toPrecision(SIGNIFICANT_DIGITS)} %`,
          inline: true,
        },
      ],
    }),
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
