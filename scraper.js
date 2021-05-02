const snoowrap = require('snoowrap');
const fetch = require("node-fetch");
const TickerName = require('./models/ticker_name');
const Ticker = require('./models/ticker')
const REQUEST_LIMIT = 5;
require('dotenv').config();

async function scrapeWSB() {
    let data = [];
    const req = new snoowrap({
        userAgent: 'user agent',
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        username: process.env.REDDIT_USER,
        password: process.env.REDDIT_PASS
    });

    let listigns = [];
    try
    {
        listings = await req.getSubreddit('wallstreetbets').getNew({time: 'hour'});
    }
    catch (e) 
    {
        console.log(e);
        return [];
    }

    let allComments = [];
    let expandedPromises = [];
    for (const listing of listings)
    {
        expandedPromises.push(listing.expandReplies({limit: 1, depth: 0}));
    }

    for await (let expandedListing of expandedPromises)
    {
        const comments = expandedListing.comments;
        comments.forEach(comment => allComments.push(comment.body));
    }

    return allComments;
}

async function findTickers() {
    let data = [];
    const reddit = new snoowrap({
        userAgent: 'user agent',
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        username: process.env.REDDIT_USER,
        password: process.env.REDDIT_PASS
    });
    let listings = [];
    try {
        listings = await reddit.getSubreddit('wallstreetbets').getNew({ time: 'hour' });
    }
    catch (e) {
        console.log(e);
        return [];
    }

    let expandedPromises = [];
    for (const listing of listings) {
        expandedPromises.push(listing.expandReplies({ limit: 1, depth: 0 }));
    }

    let allText = [];
    for await (let expandedListing of expandedPromises) {
        // add the title, body and top-level comments to the allText array
        const comments = expandedListing.comments;
        allText.push(expandedListing.title);
        allText.push(expandedListing.selftext);
        comments.forEach(comment => allText.push(comment.body));
    }

    // Now to parse all the text for tickers
    // start by looking for $-formatted tickers
    let validatorCount = 0;
    let ticker_dict = {};
    for (const text of allText) {
        if (text == null) continue;
        indexOfDollar = text.indexOf('$') // note this only finds the first $ per text line
        if (indexOfDollar != -1) {
            const ticker = extractTicker(text, indexOfDollar)
            if (ticker !== null) {
                // should check if ticker is in DB
                const result = await TickerName.findOne({ name: ticker });
                // if ticker is not in db, save it with a count of 1
                if (result === null && validatorCount < REQUEST_LIMIT) {
                    isValidTicker = await validTicker(ticker);
                    if (isValidTicker) {
                        validatorCount += 1;
                        ticker_dict[ticker] = 1;
                        const new_ticker = new TickerName({name: ticker});
                        await new_ticker.save();
                    }
                }
                else {
                    ticker_dict[ticker] = ticker_dict[ticker] ? ticker_dict[ticker] + 1 : 1;
                }
            }
        }
    }

    for (const text of allText) {
        splitText = text.split(" ");
        for (const word of splitText)
        {
            if (word.length <= 5 && allLetter(word) && word == word.toUpperCase())
            {
                const result = await TickerName.findOne({ name: word });
                if (result !== null)
                {
                    ticker_dict[word] = ticker_dict[word] ? ticker_dict[word] + 1 : 1;
                }
                else if (validatorCount < REQUEST_LIMIT) 
                {
                    const isValidTicker = await validTicker(word);
                    if (isValidTicker)
                    {
                        validatorCount += 1;
                        ticker_dict[word] = 1;
                        const new_ticker = new TickerName({ name: word });
                        await new_ticker.save()
                    }
                }
            }
        }
    }
    for (const ticker in ticker_dict)
    {
        const tick = new Ticker({name: ticker, count: ticker_dict[ticker], time: new Date().getTime()})
        await tick.save();
    }
    return allText;
}

async function validTicker(ticker)
{
    if (ticker.length <= 5)
    {
        const request = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${process.env.API_KEY}`)
        const JSONdata = await request.json();
        const data = JSON.parse(JSON.stringify(JSONdata));
        if (request.status == 200 && 'Global Quote' in data && data['Global Quote'] !== {})
        {
            return true;
        }
    }
    return false;
}

function extractTicker(text, indexOfDollar)
{
    let index = indexOfDollar + 1;
    let ticker = '';
    let count = 0;
    while (index < text.length)
    {
        const char = text[index];
        if (isCharacterALetter(char))
        {
            ticker += char;
            count += 1;
            index += 1;
        }
        else
        {
            // no chars after $
            return count === 0 ? null : ticker.toUpperCase();
        }
    }
    return count === 0 ? null : ticker.toUpperCase();
}

function isCharacterALetter(char) {
    return (/[a-zA-Z]/).test(char);
}

function allLetter(word){
    return (/^[A-Za-z]+$/).test(word);
}

function countInstances(comments, ticker) {
    let count = 0;
    const regex = new RegExp(` ${ticker} `, 'ig');
    for (const comment of comments) {
       count += (comment.match(regex) || []).length;
    }
    return count;
}

module.exports = {scrapeWSB, countInstances, findTickers};