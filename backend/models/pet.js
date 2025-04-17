const mongoose = require('mongoose');

const schema = mongoose.Schema;

const petSchema = new schema({
    code: {type: Number, required: true},
    name: { type: String, required: true, maxLength: 100 },
    owner: { type: schema.Types.ObjectId, ref: 'Hero', required: false },
});

petSchema.virtual('url').get(function() {
    return '/pets/pet' + this._id;
});

module.exports = mongoose.model("Pet", petSchema);