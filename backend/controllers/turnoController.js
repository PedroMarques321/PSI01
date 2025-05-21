const mongoose = require('mongoose');
const Turno = require('../models/turno');
const Motorista = require('../models/motorista');  // Modelo Motorista
const Taxi = require('../models/taxi');  // Modelo Taxi
const asyncHandler = require('express-async-handler');

// Handle Turnos GET (exemplo de listagem, caso necessário)
exports.turnosGetAll = asyncHandler(async function(req, res, next) {
    console.log("turnoController(turnosGetAll): Fetching all turnos");

    const turnos = await Turno.find().populate('motorista').populate('taxi');

    if (turnos.length === 0) {
        res.status(404);
        throw new Error("turnoController(turnoList): No turnos found");
    }

    res.json(turnos);
});

// Create Turno
exports.turnoCreate = asyncHandler(async function(req, res, next) {
    console.log("turnoController(turnoCreate): Creating new turno");

    // Recebe o corpo da requisição (turno em formato JSON)
    const { dataInicio, dataFim, motorista, taxi } = req.body;

    const motoristaId = motorista?._id;  // ID do motorista
    const taxiId = taxi?._id;  // ID do taxi
    
    // Verifica se o _id do motorista e a matricula do taxi são válidos
    // Busca o motorista pelo _id e o taxi pela matricula
    const motoristaEncontrado = await Motorista.findById(motoristaId);
    const taxiEncontrado = await Taxi.findById(taxiId);

    console.log("req.body:", motoristaId);
    console.log("req.body:", taxiId);

    console.log("Motorista encontrado:", motoristaEncontrado);
    console.log("Taxi encontrado:", taxiEncontrado);
    console.log("Dados do turno:", req.body);

    if (!motoristaEncontrado || !taxiEncontrado) {
        res.status(400);
        throw new Error("turnoController(turnoCreate): Invalid motorista or taxi - not found");
    }

    // Criação do novo objeto Turno
    const novoTurno = new Turno({
        _id: new mongoose.Types.ObjectId(),  // Criação de um ObjectId
        dataInicio,
        dataFim,
        motorista: motoristaEncontrado,  // Usando o ID do motorista encontrado
        taxi: taxiEncontrado  // Usando o ID do taxi encontrado
    });

    // Salva o novo turno na base de dados
    try {
        await novoTurno.save();
        console.log("Turno criado com sucesso!");

        // Responde com o turno criado
        res.status(201).json(novoTurno);
    } catch (error) {
        console.error("Erro ao criar o turno:", error);
        res.status(500).json({ message: "Erro ao criar o turno", error: error.message });
    }
});

exports.turnoUpdateFim = asyncHandler(async (req, res) => {
  const turno = await Turno.findById(req.params.id);
  if (!turno) {
    res.status(404);
    throw new Error("Turno não encontrado");
  }

  turno.dataFim = req.body.dataFim ? new Date(req.body.dataFim) : new Date();
  await turno.save();

  res.json({ message: "Turno atualizado com sucesso", turno });
});
