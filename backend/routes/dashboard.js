const express = require("express");
const router = express.Router();

const taxicontroller = require("../controllers/taxiController");

//Taxi endpoints
router.get("/taxis", taxicontroller.taxisGetAll);
router.post("/taxi", taxicontroller.taxiCreate);

const drivercontroller = require("../controllers/driverController");

//Driver endpoints
router.get("/drivers", drivercontroller.driverGetAll);
router.post("/driver", drivercontroller.driverCreate);

const pricecontroller = require("../controllers/priceController");

//Price endpoints
router.get("/prices", pricecontroller.pricesGetAll);
router.put("/prices", pricecontroller.pricesPut);

const viagemcontroller = require("../controllers/viagemController");

// Viagem endpoints
router.get("/viagens", viagemcontroller.viagensGetAll); // Listar todas as viagens
router.get("/viagem/:id", viagemcontroller.viagemGetById); // Obter viagem por ID
router.post("/viagem", viagemcontroller.viagemCreate); // Criar nova viagem
router.put('/viagem/aceitar/:id/:motoristaId/:taxiId/:distCM/:quilometros', (req, res, next) => {
  console.log('Requisição para aceitar viagem recebida');
  next();
}, viagemcontroller.viagemAceitar);
router.put("/viagem/rejeitar/:id", viagemcontroller.viagemRejeitar); // Atualizar viagem existente
router.put("/viagem/cancelar/:id", viagemcontroller.viagemCancelar); // Atualizar viagem existente
router.put("/viagem/concluir/:id", viagemcontroller.viagemConcluir); // Atualizar viagem existente
router.put("/viagem/pendente/:id", viagemcontroller.viagemPendente); // Atualizar viagem existente
router.get("/viagemNif/:nif", viagemcontroller.viagemGetByClienteId); //Obter viagem pelo nif do criador

//router.delete("/viagem/:id", viagemcontroller.viagemDelete); // Excluir viagem existente

const turnocontroller = require("../controllers/turnoController");

// Turno endpoints
router.get("/turnos", turnocontroller.turnosGetAll); // Listar todos os turnos
router.post("/turno", turnocontroller.turnoCreate); // Criar novo turno

module.exports = router;
