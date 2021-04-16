const express = require('express');
const app = express();
const {scrapeWSB, countInstances} = require('./scraper');

const str = "this is a string";


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