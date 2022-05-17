const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");
const user = require("../models/user");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid; // { pid: 'p1'}
  // find returns any or undefined
  // const place = DUMMY_PLACES.find((p) => {
  //   return p.id === placeId;
  // });
  // Doesn't return a promise but by mongoose we can stil use then catch
  // make it a real Promise -> exec()
  // asyncronous
  let place = "";
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(error); // Better error messages
  }

  // place -> if not found it comes undefined here
  // the opposite of undefined -> is true
  /*  !undefined = true */
  if (!place) {
    // synchronous code: (can use throw error)
    const error = new HttpError(
      "Could not find a place with id: " + placeId,
      404
    );
    return next(error);
  }

  // convert to JS more readable object -> place.toObject
  //  _id -> getters: true -> getters are added by mongoose and adds another id property to the created object
  res.json({ place: place.toObject({ getters: true }) }); // => { place } => { place: place } ...
};

// Alternatives
// function getPlaceById() { ... }
// const getPlaceById = function() { ... }

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  // const places = DUMMY_PLACES.filter((p) => {
  //   return p.creator === userId;
  // });

  // let places = "";
  let userWithPlaces;
  try {
    // MongoDB returns cursor, a pointer to the data
    //Unline mongoose, but we could add cursor or exec for cursor(pointer) and exec(Promise)
    userWithPlaces = await User.findById(userId).populate("places");
  } catch (error) {
    return next(error);
  }

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    // asynchronous code: (must use next(error))
    return next(
      new HttpError(
        "Could not find places for the provided user id: " + userId,
        404
      )
    );
  }

  // One Way
  // let [placesObj] = places;

  // res.json({ places: placesObj.toObject({ getters: true }) });

  // Another Way
  res.json({
    places: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
  });
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

  const createdPlace = new Place({
    title,
    description,
    image:
      "data:image/png;base64,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",
    address,
    location: coordinates,
    creator,
  });

  let user;

  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError("Could not find user for provided id!", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id!", 404);
    return next(error);
  }

  try {
    // Changes happens only if successful, otherwise, mongodb rollsback the changes
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace); // push() -> mongoose established a connection between the two models, grabs the places _id and puts it in user collection
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Creating place failed, please try again", 500); // This error message handler lacks information
    return next(err); // the error on the catch block is better
  }

  // DUMMY_PLACES.push(createdPlace); // unshift(createdPlace) to add it as first element

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place = "";
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(error); // Better error messages
  }

  // const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  // const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (error) {
    return next(error);
  }

  // DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  // if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
  //   throw new HttpError(`Could not find a place for that id: ${placeId}.`, 404);
  // }
  // DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);

  let place = "";
  try {
    // populate() -> allows us to refer to a document stored in another collection and to work with data in that existing document of that other collection.
    // To do so we need a relation. We established our relation before. user,places in the models
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500
    );
    return next(error); // Better error messages
  }

  if (!place) {
    const error = new HttpError("Could not find place for this id.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place); // pull will automatically remove the _id
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    return next(error);
  }

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
