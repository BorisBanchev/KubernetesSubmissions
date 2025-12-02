const express = require("express");
// const fs = require("fs");
// const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;
// const COUNTS_FILE = "/usr/src/app/data/pingpong-counts.txt";
let pingCount = 0;
// try {
//   fs.mkdirSync(path.dirname(COUNTS_FILE), { recursive: true });
// } catch (e) {
//   // ignore
// }

app.get("/pingpong", (request, response) => {
  // fs.readFile(COUNTS_FILE, "utf8", (rErr, data) => {
  //   let current = 0;
  //   if (!rErr && data) current = parseInt(data, 10) || 0;
  //   const next = current + 1;
  //   pingCount += 1;
  //   fs.writeFile(COUNTS_FILE, String(next), "utf8", (wErr) => {
  //     if (wErr) console.error("Failed to write count:", wErr);
  //     response.send(`pong ${next}`);
  //   });
  // });
  pingCount += 1;
  response.send(`pong ${pingCount}`);
});

app.get("/pings", (req, res) => {
  res.send(pingCount);
});

app.listen(port, () => {
  console.log(`Server started in port ${port}`);
});
