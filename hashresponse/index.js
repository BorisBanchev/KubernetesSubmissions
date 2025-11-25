const express = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT;

app.get("/", (request, response) => {
  response.send("Hello from hashresponse application backend");
});

app.listen(port, () => {
  console.log(`Server started in port ${port}`);
});
