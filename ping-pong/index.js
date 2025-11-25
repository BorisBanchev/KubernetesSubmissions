const express = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;
let count = 0;

app.get("/pingpong", (request, response) => {
  response.send(`pong ${count}`);
  count += 1;
});

app.listen(port, () => {
  console.log(`Server started in port ${port}`);
});
