const express = require('express');
const app = express();
const {scrapeWSB, countInstances} = require('./scraper');

const str = "this is a string";


let results = []
app.get('/' ,(req, res) => {
    res.send(results);
})

app.get('/scrape', async (req, res) =>  {
    results = await scrapeWSB(results);
});

app.listen(3000, () => {
    console.log('listening on port 3000');
});