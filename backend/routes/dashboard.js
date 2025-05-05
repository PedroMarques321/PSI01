const express = require("express");
const router = express.Router();

const taxicontroller = require("../controllers/taxiController");

//Taxi endpoints
router.get("/taxis", taxicontroller.taxisGetAll);
router.post("/taxi", taxicontroller.taxiCreate);

const drivercontroller = require("../controllers/driverController");

//Driver endpoints
router.get("/drivers", drivercontroller.driverGetAll);
router.post("/driver", drivercontroller.driverCreate);

const pricecontroller = require("../controllers/priceController");

//Price endpoints
router.get("/prices", pricecontroller.pricesGetAll);
router.put("/prices", pricecontroller.pricesPut);

const turnocontroller = require("../controllers/turnoController");

// Turno endpoints
router.get("/turnos", turnocontroller.turnosGetAll); // Listar todos os turnos
router.post("/turno", turnocontroller.turnoCreate); // Criar novo turno

module.exports = router;
