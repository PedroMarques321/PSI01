const express = require('express');
const router = express.Router();

// Require controller modules.
const driverController = require('../controllers/driverController');

/// MOTORISTA ROUTES ///

// POST request to create a motorista
router.post('/', driverController.driverCreate);