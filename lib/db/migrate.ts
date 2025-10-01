import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { neon } from "@neondatabase/serverless";

const runMigrations = async () => {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);

  console.log("⏳ Running migrations...");

  await migrate(db, { migrationsFolder: "./drizzle" });

  console.log("✅ Migrations completed!");
  process.exit(0);
};

runMigrations().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
