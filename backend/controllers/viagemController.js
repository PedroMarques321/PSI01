const Viagem = require('../models/viagem');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

// Handle Viagens GET
exports.viagensGetAll = asyncHandler(async function(req, res, next) {
    console.log("viagemController(viagensGetAll): Fetching all viagens");

    const viagens = await Viagem.find();

    if (viagens.length === 0) {
        res.status(404);
        throw new Error("viagemController(viagensGetAll): No viagens found");
    }

    res.json(viagens);
});

// Handle Viagem GET by ID
exports.viagemGetById = asyncHandler(async function(req, res, next) {
    console.log("viagemController(viagemGetById): Fetching viagem by ID");
    const viagem = await Viagem.findById(req.params.id);

    if (!viagem) {
        res.status(404);
        throw new Error("viagemController(viagemGetById): Viagem not found");
    }

    res.json(viagem);
});

// Handle Viagem POST
exports.viagemCreate = asyncHandler(async function(req, res, next) {
    console.log("viagemController(viagemCreate): Criando nova viagem");

    // Obter a última sequência para incrementar
    const ultimaViagem = await Viagem.findOne().sort({ sequencia: -1 });
    const novaSequencia = ultimaViagem ? ultimaViagem.sequencia + 1 : 1;

    // Recebe o corpo da requisição que deve ser um objeto viagem em formato JSON
    const {
        numeroPessoas,
        clienteID,
        data,
        horaPartida,
        horaChegadaEstimada,
        quilometros,
        moradaPartida,
        moradaChegada,
        preco,
        tipoServico
    } = req.body;

    // Criar nova viagem
    const novaViagem = new Viagem({
        _id: new mongoose.Types.ObjectId(),
        sequencia: novaSequencia,
        numeroPessoas,
        clienteID,
        data,
        horaPartida,
        horaChegadaEstimada,
        quilometros,
        moradaPartida,
        moradaChegada,
        preco,
        tipoServico,
        estado: 'PENDENTE' // Estado padrão para novas viagens
    });

    try {
        await novaViagem.save();
        console.log("Viagem criada com sucesso!");
        res.status(201).json(novaViagem);
    } catch (error) {
        console.error("Erro ao criar viagem:", error);
        res.status(500).json({ message: "Erro ao criar viagem", error: error.message });
    }
});

// Atualizar estado da viagem para ACEITE
exports.viagemAceitar = asyncHandler(async function(req, res, next) {
    console.log("viagemController(viagemAceitar): A aceitar viagem");
    const viagem = await Viagem.findById(req.params.id);
    viagem.estado = 'ACEITE';
    await viagem.save();
    res.json(viagem);
});

// Atualizar estado da viagem para REJEITADO
exports.viagemRejeitar = asyncHandler(async function(req, res, next) {
    console.log("viagemController(viagemRejeitar): Rejeitar viagem");
    const viagem = await Viagem.findById(req.params.id);
    viagem.estado = 'REJEITADO';
    await viagem.save();
    res.json(viagem);
});

// Atualizar estado da viagem para CANCELADO
exports.viagemCancelar = asyncHandler(async function(req, res, next) {
    console.log("viagemController(viagemCancelar): Cancelar viagem");
    const viagem = await Viagem.findById(req.params.id);
    viagem.estado = 'CANCELADO';
    await viagem.save();
    res.json(viagem);
});

// Atualizar estado da viagem para CONCLUIDO
exports.viagemConcluir = asyncHandler(async function(req, res, next) {
    console.log("viagemController(viagemConcluir): Concluir viagem");
    const viagem = await Viagem.findById(req.params.id);
    viagem.estado = 'CONCLUIDO';
    await viagem.save();
    res.json(viagem);
});

// Atualizar estado da viagem para PENDENTE
exports.viagemPendente = asyncHandler(async function(req, res, next) {
    console.log("viagemController(viagemPendente): Pendente viagem");
    const viagem = await Viagem.findById(req.params.id);
    viagem.estado = 'PENDENTE';
    await viagem.save();
    res.json(viagem);
});