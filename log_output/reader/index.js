const express = require("express");
const router = express.Router();
const fs = require("node:fs");
require("dotenv").config();

const app = express();
app.use("/randomstrings", router);
const port = process.env.PORT;

const FILE_PATH = "/usr/src/app/data/strings.txt";

router.get("/strings", (req, res) => {
  fs.readFile(FILE_PATH, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
    } else {
      res.send(data);
    }
  });
});

app.listen(port, () => {
  console.log(`Reader server started on port ${port}`);
});
