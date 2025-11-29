const express = require("express");
const fs = require("node:fs");
const path = require("node:path");
require("dotenv").config();

const app = express();
const port = process.env.PORT;
const FILE_PATH = "/usr/src/app/data/strings.txt";

const writeContentToFile = (file, content) => {
  fs.writeFile(file, content, { flag: "a+" }, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("String added successfully to the file");
    }
  });
};

const ensureFileExists = (file, cb) => {
  const dir = path.dirname(file);
  fs.mkdir(dir, { recursive: true }, (mkErr) => {
    if (mkErr) return cb(mkErr);
    // open with flag 'a' to create the file if missing, then close
    fs.open(file, "a", (opErr, fd) => {
      if (opErr) return cb(opErr);
      fs.close(fd, (clErr) => cb(clErr));
    });
  });
};

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
  writeContentToFile(FILE_PATH, content);

  setTimeout(generateString, 5000);
};

ensureFileExists(FILE_PATH, (err) => {
  if (err) {
    console.error("Failed to ensure file exists:", err);
    // still attempt to start generator (appendFile will try to create later)
    generateString();
  } else {
    console.log("File ready:", FILE_PATH);
    generateString();
  }
});

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

app.get("/", (request, response) => {
  response.send(generateStringAndTimestamp());
});

app.listen(port, () => {
  console.log(`Server started in port ${port}`);
});
