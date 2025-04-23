const express = require('express');
const router = express.Router();

// Require controller modules.
const driverController = require('../controllers/driverController');

/// MOTORISTAS ROUTES ///

// GET request for list of all taxis.
router.get('/', driverController.driverGetAll);

module.exports = router;