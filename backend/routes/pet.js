const express = require("express");
const router = express.Router();

// Require controller modules.
const petcontroller = require("../controllers/petController");

// GET request for a specific pet
router.get("/:id", petcontroller.petGetId);

module.exports = router;