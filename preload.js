// preload.js — loaded before the app starts to ensure .env overrides any
// system-level DATABASE_URL that the sandbox may have set.
const { config } = require("dotenv");
const { parsed } = config({ override: true });
// Force-override DATABASE_URL because the sandbox sets a stale SQLite value
// in the global environment that takes precedence over .env.
if (parsed && parsed.DATABASE_URL) {
  process.env.DATABASE_URL = parsed.DATABASE_URL;
}
