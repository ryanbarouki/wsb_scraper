const mongoose = require('mongoose');

const tickerSchema = new mongoose.Schema({
    name: {
        type: String
    },
    count: {
        type: Number
    },
    time: {
        type: Date
    }
});

const Ticker = mongoose.model('Ticker', tickerSchema);

module.exports = Ticker;