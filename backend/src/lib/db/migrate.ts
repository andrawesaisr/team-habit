import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined. Set it before running migrations.");
}

const runMigrations = async () => {
    const connectionString = process.env.DATABASE_URL!;
    const sql = postgres(connectionString, { max: 1 });
    const db = drizzle(sql);

    console.log("Running migrations...");

    await migrate(db, { migrationsFolder: "drizzle" });

    console.log("Migrations completed.");

    await sql.end();
};

runMigrations().catch((err) => {
    console.error("Error running migrations:", err);
    process.exit(1);
});
