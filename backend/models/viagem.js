const mongoose = require('mongoose');

const schema = mongoose.Schema;

const viagemSchema = new schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    sequencia: { type: Number, required: true },
    numeroPessoas: { type: Number, required: true },
    clienteID: { type: String, required: true },
    data: { type: Date, required: true },
    horaPartida: { type: String, required: false },
    horaChegadaEstimada: { type: String, required: false },
    condutorID: { type: mongoose.Schema.Types.ObjectId, ref: 'Motorista', required: false },
    taxiID: { type: mongoose.Schema.Types.ObjectId, ref: 'Taxi', required: false },
    quilometros: { type: Number, required: true },
    moradaPartida: { type: String, required: true },
    moradaChegada: { type: String, required: true },
    preco: { type: Number, required: true },
    tipoServico: { type: String, enum: ['Normal', 'Luxo'], required: true },
    estado: { 
        type: String, 
        enum: ['PENDENTE', 'ACEITE', 'REJEITADO', 'CANCELADO', 'CONCLUIDO', 'EM_CURSO'], 
        required: true,
        default: 'PENDENTE'
    },
    coordenadasPartida: {
    lat: { type: Number },
    lng: { type: Number }
    },
    coordenadasChegada: {
    lat: { type: Number },
    lng: { type: Number }
    },
    horaChegada: { type: Date },
    distClienteMotorista: { type: Number, required: false, default: null }
});

viagemSchema.virtual('url').get(function() {
    return '/viagens/viagem' + this._id;
});

module.exports = mongoose.model("Viagem", viagemSchema);