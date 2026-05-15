import { CloudWatchLogsDecodedData, CloudWatchLogsEvent } from "aws-lambda";
import * as zlib from "zlib";
import { handler } from "./notify";

const logEvent = {
  timestamp: "2026-05-15T10:58:45.386Z",
  level: "INFO",
  requestId: "3a6a06fc-3716-448f-9a15-cad32faa29fd",
  message: {
    "15479": {
      id: "15479",
      treasuryDust: 500,
      imageUrl:
        "https://i2c.seadn.io/monad/0xbb4738d05ad1b3da57a4881bae62ce9bb1eeed6c/6b0c11bf028834c4e6b4778c2dae21/f56b0c11bf028834c4e6b4778c2dae21.avif",
      rarity: "Common",
      archeType: "Mermaid",
      character: "Inga",
      priceInMon: 8179.73018,
      priceInUsd: 242.77839981018818,
      updatedAt: 1778810116,
      dustValue: 253.39800000000002,
      dustUnitPrice: 0.48555679962037634,
      diviation: -0.04190877666679238,
    },
    "15513": {
      id: "15513",
      treasuryDust: 500,
      imageUrl:
        "https://i2c.seadn.io/monad/0xbb4738d05ad1b3da57a4881bae62ce9bb1eeed6c/3c4a87382052b7a7f9ddfa5a12f0ad/e93c4a87382052b7a7f9ddfa5a12f0ad.avif",
      rarity: "Common",
      archeType: "Pirate",
      character: "Star-Eye Selwyn",
      priceInMon: 8530.532359,
      priceInUsd: 246.13179137552137,
      updatedAt: 1778838700,
      dustValue: 251.63200000000003,
      dustUnitPrice: 0.49226358275104276,
      diviation: -0.02185814453042001,
    },
  },
};

const rawPayload: CloudWatchLogsDecodedData = {
  owner: "123456789012",
  logGroup: "/aws/lambda/your-function-name",
  logStream: "2026/05/15/[$LATEST]abcdef123456",
  subscriptionFilters: ["YourFilterName"],
  messageType: "DATA_MESSAGE",
  logEvents: [
    {
      id: "event-id-123",
      timestamp: Date.now(),
      message: JSON.stringify(logEvent), // メッセージ部分は文字列化されている必要がある
    },
  ],
};

const jsonStr = JSON.stringify(rawPayload);
const compressed = zlib.gzipSync(jsonStr);
const encoded = compressed.toString("base64");

const event: CloudWatchLogsEvent = {
  awslogs: {
    data: encoded,
  },
};

handler(event);
