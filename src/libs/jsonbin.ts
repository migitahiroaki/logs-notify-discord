import { NumRecord, VedustJsonBinResponse, ZNumRecord } from "@/types/vedust";

export class JsonBin {
  private binId: string;
  private apiKey: string;

  constructor(binId: string, apiKey: string) {
    this.binId = binId;
    this.apiKey = apiKey;
  }

  public async get(): Promise<NumRecord> {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${this.binId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-ACCESS-KEY": this.apiKey,
      },
    });
    const rawJson = await response.json();

    const body = VedustJsonBinResponse.parse(rawJson);
    console.debug("GET", body);
    return body.record;
  }

  public async put(record: NumRecord): Promise<NumRecord> {
    const payload = ZNumRecord.parse(record);
    const response = await fetch(`https://api.jsonbin.io/v3/b/${this.binId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-ACCESS-KEY": this.apiKey,
      },
      body: JSON.stringify(payload),
    });

    const rawJson = await response.json();
    const body = VedustJsonBinResponse.parse(rawJson);
    console.debug("PUT", body);
    return body.record;
  }
}
