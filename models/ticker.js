const mongoose = require('mongoose');

const tickerSchema = new mongoose.Schema({
    name: {
        type: String
    },
    count: {
        type: Number
    }
});

const Ticker = mongoose.model('Ticker', tickerSchema);

module.exports = Ticker;