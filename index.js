const express = require('express');
const mongoose = require('mongoose');
const app = express();
const {scrapeWSB, countInstances} = require('./scraper');
const Ticker = require('./models/ticker');

mongoose.connect('mongodb://localhost:27017/wsbScraper', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log("Mongo connection started!");
})
.catch(err => {
    console.log("Oh no Mongo connection error!");
    console.log(err);
});

app.get('/' ,(req, res) => {
    res.send('Home directory');
})

app.get('/scrape', async (req, res) =>  {
    const results = await scrapeWSB();
    const count = countInstances(results, 'GME');
    let date = new Date();
    const timeNow = date.getTime();
    const ticker = new Ticker({name: 'GME', count: count, time: timeNow})
    ticker.save()
    .then(data => console.log(`added ${data} to DB`))
    .catch(console.log);
    res.send({'count': count, 'comments': results});
});

app.listen(3000, () => {
    console.log('listening on port 3000');
});