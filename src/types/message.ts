export interface VedustSeekerRecord {
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
  diviation: number;
}

/**
 * Discord Webhookのペイロード
 */
export interface DiscordNotification {
  username?: string; // Webhookの名前を上書き
  avatar_url?: string; // Webhookのアイコンを上書き
  content?: string; // 通常のテキストメッセージ
  embeds?: DiscordEmbed[]; // 埋め込みコンテンツ（最大10個まで）
}

/**
 * 埋め込み（Embed）コンテンツの詳細構造
 */
export interface DiscordEmbed {
  title?: string;
  description?: string;
  url?: string;
  timestamp?: string; // ISO8601形式の文字列
  color?: number; // 10進数の整数（例: 0xff0000 は 16711680）
  footer?: {
    text: string;
    icon_url?: string;
  };
  image?: {
    url: string;
  };
  thumbnail?: {
    url: string;
  };
  author?: {
    name: string;
    url?: string;
    icon_url?: string;
  };
  fields?: DiscordEmbedField[];
}

/**
 * Embed内の各フィールド（項目）
 */
interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean; // 横並びにするかどうか
}
