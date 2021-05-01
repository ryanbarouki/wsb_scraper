
const mongoose = require('mongoose');

const tickerNameSchema = new mongoose.Schema({
    name: {
        type: String
    }
});

const TickerName = mongoose.model('TickerName', tickerNameSchema);

module.exports = TickerName;