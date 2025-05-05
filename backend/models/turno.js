const mongoose = require('mongoose');

const schema = mongoose.Schema;

// Supondo que os modelos 'Motorista' e 'Taxi' já estejam definidos e exportados
const motoristaModel = require('./motorista');
const taxiModel = require('./taxi');

// Referenciando os esquemas dos modelos existentes
const motoristaSchema = motoristaModel.schema;
const taxiSchema = taxiModel.schema;

// Definindo o schema do Turno
const turnoSchema = new schema({
  dataInicio: { type: Date, required: true },
  dataFim: { type: Date, required: true },
  motorista: { type: mongoose.Schema.Types.ObjectId, ref: 'Motorista', required: true },
  taxi: { type: mongoose.Schema.Types.ObjectId, ref: 'Taxi', required: true },
});

// Virtual para criar a URL do Turno
turnoSchema.virtual('url').get(function() {
  return '/turnos/turno/' + this._id;
});

// Exportando o modelo de Turno
module.exports = mongoose.model('Turno', turnoSchema);
