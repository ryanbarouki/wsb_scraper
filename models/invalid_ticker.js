const mongoose = require('mongoose');

const invalidTickerSchema = new mongoose.Schema({
    name: {
        type: String
    }
});

const InvalidTicker = mongoose.model('InvalidTicker', invalidTickerSchema);

module.exports = InvalidTicker;