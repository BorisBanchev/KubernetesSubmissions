const express = require("express");
const router = express.Router();
const fs = require("node:fs");
const path = require("node:path");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use("/randomstrings", router);
const port = process.env.PORT;
const PING_SERVICE_URL = "http://pingpong-svc:2345/pings";
const CONFIG_DIR = process.env.CONFIG_DIR || "/usr/src/app/configdata";
const INFO_FILE = path.join(CONFIG_DIR, "information.txt");

// const FILE_PATH = "/usr/src/app/data/strings.txt";
// const PING_FILE = "/usr/src/app/data/pingpong-counts.txt";

// const writeContentToFile = (file, content) => {
//   fs.writeFile(file, content, { flag: "a+" }, (err) => {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log("String added successfully to the file");
//     }
//   });
// };

// const ensureFileExists = (file, cb) => {
//   const dir = path.dirname(file);
//   fs.mkdir(dir, { recursive: true }, (mkErr) => {
//     if (mkErr) return cb(mkErr);
//     // open with flag 'a' to create the file if missing, then close
//     fs.open(file, "a", (opErr, fd) => {
//       if (opErr) return cb(opErr);
//       fs.close(fd, (clErr) => cb(clErr));
//     });
//   });
// };

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const generateString = () => {
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  const timestamp = new Date().toISOString();
  console.log(timestamp);
  console.log(result);

  const content = `String:${result}, created at: ${timestamp}\n`;
  // writeContentToFile(FILE_PATH, content);

  setTimeout(generateString, 5000);
};

// ensureFileExists(FILE_PATH, (err) => {
//   if (err) {
//     console.error("Failed to ensure file exists:", err);
//     // still attempt to start generator (appendFile will try to create later)
//     generateString();
//   } else {
//     console.log("File ready:", FILE_PATH);
//     generateString();
//   }
// });

const getPingPongCount = async () => {
  try {
    const response = await axios.get(PING_SERVICE_URL);
    const count = response.data;
    if (typeof count === "number") return count;
  } catch (err) {
    console.error("Failed to fetch ping count:", err);
  }
};

const generateStringAndTimestamp = () => {
  let result = " ";
  const charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  const timestamp = new Date().toISOString();
  const timestampAndString = `String:${result}, created at: ${timestamp}`;
  return timestampAndString;
};

router.get("/", async (request, response) => {
  try {
    let infoContent = "";
    try {
      infoContent = await fs.promises.readFile(INFO_FILE, "utf8");
    } catch (e) {}

    const message = process.env.MESSAGE || "";

    const pingCount = await getPingPongCount();
    const timestampAndString = generateStringAndTimestamp();
    response.type("text/plain");
    response.send(
      `${timestampAndString}\nPing / Pongs:${pingCount}\nfile content: ${infoContent}\nenv variable: MESSAGE=${message}`
    );
  } catch (err) {
    response.status(500).send("Error reading ping count");
  }
});

app.listen(port, () => {
  console.log(`Server started in port ${port}`);
});
