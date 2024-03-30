const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");

const app = express();

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to WTWR DB");
  })
  .catch(console.error);

app.use(express.json()); // middleware to parse body
app.use(cors());
app.use(mainRouter);

app.listen(PORT);
