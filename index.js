const express = require('express');
const mongoose = require('mongoose');
const app = express();
const {scrapeWSB, countInstances} = require('./scraper');

mongoose.connect('mongodb://localhost:27017/wsbScraper', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log("Mongo connection started!");
})
.catch(err => {
    console.log("Oh no Mongo connection error!");
    console.log(err);
});

let results = [];
let count = 0;
app.get('/' ,(req, res) => {
    res.send({'count': count, 'comments': results});
})

app.get('/scrape', async (req, res) =>  {
    let results = await scrapeWSB();
    count = countInstances(results, 'GME');
    res.send({'count': count, 'comments': results});
});

app.listen(3000, () => {
    console.log('listening on port 3000');
});