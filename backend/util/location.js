const axios = require("axios");

const HttpError = require("../models/http-error");

const API_KEY = "zun55siuUqz4fxvm0KfOAXHGqxtQd9bn";

async function getCoordsForAddress(address) {
  const response =
    await axios.get(`https://api.tomtom.com/search/2/geocode/${encodeURIComponent(
      address
    )}.json?storeResult=false&view=Unified&key=${API_KEY}
  `);

  const data = response.data;

  if (!data || data.summary.numResults === 0) {
    const error = new HttpError(
      "Could not find location for the specified address.",
      422
    );
    throw error;
  }

  const coordinates = data.results[0].position;
  console.log(coordinates);

  return coordinates;
}

module.exports = getCoordsForAddress;
