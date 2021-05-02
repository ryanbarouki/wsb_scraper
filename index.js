const express = require('express');
const mongoose = require('mongoose');
const app = express();
const {scrapeWSB, countInstances, findTickers} = require('./scraper');
const cron = require('node-cron');
const Ticker = require('./models/ticker');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wsbScraper', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log("Mongo connection started!");
})
.catch(err => {
    console.log("Oh no Mongo connection error!");
    console.log(err);
});

// cron.schedule('* * * * *', async () => {
//     const results = await scrapeWSB();
//     const count = countInstances(results, 'GME');
//     let date = new Date();
//     const timeNow = date.getTime();
//     const ticker = new Ticker({name: 'GME', count: count, time: timeNow})
//     ticker.save()
//     .then(data => console.log(`added ${data} to DB`))
//     .catch(console.log);
// });

cron.schedule('0 * * * *', async () => {
    await findTickers();
})

app.get('/' ,(req, res) => {
    res.send('Home directory');
});

app.get('/getData', async (req, res) => {
    // send back data from db
    const condition = {"name": {$regex: 'GME', $options : 'i'}}
    const results = await Ticker.find(condition);
    let data = [];
    let min = new Date('April 23, 2021');
    filteredResults = results.filter(entry => new Date(entry.time).getTime() > min.getTime())
    filteredResults.forEach(entry => {
        data.push({x: new Date(entry.time).getTime(), y:entry.count});
    })
    res.send({data: data});
});

app.get('/test', async (req, res) => {
    const results = await findTickers();
    res.send(results);
});
// app.get('/scrape', async (req, res) =>  {
    
//     res.send({'count': count, 'comments': results});
// });
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});