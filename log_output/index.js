const express = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT;

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const generateString = () => {
  let result = " ";
  const charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  const timestamp = new Date().toISOString();
  console.log(timestamp);
  console.log(result);

  setTimeout(generateString, 5000);
};

generateString();

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
