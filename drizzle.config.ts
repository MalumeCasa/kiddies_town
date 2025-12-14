//Important File 6 of 6
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  // The location of your schema file or directory
  schema: './api/db/schema.ts', 

  // The output directory for Drizzle migration files
  out: './drizzle', 

  // The database dialect (PostgreSQL for Neon)
  dialect: 'postgresql', 

  // The database credentials, retrieved from environment variables
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
