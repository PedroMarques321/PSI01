const mongoose = require('mongoose');

const schema = mongoose.Schema;

const pessoaSchema = require('./pessoa');
const moradaSchema = require('./morada');
const morada = require('./morada');

const motoristaSchema = new schema({
    morada: { type: moradaSchema, required: true },
    carta_de_conducao: { type: String, required: true, maxLength: 20 },
    pessoa: { type: pessoaSchema, required: true },
    nascimento: { type: Date, required: true },
});

motoristaSchema.virtual('url').get(function() {
    return '/motoristas/motorista' + this._id;
});

module.exports = mongoose.model("Motorista", motoristaSchema);