const Pet = require('../models/pet');
const asyncHandler = require('express-async-handler');


exports.index = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Site Home Page");
});

// Handle Pets GET
exports.petsGetAll = asyncHandler(async function(req, res, next) {

    console.log("petController(petList): Fetching all pets");

    const pets = await Pet.find();

    if(pets.length === 0) {
        res.status(404);
        throw new Error("petController(petList): No pets found");
    }
    res.json(pets);
});

// Handle Pet GET
exports.petGetId= asyncHandler(async function(req, res, next) {
    
    const petId = req.params.id;
    const pet = await Pet.findById(petId);

    if(pet === null) {
        res.status(404);
        throw new Error("petController(petDetail): Pet not found");
    }
    res.json(pet);
});