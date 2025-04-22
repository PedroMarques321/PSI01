const mongoose = require('mongoose');

const schema = mongoose.Schema;

const pessoaSchema = new schema({
    nif: { type: String, required: true, maxLength: 9 },
    nome: { type: String, required: true, maxLength: 20 },
    genero: { type: String, enum:['Masculino', 'Feminino'], required: true, }
});

pessoaSchema.virtual('url').get(function() {
    return '/pessoas/pessoa' + this._id;
});

module.exports = mongoose.model("Pessoa", pessoaSchema);