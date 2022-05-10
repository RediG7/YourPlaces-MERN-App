const express = require("express");
const bodyParser = require("body-parser");

const placesRoute = require("./routes/places-routes.js");

const app = express();

// forwards to this route if it starts with /api/places
app.use("/api/places", placesRoute); // => /api/places/... <= filter

app.listen(5000);
