const Taxi = require('../models/taxi');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

// Handle Taxis GET
exports.taxisGetAll = asyncHandler(async function(req, res, next) {
    console.log("taxiController(taxisGetAll): Fetching all taxis");

    const taxis = await Taxi.find();

    if (taxis.length === 0) {
        res.status(404);
        throw new Error("taxiController(taxiList): No taxis found");
    }

    res.json(taxis);
});

exports.taxiCreate = asyncHandler(async function(req, res, next) {
    console.log("taxiController(taxiCreate): Creating new taxi");

    // Recebe o corpo da requisição que deve ser um objeto taxi em formato JSON
    const { modelo, marca, conforto, matricula, ano_de_compra } = req.body;

    // Criação de um novo objeto Taxi
    const novoTaxi = new Taxi({
        _id: new mongoose.Types.ObjectId(),  // Criação de um ObjectId
        modelo,
        marca,
        conforto,
        matricula,
        ano_de_compra
    });

    // Salva o novo taxi na base de dados
    try {
        await novoTaxi.save();
        console.log("Taxi criado com sucesso!");

        // Responde com o taxi criado
        res.status(201).json(novoTaxi);
    } catch (error) {
        console.error("Erro ao criar o taxi:", error);
        res.status(500).json({ message: "Erro ao criar o taxi", error: error.message });
    }
});
