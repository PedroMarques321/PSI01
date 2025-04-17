const express = require("express");
const router = express.Router();

// Require controller modules.
const petcontroller = require("../controllers/petController");

/// PET ROUTES ///

// GET request for list of all heros.
router.get("/", petcontroller.petsGetAll);

// GET request for one hero.
//router.get("/:id", petcontroller.petGetId);

module.exports = router;