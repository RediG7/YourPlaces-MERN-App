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
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });

  // JS automatically expands this,
  // if the name of the property is equal to the name of the variable that holds the value you want to store in the property you can shorten it.
  res.json({ place }); // => { place } => { place: place } ...
});

router.get("/user/:uid", (req, res, next) => {
  const userId = req.params.uid;

  const place = DUMMY_PLACES.find((p) => {
    return p.creator === userId;
  });

  res.json({ place });
});

module.exports = router;
