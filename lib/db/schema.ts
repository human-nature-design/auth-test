import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const fooBar = pgTable("foo_bar", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
