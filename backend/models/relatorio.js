const mongoose = require('mongoose');

const schema = mongoose.Schema;

const relatorioSchema = new schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    clienteNIF: { type: String, required: true },
    data: { type: Date, required: true },
    horaPartida: { type: String, required: true },
    horaChegada: { type: String, required: true },
    motoristaID: { type: mongoose.Schema.Types.ObjectId, ref: 'Motorista', required: true },
    taxiID: { type: mongoose.Schema.Types.ObjectId, ref: 'Taxi', required: true },
    quilometros: { type: Number, required: true },
    moradaPartida: { type: String, required: true },
    moradaChegada: { type: String, required: true },
    preco: { type: Number, required: true },
    tipoServico: { type: String, enum: ['Normal', 'Luxo'], required: true },
    estado: { type: String, required: true },
});