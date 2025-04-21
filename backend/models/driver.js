const mongoose = require('mongoose');

const schema = mongoose.Schema;

const driverSchema = new schema({
    nome: { type: String, required: true, maxLength: 20 },
    genero: { type: String, required: true, maxLength: 20 },
    nif: { type: String, required: true, maxLength: 9 },
    carta_de_conducao: { type: String, required: true, maxLength: 20 },
    codigo_postal: { type: String, required: true, maxLength: 20 },
    ano_de_nascimento: { type: Date, required: true },
});

driverSchema.virtual('url').get(function() {
    return '/drivers/driver' + this._id;
});

module.exports = mongoose.model("Driver", driverSchema);