const express = require('express');
const router = express.Router();

// Require controller modules.
const taxiController = require('../controllers/taxiController');

/// TAXIS ROUTES ///

// GET request for list of all taxis.
router.get('/', taxiController.taxisGetAll);

module.exports = router;