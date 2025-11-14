const express = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server started in port ${port}`);
});
