const express = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;
const { Pool } = require("pg");
let pingCount = 0;

const pool = new Pool({
  user: process.env.POSTGRES_USERNAME,
  host: process.env.POSTGRES_HOST,
  password: process.env.POSTGRES_PASSWORD,
  database: "postgres",
  port: 5432,
});

const initDb = async () => {
  if (!pool) {
    console.log("DB pool not configured; skipping initDb.");
    return;
  }

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ping_count (
        id INTEGER PRIMARY KEY NOT NULL,
        count INTEGER NOT NULL
      );
    `);

    await pool.query(`
      INSERT INTO ping_count (id, count)
      VALUES (1, 0)
      ON CONFLICT (id) DO NOTHING;
    `);

    console.log("initDb: table ping_count ready and initial row ensured.");
  } catch (err) {
    console.error("initDb failed:", err.message || err);
    throw err;
  }
};

const incrementDbCount = async () => {
  if (!pool) throw new Error("DB not configured");

  try {
    const upd = await pool.query(`
      UPDATE ping_count
      SET count = count + 1
      WHERE id = 1
      RETURNING count;
    `);

    if (upd.rowCount > 0) {
      return Number(upd.rows[0].count);
    }
  } catch (err) {
    console.error("Failed to increment the count in db:", err.message || err);
    throw err;
  }
};

const getDbCount = async () => {
  if (!pool) throw new Error("DB not configured");
  const res = await pool.query(`SELECT count FROM ping_count WHERE id = 1;`);
  if (res.rowCount === 0) return 0;
  return Number(res.rows[0].count);
};

app.get("/pingpong", async (req, res) => {
  if (pool) {
    try {
      const newCount = await incrementDbCount();
      return res.send(`pong ${newCount}`);
    } catch (err) {
      console.error("DB read failed.", err.message || err);
    }
  }
});

app.get("/pings", async (req, res) => {
  if (pool) {
    try {
      const count = await getDbCount();
      return res.send(String(count));
    } catch (err) {
      console.error(
        "DB read failed, falling back to memory:",
        err.message || err
      );
      return res.send(String(pingCount));
    }
  }
  res.send(String(pingCount));
});

app.listen(port, async () => {
  console.log(`Server started in port ${port}`);
  if (pool) {
    try {
      await initDb();
    } catch (err) {
      console.error(
        "initDb error on startup (continuing):",
        err.message || err
      );
    }
  }
});
