const mongoose = require('mongoose');

const schema = mongoose.Schema;

const moradaSchema = new schema({
    numero_porta: { type: Number, required: true, maxLength: 20 },
    rua: { type: String, required: true, maxLength: 20 },
    codigo_postal: { type: String, required: true, maxLength: 20 },
    localidade: { type: String, required: true, maxLength: 20 },
});

moradaSchema.virtual('url').get(function() {
    return '/moradas/morada' + this._id;
});

module.exports = mongoose.model("Morada", moradaSchema);