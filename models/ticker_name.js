
const mongoose = require('mongoose');

const tickerNameSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    total: {
        type: Number
    }
});

const TickerName = mongoose.model('TickerName', tickerNameSchema);

module.exports = TickerName;