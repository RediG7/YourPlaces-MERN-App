const express = require("express");

// Alternative IMPORT(depends on export)
// const placesControllers = require("../controllers/places-controllers");
const {
  getPlaceById,
  getPlaceByUserId,
  createPlace,
  updatePlace,
  deletePlace,
} = require("../controllers/places-controllers");

const router = express.Router();

// THE ORDER OF ROUTES MATTERS

router.get("/:pid", getPlaceById);

router.get("/user/:uid", getPlaceByUserId);

router.post("/", createPlace);

router.patch("/:pid", updatePlace);

router.delete("/:pid", deletePlace);

module.exports = router;
