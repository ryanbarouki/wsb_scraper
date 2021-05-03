const mongoose = require('mongoose');

const invalidTickerSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    }
});

const InvalidTicker = mongoose.model('InvalidTicker', invalidTickerSchema);

module.exports = InvalidTicker;