import { NumRecord, VedustJsonBinResponse, ZNumRecord } from "@/types/vedust";

export class JsonBin {
  private binId: string;
  private apiKey: string;

  constructor(binId: string, apiKey: string) {
    this.binId = binId;
    this.apiKey = apiKey;
  }

  // JsonBin 無料プランではスキーマチェックが使えないので、データが汚れてたらダミーレコードでリセット
  private async withFallback(fn: () => Promise<NumRecord>): Promise<NumRecord> {
    try {
      return await fn();
    } catch (error) {
      console.error("JsonBin API エラー:", error);
      return { dummy: 0 } as NumRecord;
    }
  }

  public async get(): Promise<NumRecord> {
    return this.withFallback(async () => {
      const response = await fetch(
        `https://api.jsonbin.io/v3/b/${this.binId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-ACCESS-KEY": this.apiKey,
          },
        },
      );
      const rawJson = await response.json();

      const body = VedustJsonBinResponse.parse(rawJson);
      console.debug("GET", body);
      return body.record;
    });
  }

  public async put(record: NumRecord): Promise<NumRecord> {
    return this.withFallback(async () => {
      const payload = ZNumRecord.parse(record);
      const response = await fetch(
        `https://api.jsonbin.io/v3/b/${this.binId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-ACCESS-KEY": this.apiKey,
          },
          body: JSON.stringify(payload),
        },
      );

      const rawJson = await response.json();
      const body = VedustJsonBinResponse.parse(rawJson);
      console.debug("PUT", body);
      return body.record;
    });
  }
}
