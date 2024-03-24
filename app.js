const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use((req, res, next) => {
  req.user = {
    _id: "65ff8920db6a3d0ff24ed64c",
  };
  next();
});

app.use(express.json()); // middleware to parse body
app.use(mainRouter);

app.listen(PORT);
