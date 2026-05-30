import { z } from "zod";

export const VedustSeekerRecordSchema = z.object({
  id: z.string(),
  priceInMon: z.number(),
  treasuryDust: z.number(),
  imageUrl: z.url(),
  rarity: z.string(),
  archeType: z.string(),
  character: z.string(),
  priceInUsd: z.number(),
  updatedAt: z.number(),
  dustValue: z.number(),
  dustUnitPrice: z.number(),
  deviation: z.number(),
});

export type VedustSeekerRecord = z.infer<typeof VedustSeekerRecordSchema>;

export const ZNumRecord = z.record(z.string(), z.number());
export type NumRecord = z.infer<typeof ZNumRecord>;

export const VedustJsonBinResponse = z.object({
  record: ZNumRecord,
  metadata: z.object({
    id: z.string().optional(),
    parentId: z.string().optional(),
    private: z.boolean(),
    createdAt: z.iso.datetime().optional(),
    collectionId: z.string().optional(),
    name: z.string().optional(),
  }),
});
