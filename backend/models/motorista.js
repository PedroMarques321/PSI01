const mongoose = require('mongoose');

const schema = mongoose.Schema;

const pessoaModel = require('./pessoa');
const pessoaSchema = pessoaModel.schema;
const moradaModel = require('./morada');
const moradaSchema = moradaModel.schema;

const motoristaSchema = new schema({
    morada: moradaSchema,
    carta_de_conducao: { type: String, required: true, maxLength: 20 },
    pessoa: pessoaSchema,
    nascimento: { type: Date, required: true },
    requesitado: { type: Boolean, default: false },
});

motoristaSchema.virtual('url').get(function() {
    return '/motoristas/motorista' + this._id;
});

module.exports = mongoose.model("Motorista", motoristaSchema);