const price = require('../models/price');
const Price = require('../models/price');
const asyncHandler = require('express-async-handler');

exports.index = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Site Home Page");
});

// GET actual prices
exports.pricesGetAll = asyncHandler(async (req, res, next) => {
    console.log("priceController(pricesList): Fetching all prices");

    const prices = await Price.find();

    if(prices.length === 0) {
        res.status(404);
        throw new Error("priceController(pricesList): No prices found");
    }
    res.json(prices);
});

// PUT update prices
exports.pricesPut = asyncHandler(async (req, res, next) => {
    console.log("priceController(pricesPut): Updating prices");

    const prices = await Price.findOne();

    if(prices === null) {
        res.status(404);
        throw new Error("priceController(pricesPut): No prices found");
    }

    const { taxa_normal, taxa_luxo, acrescimo_noturno } = req.body;

    prices.taxa_normal = taxa_normal;
    prices.taxa_luxo = taxa_luxo;
    prices.acrescimo_noturno = acrescimo_noturno;

    try {
        await prices.save();
        console.log(`Updated prices: ${prices.taxa_normal} ${prices.taxa_luxo} ${prices.acrescimo_noturno}`);
        res.json(prices);
    } catch (error) {
        res.status(500);
        throw new Error("priceController(pricesPut): Failed to update prices");
    }
});