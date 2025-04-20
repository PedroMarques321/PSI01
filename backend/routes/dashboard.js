const express = require("express");
const router = express.Router();

// Require controller modules.
const herocontroller = require("../controllers/heroController");

// Hero endpoints
router.get("/heroes", herocontroller.heroesGetAll);
router.get("/hero/:id", herocontroller.heroGetId);
router.post("/hero", herocontroller.hero_create_post);
router.delete("/hero/:id", herocontroller.hero_delete);
router.put("/hero/:id", herocontroller.heroPut);

const petcontroller = require("../controllers/petController");

// Pet endpoints
router.get("/pets", petcontroller.petsGetAll);
router.get("/pet/:id", petcontroller.petGetId);

const taxicontroller = require("../controllers/taxiController");

//Taxi endpoints
router.get("/taxis", taxicontroller.taxisGetAll);
router.post("/taxi", taxicontroller.taxiCreate);

module.exports = router;