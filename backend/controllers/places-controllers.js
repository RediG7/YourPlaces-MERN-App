const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");

let DUMMY_PLACES = [
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

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;

  const places = DUMMY_PLACES.filter((p) => {
    return p.creator === userId;
  });

  if (!places || places.length === 0) {
    // asynchronous code: (must use next(error))
    return next(
      new HttpError(
        "Could not find places for the provided user id: " + userId,
        404
      )
    );
  }

  res.json({ places });
};

const createPlace = async (req, res, next) => {
  // look into this request object and see if there are any validation errors based on the check() setup, returns an object (errors object)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  // We expect these fields on the incoming request
  const { title, description, address, creator } = req.body;
  // Same as:
  // const title = req.body.title

  let coordinates;

  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

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

const updatePlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
    throw new HttpError(`Could not find a place for that id: ${placeId}.`, 404);
  }
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);

  res.status(200).json({ message: "Deleted place." });
};

module.exports = {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
};
// Alternative EXPORT
// exports.getPlaceById = getPlaceById;
// exports.getPlaceByUserId = getPlaceByUserId;
