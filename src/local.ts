import { CloudWatchLogsDecodedData, CloudWatchLogsEvent } from "aws-lambda";
import * as zlib from "zlib";
import { handler } from "./notify";

const logEvent = {
  timestamp: "2026-05-15T10:58:45.386Z",
  level: "INFO",
  requestId: "3a6a06fc-3716-448f-9a15-cad32faa29fd",
  message: {
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
    deviation: -0.04190877666679238,
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
