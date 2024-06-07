import { z } from "zod";

export const releaseSchema = z.object({
  pre: z.boolean().optional().default(false),
  level: z.union(
    [
      z.literal("patch"),
      z.literal("minor"),
      z.literal("major"),
      z.literal("preup"),
    ],
    {
      message: "Invalid release level",
    }
  ),
});

export type ReleaseSchemaType = z.infer<typeof releaseSchema>;
