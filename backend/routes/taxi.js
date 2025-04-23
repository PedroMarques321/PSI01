const express = require('express');
const router = express.Router();

// Require controller modules.
const taxiController = require('../controllers/taxiController');

/// TAXI ROUTES ///

// POST request to create a taxi
router.post('/', taxiController.taxiCreate);

module.exports = router;