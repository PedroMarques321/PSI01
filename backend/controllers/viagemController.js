const Viagem = require('../models/viagem');
const Pedido = require('../models/pedido');
const Turno = require('../models/turno');
const Price = require('../models/price');
const haversine = require('../utils/haversine');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');


// Handle Viagens GET
exports.viagensGetAll = asyncHandler(async function(req, res, next) {
    console.log("viagemController(viagensGetAll): Fetching all viagens");

    const viagens = await Viagem.find().sort({ horaPartida: -1 });

    if (viagens.length === 0) {
        res.status(404);
        throw new Error("viagemController(viagensGetAll): No viagens found");
    }

    res.json(viagens);
});

// Handle Viagem GET by ID
exports.viagemGetById = asyncHandler(async function(req, res, next) {
    console.log("viagemController(viagemGetById): Fetching viagem by ID");
    const motoristaId = req.params.id;
    //ordenado por hora de início 
    const viagens = await Viagem.find({ condutorID: motoristaId }).sort({ horaPartida: -1 }); 

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
  console.log("viagemController(viagemCreate): Criar viagem automaticamente a partir de um pedido");

  const { pedidoId, moradaPartida, moradaChegada, motoristaId, coordenadasMotorista } = req.body;

  // Buscar o pedido
  const pedido = await Pedido.findById(pedidoId);
  if (!pedido || pedido.estado !== 'aceite') {
    return res.status(400).json({ message: "Pedido inválido ou não aceite" });
  }

  // Buscar o turno ativo do motorista
  const turno = await Turno.findOne({ motorista: motoristaId, dataFim: null });
  if (!turno) {
    return res.status(400).json({ message: "Motorista não está num turno ativo" });
  }

  // Buscar viagens já existentes no turno para verificar sequência e conflitos
  const viagensDoTurno = await Viagem.find({ turnoID: turno._id });
  const novaSequencia = viagensDoTurno.length + 1;

  // Calcular distâncias para estimativa de duração
  const distMotoristaCliente = haversine(
    coordenadasMotorista.lat,
    coordenadasMotorista.lng,
    pedido.coordenadas_origem.lat,
    pedido.coordenadas_origem.lng
  );
  const distClienteDestino = haversine(
    pedido.coordenadas_origem.lat,
    pedido.coordenadas_origem.lng,
    pedido.coordenadas_destino.lat,
    pedido.coordenadas_destino.lng
  );
  const distanciaTotalKm = distMotoristaCliente + distClienteDestino;

  const duracaoMin = distanciaTotalKm * 4; // 4 minutos por km
  const novaInicio = new Date();
  const novaFim = new Date(novaInicio.getTime() + duracaoMin * 60000);

  // Verificar sobreposição com outras viagens
  const sobreposta = viagensDoTurno.some(v => {
    const inicioV = new Date(v.horaPartida);
    const fimV = new Date(v.horaChegada || v.horaChegadaEstimada || new Date(inicioV.getTime() + 1800000));
    return (
      (novaInicio >= inicioV && novaInicio < fimV) ||
      (novaFim > inicioV && novaFim <= fimV) ||
      (novaInicio <= inicioV && novaFim >= fimV)
    );
  });

  if (sobreposta) {
    return res.status(400).json({ message: "Já existe uma viagem neste intervalo no turno do motorista." });
  }

  // Criar nova viagem
  const novaViagem = new Viagem({
    _id: new mongoose.Types.ObjectId(),
    sequencia: novaSequencia,
    numeroPessoas: pedido.numero_pessoas,
    clienteID: pedido.cliente.toString(), // necessário como string
    data: new Date(),
    horaPartida: novaInicio.toTimeString().slice(0, 5),
    horaChegadaEstimada: novaFim.toTimeString().slice(0, 5),
    moradaPartida: moradaPartida,
    moradaChegada: moradaChegada,
    turnoID: turno._id,
    condutorID: motoristaId,
    pedidoID: pedidoId,
    estado: 'EM_CURSO',
    coordenadasPartida: pedido.coordenadas_origem,
    coordenadasChegada: pedido.coordenadas_destino,
    quilometros: parseFloat(distClienteDestino.toFixed(2)),
    preco: 0, // será calculado no concluir
    tipoServico: "Normal" // ou "Luxo" se o serviço permitir
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

    const viagemId = req.params.id;
    const { moradaChegada, coordenadasChegada } = req.body;

    const viagem = await Viagem.findById(viagemId);
    if (!viagem) {
        return res.status(404).json({ message: "Viagem não encontrada" });
    }

    // Atualizar chegada
    viagem.horaChegada = new Date();
    viagem.moradaChegada = moradaChegada;
    viagem.coordenadasChegada = coordenadasChegada;

    const origem = viagem.coordenadasPartida;
    const destino = coordenadasChegada;

    if (!origem || !destino) {
        return res.status(400).json({ message: "Coordenadas incompletas para calcular distância." });
    }

    const horaPartida = new Date(viagem.horaPartida);
    const horaChegada = viagem.horaChegada;

    if (horaPartida >= horaChegada) {
        return res.status(400).json({ message: "Hora de chegada deve ser posterior à hora de partida." });
    }

    const turno = await Turno.findById(viagem.turnoID);
    if (!turno || !turno.dataInicio || (turno.dataFim && horaChegada > turno.dataFim)) {
        return res.status(400).json({ message: "Viagem fora do período do turno." });
    }

    const viagensMotorista = await Viagem.find({
        condutorID: viagem.condutorID,
        _id: { $ne: viagem._id },
        horaPartida: { $lt: horaChegada },
        horaChegada: { $gt: horaPartida }
    });

    if (viagensMotorista.length > 0) {
        return res.status(400).json({ message: "Viagem sobreposta com outra já registada." });
    }

    // Validação tipoServico
    if (!viagem.tipoServico || !["Normal", "Luxo"].includes(viagem.tipoServico)) {
        return res.status(400).json({ message: "Tipo de serviço inválido ou ausente." });
    }

    const distanciaKm = haversine(origem.lat, origem.lng, destino.lat, destino.lng);
    viagem.quilometros = distanciaKm;

    const price = await Price.findOne();
    if (!price) {
        return res.status(500).json({ message: "Taxas de preço não encontradas." });
    }

    const hora = horaPartida.getHours();
    const isNoturno = hora >= 21 || hora < 7;

    const taxaBase = viagem.tipoServico === "Luxo" ? price.taxa_luxo : price.taxa_normal;
    const taxaFinal = taxaBase + (isNoturno ? price.acrescimo_noturno : 0);

    viagem.preco = parseFloat((distanciaKm * taxaFinal).toFixed(2));
    viagem.estado = "CONCLUIDO";

    await viagem.save();

    res.json({
        message: "Viagem concluída com sucesso",
        viagem
    });
});


// Atualizar estado da viagem para PENDENTE
exports.viagemPendente = asyncHandler(async function(req, res, next) {
    console.log("viagemController(viagemPendente): Pendente viagem");
    const viagem = await Viagem.findById(req.params.id);
    viagem.estado = 'PENDENTE';
    await viagem.save();
    res.json(viagem);
});

// Atualizar coordenadasPartida da viagem
exports.atualizarCoordenadasPartida = asyncHandler(async function (req, res, next) {
  const viagem = await Viagem.findById(req.params.id);
  if (!viagem) {
    res.status(404);
    throw new Error("Viagem não encontrada");
  }

  viagem.coordenadasPartida = req.body.coordenadasPartida;
  await viagem.save();

  res.status(200).json({ message: "Coordenadas de partida atualizadas com sucesso", viagem });
});
exports.atribuirTurno = asyncHandler(async function (req, res) {
    const viagemId = req.params.id;
    const { turnoID } = req.body;

    const viagem = await Viagem.findById(viagemId);
    if (!viagem) {
        return res.status(404).json({ message: "Viagem não encontrada." });
    }

    viagem.turnoID = turnoID;
    await viagem.save();

    res.json({ message: "turnoID atribuído com sucesso", viagem });
});
