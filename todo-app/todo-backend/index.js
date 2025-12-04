const express = require("express");
require("dotenv").config();

const uuid = require("uuid");
const PORT = process.env.PORT;
const app = express();
app.use(express.json());
const todos = [];

const generateNewId = () => {
  return uuid.v4();
};

app.get("/todos", (req, res) => {
  res.json(todos);
});

app.post("/todos", (req, res) => {
  const { name } = req.body;
  const newTodo = {
    id: generateNewId(),
    name: name,
  };
  todos.push(newTodo);
  return res.status(201).json(newTodo);
});

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});
