const express = require("express");
const router = express.Router();

// Require controller modules.
const herocontroller = require("../controllers/heroController");

// GET request for a specific hero
router.get("/:id", herocontroller.heroGetId);

// DELETE request for a specific hero
router.delete("/:id", herocontroller.hero_delete);

// POST request to create a hero
router.post("/", herocontroller.hero_create_post);

// PUT request to create a hero
router.put("/:id", herocontroller.heroPut);

module.exports = router;