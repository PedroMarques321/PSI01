const Pedido = require("../models/pedido");
const Turno = require("../models/turno");

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
  let { lat, lng, motoristaId } = req.query;
  if (!lat || !lng) {
    lat = 38.756734;
    lng = -9.155412;
  }

  try {
    if (!motoristaId) {
      return res.status(400).json({ message: "É necessário fornecer o motoristaId" });
    }

    const turno = await Turno.findOne({ motorista: motoristaId, dataFim: { $ne: null } });
    if (!turno) {
      return res.status(400).json({ message: "Turno não encontrado ou incompleto para o motorista" });
    }

    const pedidos = await Pedido.find({ estado: "pendente" });
    const agora = new Date();
    const fimTurno = new Date(turno.dataFim);

    const pedidosValidos = pedidos.filter(p => {
      const distMotoristaCliente = calcularDistancia(lat, lng, p.coordenadas_origem.lat, p.coordenadas_origem.lng);
      const distClienteDestino = calcularDistancia(p.coordenadas_origem.lat, p.coordenadas_origem.lng, p.coordenadas_destino.lat, p.coordenadas_destino.lng);
      const distanciaTotal = distMotoristaCliente + distClienteDestino;

      const tempoEstimadoMin = distanciaTotal * 4; // 4 minutos por km
      const estimadoFim = new Date(agora.getTime() + tempoEstimadoMin * 60000);

      return estimadoFim <= fimTurno;
    }).map(p => {
      const distancia = calcularDistancia(lat, lng, p.coordenadas_origem.lat, p.coordenadas_origem.lng);
      return { ...p.toObject(), distancia_km: distancia.toFixed(2) };
    });

    pedidosValidos.sort((a, b) => a.distancia_km - b.distancia_km);
    res.json(pedidosValidos);

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
exports.criarPedido = async (req, res) => {
  try {
    const novoPedido = new Pedido(req.body);
    await novoPedido.save();
    res.status(201).json({ message: "Pedido criado com sucesso", pedido: novoPedido });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

