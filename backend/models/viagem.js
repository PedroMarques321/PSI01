const mongoose = require('mongoose');

const schema = mongoose.Schema;

const viagemSchema = new schema({
    sequencia: { type: Number, required: true },
    numeroPessoas: { type: Number, required: true },
    clienteID: { type: String, required: true },
    periodo: { type: Object, required: true },
    condutorID: { type: String, required: true },
    quilometros: { type: Number, required: true },
    moradaPartida: { type: String, required: true },
    moradaChegada: { type: String, required: true },
    estado: { type: String, enum: ['PENDENTE', 'ACEITE', 'REJEITADO', 'CANCELADO'], required: true }
});
