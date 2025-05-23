const Motorista = require('../models/motorista');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');


// Criar motorista (POST /driver)
exports.driverCreate = async (req, res) => {
  try {
    const novoMotorista = new Motorista(req.body);
    const salvo = await novoMotorista.save();
    res.status(201).json(salvo);
  } catch (err) {
    console.error('Erro ao criar motorista:', err);  // Log do erro completo
    res.status(500).json({ erro: "Erro ao criar motorista." });
  }
  };
  
  // Listar todos os motoristas (GET /driver)
  exports.driverGetAll = async (req, res) => {
    try {
      const motoristas = await Motorista.find().sort({ createdAt: -1 });
      res.status(200).json(motoristas);
    } catch (err) {
      res.status(500).json({ erro: "Erro ao buscar motoristas." });
    }
  };

  // Atualizar motorista (PUT /requesitar-driver/:id)
  exports.driverUpdate = asyncHandler(async (req, res) => {
    const motoristaId = req.params.id;

    console.log(`driverController(driverUpdate): Atualizando motorista com ID ${motoristaId}`);

    if (!mongoose.Types.ObjectId.isValid(motoristaId)) {
      res.status(400);
      throw new Error("ID de motorista inválido");
    }

    // Busca e atualiza o motorista com os dados do body
    const motoristaAtualizado = await Motorista.findByIdAndUpdate(
      motoristaId,
      req.body,
      { new: true } // retorna o documento atualizado
    );

    if (!motoristaAtualizado) {
      res.status(404);
      throw new Error("Motorista não encontrado");
    }

    console.log("Motorista atualizado com sucesso!");
    res.status(200).json(motoristaAtualizado);
  });

// Remover motorista
exports.driverRemover = asyncHandler(async (req, res) => {
  const motoristaId = req.params.id;

  console.log(`driverController(driverRemover): Removendo motorista com ID ${motoristaId}`);

  if (!mongoose.Types.ObjectId.isValid(motoristaId)) {
    res.status(400);
    throw new Error("ID de motorista inválido");
  }

  const motorista = await Motorista.findById(motoristaId);

  if (!motorista) {
    res.status(404);
    throw new Error("Motorista não encontrado");
  }

  await motorista.deleteOne();

  console.log("Motorista removido com sucesso!");
  res.status(200).json({ mensagem: "Motorista removido com sucesso." });
});
