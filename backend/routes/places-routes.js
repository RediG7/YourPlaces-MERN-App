const express = require("express");

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
    const error = new Error("Could not find a place with id: " + placeId);
    error.code = 404; // dynamically adding property
    throw error;

    // old error handling way
    // return res
    //   .status(404)
    //   .json({ message: "Place with id: " + placeId + "  Not Found" });
  }

  // JS automatically expands this,
  // if the name of the property is equal to the name of the variable that holds the value you want to store in the property you can shorten it.
  res.json({ place }); // => { place } => { place: place } ...
});

router.get("/user/:uid", (req, res, next) => {
  const userId = req.params.uid;

  const place = DUMMY_PLACES.find((p) => {
    return p.creator === userId;
  });

  if (!place) {
    // asynchronous code: (must use next(error))
    const error = new Error(
      "Could not find a place for the provided user id: " + userId
    );
    error.code = 404; // dynamically adding property
    return next(error);

    // old error handling way
    // return res.status(404).json({
    //   message: `Could not find a place for the provided user id -> ${userId}`,
    // });
  }

  res.json({ place });
});

module.exports = router;
