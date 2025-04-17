const mongoose = require('mongoose');

const schema = mongoose.Schema;

const heroSchema = new schema({
    code: { type: Number, required: true },
    name: { type: String, required: true, maxLength: 100 },
    pet:  { type: Number, required: false },
});

heroSchema.virtual('url').get(function() {
    return '/heroes/hero' + this._id;
});

module.exports = mongoose.model("Hero", heroSchema);