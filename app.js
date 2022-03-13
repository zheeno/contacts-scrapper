require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const _ = require("lodash");
const routes = require("./api/routes");

// logger
app.use(morgan("dev"));

// body parser to parse data sent to the endpoints
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// add headers to allow CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "PUT",
      "POST",
      "PATCH",
      "DELETE",
      "GET"
    );
    return res.status(200).json({});
  }
  next();
});

// routes
const base_path = "/api/v1";
routes.map((route) => {
  app.use(route.path, route.handler);
});

// request handler for invalid routes
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});
// invalid request handler ends her

module.exports = app;
