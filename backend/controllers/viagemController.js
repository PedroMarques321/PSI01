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

// Handle Viagem GET by clienteID (NIF)
exports.viagemGetByClienteId = asyncHandler(async function(req, res, next) {
    const clienteNif = req.params.nif; // ou req.query.nif, dependendo da rota

    console.log("viagemController(viagemGetByClienteId): Buscando viagem por clienteID (NIF):", clienteNif);

    const viagem = await Viagem.findOne({ clienteID: clienteNif }).sort({ data: 1 }); // Retorna a mais antiga

    if (!viagem) {
        res.status(404);
        throw new Error("viagemController(viagemGetByClienteId): Nenhuma viagem encontrada para esse clienteID");
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

exports.viagemAceitar = asyncHandler(async function(req, res, next) {
    console.log("viagemController(viagemAceitar): A aceitar viagem");

    const viagemId = req.params.id;  // ID da viagem recebido pela URL
    const motoristaId = req.params.motoristaId;  // Motorista ID recebido pela URL
    const taxiId = req.params.taxiId;  // Taxi ID recebido pela URL
    const distCM = req.params.distCM;
    const quilometros = req.params.quilometros;

    // Verificar se os parâmetros motoristaId e taxiId foram fornecidos
    if (!motoristaId || !taxiId) {
        return res.status(400).json({ message: "Motorista ID e Taxi ID são obrigatórios." });
    }

    // Encontrar a viagem no banco de dados usando o ID fornecido
    const viagem = await Viagem.findById(viagemId);
    if (!viagem) {
        return res.status(404).json({ message: "Viagem não encontrada." });
    }

    // Atualizar a viagem com os dados recebidos
    viagem.estado = 'ACEITE';
    viagem.condutorID = motoristaId;  // Atualiza o campo condutorID
    viagem.taxiID = taxiId;  // Atualiza o campo taxiID
    viagem.distClienteMotorista = distCM;
    viagem.quilometros = quilometros;

    // Salvar a viagem no banco de dados
    await viagem.save();

    // Retornar a viagem atualizada como resposta
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