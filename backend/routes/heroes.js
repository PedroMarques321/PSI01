const express = require("express");
const router = express.Router();

// Require controller modules.
const herocontroller = require("../controllers/heroController");

/// HERO ROUTES ///

// GET request for list of all heros.
router.get("/", herocontroller.heroesGetAll);

// GET request for one hero.
//router.get("/:id", herocontroller.heroGetId);

//router.post("/new", herocontroller.newHero);

module.exports = router;