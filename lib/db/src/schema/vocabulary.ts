import { createInsertSchema } from "drizzle-zod";
import { pgTable, serial, text, timestamp, unique } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const vocabularyTable = pgTable(
  "vocabulary",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    word: text("word").notNull(),
    meaning: text("meaning").notNull(),
    example: text("example").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userWord: unique("vocabulary_user_word").on(table.userId, table.word),
  }),
);

export const insertVocabularySchema = createInsertSchema(vocabularyTable).omit({
  id: true,
  createdAt: true,
});

export type InsertVocabulary = z.infer<typeof insertVocabularySchema>;
export type Vocabulary = typeof vocabularyTable.$inferSelect;