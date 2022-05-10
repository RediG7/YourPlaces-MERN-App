const express = require("express");

const HttpError = require("../models/http-error");

const router = express.Router();

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

// THE ORDER OF ROUTES MATTERS

router.get("/:pid", (req, res, next) => {
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
});

router.get("/user/:uid", (req, res, next) => {
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
});

module.exports = router;
