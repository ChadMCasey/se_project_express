const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const { errors } = require("celebrate");
const centralizedError = require("./middlewares/centralizedError");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const mainRouter = require("./routes/index");
const limiter = require("./middlewares/rateLimit");
require("dotenv").config(); // draw from info in .env
const app = express();

const { PORT = 3001 } = process.env;

// connecting to the database
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Successfully Connected to WTWR DB...");
  })
  .catch((err) => {
    console.error(`Connection to WTWR database error: ${err.message}`);
  });

// DDos attacks
app.use(limiter);

// security related HTTP headers..
app.use(helmet());

// express middleware to parse request
app.use(express.json());

// Cross-origin resource sharing (CORS)
app.use(cors());

// request logger before routes
app.use(requestLogger);

// route to our central router
app.use(mainRouter);

// error logger after routes
app.use(errorLogger);

// Joi Data Validation Error Handling
app.use(errors());

// Centralized error handling
app.use(centralizedError);

// launch application..
app.listen(PORT);
