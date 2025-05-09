const Pedido = require("../models/pedido");

const calcularDistancia = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

exports.getPedidosDisponiveis = async (req, res) => {
  let { lat, lng } = req.query;
  if (!lat || !lng) {
    lat = 38.756734;
    lng = -9.155412;
  }

  try {
    const pedidos = await Pedido.find({ estado: "pendente" });

    const pedidosComDistancia = pedidos.map(p => {
      const d = calcularDistancia(lat, lng, p.coordenadas_origem.lat, p.coordenadas_origem.lng);
      return { ...p.toObject(), distancia_km: d };
    });

    pedidosComDistancia.sort((a, b) => a.distancia_km - b.distancia_km);

    res.json(pedidosComDistancia);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.aceitarPedido = async (req, res) => {
  try {
    await Pedido.findByIdAndUpdate(req.params.id, { estado: "aceite" });
    res.json({ message: "Pedido aceite" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.rejeitarPedido = async (req, res) => {
  try {
    await Pedido.findByIdAndUpdate(req.params.id, { estado: "rejeitado" });
    res.json({ message: "Pedido rejeitado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
