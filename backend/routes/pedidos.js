const express = require("express");
const router = express.Router();
const pedidoController = require("../controllers/pedidoController");

router.get("/disponiveis", pedidoController.getPedidosDisponiveis);
router.post("/:id/aceitar", pedidoController.aceitarPedido);
router.post("/:id/rejeitar", pedidoController.rejeitarPedido);

module.exports = router;
