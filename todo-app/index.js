const express = require("express");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { pipeline } = require("stream/promises");
require("dotenv").config();

const app = express();
app.use(express.json());
const port = process.env.PORT;
const CACHE_DIR = "/usr/src/app/data";
const IMAGE_PATH = path.join(CACHE_DIR, "image.jpg");
const TTL_MS = 10 * 60 * 1000; // 10 minutes
const BACKEND_URL = "http://todo-backend-svc:3003";

// ensuring cache dir exists
const ensureCacheDir = async () => {
  await fs.promises.mkdir(CACHE_DIR, { recursive: true });
};

// check if image is fresh
const isImageFresh = async (filePath, ttlMs) => {
  try {
    const st = await fs.promises.stat(filePath);
    const age = Date.now() - st.mtimeMs;
    return { exists: true, age };
  } catch (e) {
    return { exists: false, age: Infinity };
  }
};

// download image and write it
const downloadImage = async (url, dest) => {
  await ensureCacheDir();
  const tmp = dest + ".tmp";
  const res = await axios.get(url, { responseType: "stream" });

  await pipeline(res.data, fs.createWriteStream(tmp));
  await fs.promises.rename(tmp, dest);
  console.log("Image saved to", dest);
};

let backgroundRefreshInProgress = false;
const ensureImageAvailable = async () => {
  await ensureCacheDir();
  const { exists, age } = await isImageFresh(IMAGE_PATH, TTL_MS);

  if (!exists) {
    await downloadImage("https://picsum.photos/1200", IMAGE_PATH);
    return;
  }

  if (age < TTL_MS) {
    return;
  }

  if (age < 2 * TTL_MS) {
    if (!backgroundRefreshInProgress) {
      backgroundRefreshInProgress = true;
      downloadImage("https://picsum.photos/1200", IMAGE_PATH)
        .catch((err) => console.error("Background refresh failed:", err))
        .finally(() => {
          backgroundRefreshInProgress = false;
        });
    }
    return;
  }

  await downloadImage("https://picsum.photos/1200", IMAGE_PATH);
};

app.get("/api/todos", async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/todos`);
    let todos = response.data;
    if (typeof todos === "string") {
      try {
        todos = JSON.parse(todos);
      } catch (e) {
        todos = [];
      }
    }
    return res.json(Array.isArray(todos) ? todos : []);
  } catch (err) {
    console.error(
      "Failed to fetch todos from backend:",
      err && err.message ? err.message : err
    );
    return res.status(502).json({ error: "Failed to fetch todos" });
  }
});

app.post("/api/todos", async (req, res) => {
  try {
    const resp = await axios.post(`${BACKEND_URL}/todos`, req.body);
    return res.status(resp.status).json(resp.data);
  } catch (err) {
    console.error(
      "Failed to create todo on backend:",
      err && err.message ? err.message : err
    );
    return res.status(502).json({ error: "Failed to create todo" });
  }
});

app.get("/cached-image.jpg", async (req, res) => {
  try {
    await ensureImageAvailable();
    res.type("jpg");
    res.sendFile(IMAGE_PATH);
  } catch (err) {
    console.error("Failed to serve image:", err);
    res.status(500).send("Image unavailable");
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`Server started in port ${port}`);
});
