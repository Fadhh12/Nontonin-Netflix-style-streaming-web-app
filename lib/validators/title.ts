import { z } from "zod";

export const mediaTypeSchema = z.enum(["movie", "tv"], {
  message: "Permintaan tidak valid",
});

export const tmdbIdSchema = z
  .number()
  .int()
  .positive("Permintaan tidak valid");

export const searchQuerySchema = z
  .string()
  .trim()
  .min(2)
  .max(100);

/** Out-of-range page numbers are silently corrected to 1 (SRS 2.3). */
export const pageSchema = z
  .number()
  .int()
  .min(1)
  .max(500)
  .catch(1);

export const reactionValueSchema = z.union([
  z.literal(1),
  z.literal(-1),
  z.null(),
]);

export const myListItemSchema = z.object({
  tmdbId: tmdbIdSchema,
  mediaType: mediaTypeSchema,
  title: z.string().min(1),
  posterPath: z.string().nullable(),
});
