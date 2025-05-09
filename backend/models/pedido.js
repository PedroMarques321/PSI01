const mongoose = require("mongoose");

const PedidoSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pessoa",
    required: true
  },
  coordenadas_origem: {
    lat: Number,
    lng: Number
  },
  coordenadas_destino: {
    lat: Number,
    lng: Number
  },
  numero_pessoas: {
    type: Number,
    required: true
  },
  estado: {
    type: String,
    enum: ["pendente", "aceite", "rejeitado", "concluido"],
    default: "pendente"
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Pedido", PedidoSchema);
