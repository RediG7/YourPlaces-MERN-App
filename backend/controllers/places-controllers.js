const { v4: uuidv4 } = require("uuid");

const HttpError = require("../models/http-error");

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Vollga",
    description: "Vendi katunarve te Durresit",
    location: {
      lat: parseFloat((Math.random() * 100).toFixed(10)),
      lng: parseFloat((Math.random() * 100).toFixed(10)),
    },
    address: "random shit man",
    creator: "u1",
  },
];

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid; // { pid: 'p1'}
  // find returns any or undefined
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });

  // place -> if not found it comes undefined here
  // the opposite of undefined -> is true
  /*  !undefined = true */
  if (!place) {
    // synchronous code: (can use throw error)
    throw new HttpError("Could not find a place with id: " + placeId, 404);
  }

  res.json({ place }); // => { place } => { place: place } ...
};

// Alternatives
// function getPlaceById() { ... }
// const getPlaceById = function() { ... }

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid;

  const place = DUMMY_PLACES.find((p) => {
    return p.creator === userId;
  });

  if (!place) {
    // asynchronous code: (must use next(error))
    return next(
      new HttpError(
        "Could not find a place for the provided user id: " + userId,
        404
      )
    );
  }

  res.json({ place });
};

const createPlace = (req, res, next) => {
  // We expect these fields on the incoming request
  const { title, description, coordinates, address, creator } = req.body;
  // Same as:
  // const title = req.body.title
  const createdPlace = {
    id: uuidv4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace); // unshift(createdPlace) to add it as first element

  res.status(201).json({ place: createdPlace });
};

module.exports = { getPlaceById, getPlaceByUserId, createPlace };
// Alternative EXPORT
// exports.getPlaceById = getPlaceById;
// exports.getPlaceByUserId = getPlaceByUserId;
