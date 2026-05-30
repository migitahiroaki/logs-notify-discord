import { CloudWatchLogsLogEvent } from "aws-lambda";
import { VedustSeekerRecord } from "@/types/vedust";
import { JsonBin } from "./jsonbin";

export async function filterAndUpdateCache(
  logEvents: CloudWatchLogsLogEvent[],
  jsonBin: JsonBin,
): Promise<{
  notifyRecords: VedustSeekerRecord[];
  existingIdSet: Set<string>;
}> {
  // JsonBin からキャッシュを取得
  const cache = await jsonBin.get();
  const existingIdSet = new Set(Object.keys(cache));

  // イベントのすべてのレコードをパース
  const allRecords = logEvents.map((logEvent) => {
    const parsed = JSON.parse(logEvent.message);
    return parsed.message as VedustSeekerRecord;
  });

  // Discord通知対象を抽出（新着 または 価格変更）
  const notifyRecords: VedustSeekerRecord[] = allRecords.filter((vsr) => {
    // 新着：キャッシュに存在しない
    if (!(vsr.id in cache)) return true;
    // 価格変更：キャッシュの価格と異なる
    return cache[vsr.id] !== vsr.priceInMon;
  });
  console.debug("notifyRecords", notifyRecords);

  // イベントのすべてのレコードをキャッシュに保存
  const updateCache = allRecords.reduce(
    (acc, record) => {
      acc[record.id] = record.priceInMon;
      return acc;
    },
    {} as Record<string, number>,
  );

  await jsonBin.put(updateCache);

  return { notifyRecords, existingIdSet };
}
