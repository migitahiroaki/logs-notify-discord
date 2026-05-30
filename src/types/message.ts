import z from "zod";

export interface VedustBaseRecord {
  id: string;
  priceInMon: number;
}

export interface VedustSeekerRecord extends VedustBaseRecord {
  id: string;
  treasuryDust: number;
  imageUrl: string;
  rarity: string;
  archeType: string;
  character: string;
  priceInMon: number;
  priceInUsd: number;
  updatedAt: number;
  dustValue: number;
  dustUnitPrice: number;
  deviation: number;
}

const DiscordEmbedFieldSchema = z.object({
  name: z.string(),
  value: z.string(),
  inline: z.boolean().optional(),
});

/**
 * 埋め込み（Embed）コンテンツの詳細構造
 */
export const DiscordEmbedSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  url: z.url().optional(),
  timestamp: z.string().optional(),
  color: z.number().optional(),
  footer: z
    .object({
      text: z.string(),
      icon_url: z.url().optional(),
    })
    .optional(),
  image: z
    .object({
      url: z.url(),
    })
    .optional(),
  thumbnail: z
    .object({
      url: z.url(),
    })
    .optional(),
  author: z
    .object({
      name: z.string(),
      url: z.url().optional(),
      icon_url: z.url().optional(),
    })
    .optional(),
  fields: z.array(DiscordEmbedFieldSchema).optional(),
});
export type DiscordEmbed = z.infer<typeof DiscordEmbedSchema>;

/**
 * Discord Webhookのペイロード
 */

export const DiscordNotificationSchema = z.object({
  username: z.string().optional(), // Webhookの名前を上書き
  avatar_url: z.url().optional(), // Webhookのアイコンを上書き
  content: z.string().optional(), // 通常のテキストメッセージ
  embeds: z.array(DiscordEmbedSchema).max(10).optional(), // 埋め込みコンテンツ（最大10個まで）
});

export type DiscordNotification = z.infer<typeof DiscordNotificationSchema>;
