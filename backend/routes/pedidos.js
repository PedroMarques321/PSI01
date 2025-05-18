const express = require("express");
const router = express.Router();
const pedidoController = require("../controllers/pedidoController");

// Listar todos os pedidos
router.get("/", async (req, res) => {
  try {
    const pedidos = await require("../models/pedido").find();
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/disponiveis", pedidoController.getPedidosDisponiveis);
router.post("/:id/aceitar", pedidoController.aceitarPedido);
router.post("/:id/rejeitar", pedidoController.rejeitarPedido);
router.post('/', pedidoController.criarPedido);

module.exports = router;
