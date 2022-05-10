const express = require("express");
const bodyParser = require("body-parser");

const placesRoute = require("./routes/places-routes.js");

const app = express();

// forwards to this route if it starts with /api/places
app.use("/api/places", placesRoute); // => /api/places/... <= filter

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
