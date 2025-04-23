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