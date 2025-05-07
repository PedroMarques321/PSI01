const mongoose = require('mongoose');

const schema = mongoose.Schema;

const taxiSchema = new schema({
    modelo: { type: String, required: true, maxLength: 20 },
    marca: { type: String, required: true, maxLength: 20 },
    conforto: { type: String, required: true, maxLength: 20 },
    matricula: { type: String, required: true, maxLength: 28 },
    ano_de_compra:  { type: Date, required: true },
    lugares: { type: Number, required: true}
});

taxiSchema.virtual('url').get(function() {
    return '/taxis/taxi' + this._id;
});

module.exports = mongoose.model("Taxi", taxiSchema);