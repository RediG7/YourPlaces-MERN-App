const express = require("express");
const { check } = require("express-validator");
// Alternative IMPORT(depends on export)
// const placesControllers = require("../controllers/places-controllers");
const {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
} = require("../controllers/places-controllers");

const router = express.Router();

// THE ORDER OF ROUTES MATTERS

router.get("/:pid", getPlaceById);

router.get("/user/:uid", getPlacesByUserId);

// Multiple Middlewares on same HTTP Method Path Combination
// Executed from left to right
// Name of the field in the form body we want to check
router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  createPlace
);

router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  updatePlace
);

router.delete("/:pid", deletePlace);

module.exports = router;
