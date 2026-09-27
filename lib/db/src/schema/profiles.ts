import { createInsertSchema } from "drizzle-zod";
import { integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export type LearningMemory = string[];

export const profilesTable = pgTable("profiles", {
  userId: text("user_id").primaryKey(),
  name: text("name").notNull().default(""),
  englishLevel: text("english_level").notNull().default("intermediate"),
  conversationStyle: text("conversation_style").notNull().default("friendly"),
  dailyGoal: integer("daily_goal").notNull().default(10),
  learningMemory: jsonb("learning_memory").$type<LearningMemory>().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertProfileSchema = createInsertSchema(profilesTable).omit({
  createdAt: true,
  updatedAt: true,
});

export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profilesTable.$inferSelect;