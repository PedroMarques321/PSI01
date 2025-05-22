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

// Handle Taxi POST
exports.taxiCreate = asyncHandler(async function(req, res, next) {
    console.log("taxiController(taxiCreate): Creating new taxi");

    // Recebe o corpo da requisição que deve ser um objeto taxi em formato JSON
    const { modelo, marca, conforto, matricula, ano_de_compra, lugares } = req.body;

    // Criação de um novo objeto Taxi
    const novoTaxi = new Taxi({
        _id: new mongoose.Types.ObjectId(),  // Criação de um ObjectId
        modelo,
        marca,
        conforto,
        matricula,
        ano_de_compra,
        lugares
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

// Handle Taxi PUT - Requesitar um táxi
exports.taxiRequesitar = asyncHandler(async function(req, res, next) {
    const taxiId = req.params.id;
    console.log(`taxiController(taxiRequesitar): Requesitar táxi com ID ${taxiId}`);

    if (!mongoose.Types.ObjectId.isValid(taxiId)) {
        res.status(400);
        throw new Error("ID de táxi inválido");
    }

    // Atualiza o campo 'requesitado' para true
    const taxiAtualizado = await Taxi.findByIdAndUpdate(
        taxiId,
        { requesitado: true },
        { new: true } // para retornar o objeto atualizado
    );

    if (!taxiAtualizado) {
        res.status(404);
        throw new Error("Táxi não encontrado");
    }

    console.log("Táxi requesitado com sucesso!");
    res.status(200).json(taxiAtualizado);
});

// Handle Taxi PUT - Marcar táxi como "usado"
exports.taxiUsar = asyncHandler(async function(req, res, next) {
    const taxiId = req.params.id;
    console.log(`taxiController(taxiUsar): Marcar táxi como usado - ID ${taxiId}`);

    if (!mongoose.Types.ObjectId.isValid(taxiId)) {
        res.status(400);
        throw new Error("ID de táxi inválido");
    }

    // Atualiza o campo 'usado' para true
    const taxiAtualizado = await Taxi.findByIdAndUpdate(
        taxiId,
        { usado: true },
        { new: true } // para retornar o objeto atualizado
    );

    if (!taxiAtualizado) {
        res.status(404);
        throw new Error("Táxi não encontrado");
    }

    console.log("Táxi marcado como usado com sucesso!");
    res.status(200).json(taxiAtualizado);
});

// Handle Taxi DELETE - Remover táxi pelo ID
exports.taxiRemover = asyncHandler(async function(req, res, next) {
    const taxiId = req.params.id;
    console.log(`taxiController(taxiRemover): Remover táxi com ID ${taxiId}`);

    if (!mongoose.Types.ObjectId.isValid(taxiId)) {
        res.status(400);
        throw new Error("ID de táxi inválido");
    }

    const taxiRemovido = await Taxi.findByIdAndDelete(taxiId);

    if (!taxiRemovido) {
        res.status(404);
        throw new Error("Táxi não encontrado para remoção");
    }

    console.log("Táxi removido com sucesso!");
    res.status(200).json({ message: "Táxi removido com sucesso", id: taxiRemovido._id });
});

// Handle Taxi PUT - Atualizar táxi completo
exports.taxiUpdate = asyncHandler(async function (req, res, next) {
    const taxiId = req.params.id;
    console.log(`taxiController(taxiUpdate): Atualizar táxi com ID ${taxiId}`);

    if (!mongoose.Types.ObjectId.isValid(taxiId)) {
        res.status(400);
        throw new Error("ID de táxi inválido");
    }

    const dadosAtualizados = req.body;

    const taxiAtualizado = await Taxi.findByIdAndUpdate(
        taxiId,
        dadosAtualizados,
        { new: true }
    );

    if (!taxiAtualizado) {
        res.status(404);
        throw new Error("Táxi não encontrado para atualização");
    }

    console.log("Táxi atualizado com sucesso!");
    res.status(200).json(taxiAtualizado);
});
