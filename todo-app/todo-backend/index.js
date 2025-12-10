const express = require("express");
require("dotenv").config();
const { Pool } = require("pg");

const PORT = process.env.PORT;
const app = express();
app.use(express.json());

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
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY NOT NULL,
        name TEXT NOT NULL
      );
    `);

    console.log("initDb: table todos ready.");
  } catch (err) {
    console.error("initDb failed:", err.message || err);
    throw err;
  }
};

app.get("/todos", async (req, res) => {
  if (!pool) {
    return res.status(500).json({ error: "Database not configured" });
  }

  try {
    const { rows } = await pool.query("SELECT id, name FROM todos ORDER BY id");
    return res.json(rows);
  } catch (err) {
    console.error("GET /todos error:", err.message || err);
    return res.status(500).json({ error: "Failed to fetch todos" });
  }
});

app.post("/todos", async (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== "string") {
    return res
      .status(400)
      .json({ error: "Missing or invalid 'name' in request body" });
  }

  if (!pool) {
    return res.status(500).json({ error: "Database not configured" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO todos (name) VALUES ($1) RETURNING id, name",
      [name]
    );
    const newTodo = result.rows[0];
    return res.status(201).json(newTodo);
  } catch (err) {
    console.error("POST /todos error:", err.message || err);
    return res.status(500).json({ error: "Failed to create todo" });
  }
});

app.listen(PORT, async () => {
  console.log(`Server started in port ${PORT}`);
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
