const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const path = require('path');
const {findTickers, validateTickers} = require('./scraper');
const cron = require('node-cron');
const Ticker = require('./models/ticker');
const TickerName = require('./models/ticker_name');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wsbScraper', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log("Mongo connection started!");
})
.catch(err => {
    console.log("Oh no Mongo connection error!");
    console.log(err);
});
// ** MIDDLEWARE ** //
const whitelist = ['http://localhost:3000', 'http://localhost:5000', 'https://reddit-stonks.herokuapp.com/'];
const corsOptions = {
    origin: function (origin, callback) {
        console.log("** Origin of request " + origin)
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            console.log("Origin acceptable")
            callback(null, true)
        } else {
            console.log("Origin rejected")
            callback(new Error('Not allowed by CORS'))
        }
    }
}
app.use(cors(corsOptions));

let unvalidatedTickers = new Set();
cron.schedule('*/10 * * * *', async () => {
    const newUnvalidatedTickers = await findTickers();
    newUnvalidatedTickers.forEach(ticker => unvalidatedTickers.add(ticker));
})

const REQUEST_LIMIT = 50;
cron.schedule('* * * * *', async () => {
    unvalidatedTickers = await validateTickers(unvalidatedTickers, REQUEST_LIMIT);
})

app.get('/getTicker/:ticker', async (req, res) => {
    // send back data from db
    const results = await Ticker.find({name: req.params.ticker});
    let data = [];
    results.forEach(entry => {
        data.push({x: new Date(entry.time).getTime(), y:entry.count});
    })
    res.send({data: data});
});

app.get('/getTickerList', async (req, res) => {
    const tickers = await TickerName.find({});
    let data = [];
    tickers.forEach(ticker => data.push({name: ticker.name, total: ticker.total}));
	data.sort((a,b) => b.total - a.total);
    res.send({tickers: data});
});


if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));
    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});