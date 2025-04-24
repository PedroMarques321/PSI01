const mongoose = require('mongoose');

const schema = mongoose.Schema;

const priceSchema = new schema({
    taxa_normal: { type: Number, required: true },
    taxa_luxo: { type: Number, required: true },
    acrescimo_noturno: { type: Number, required: true }
});

module.exports = mongoose.model("Price", priceSchema);