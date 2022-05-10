const express = require("express");
const bodyParser = require("body-parser");

const placesRoute = require("./routes/places-routes.js");
const HttpError = require("./models/http-error.js");

const app = express();

app.use(bodyParser.json());

// forwards to this route if it starts with /api/places
app.use("/api/places", placesRoute); // => /api/places/... <= filter

// Only runs if we did not send the response into one of our routes before.
app.use((req, res, nex) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

// Middleware function for error handling (express built-in)
// recognized by express as a special middleware function aka error handling middleware function
// executed on requests that have an error attached to it
// this function will execute if any middleware in front of it yields an error
app.use((error, req, res, next) => {
  // Check if a response has already been sent
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

app.listen(5000);

// this function is applied on every incoming request -> app.use((req, res, next) => {});
