const snoowrap = require('snoowrap');
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

    // req.getHot().map(post => post.title).then(console.log);
    const listings = await req.getSubreddit('wallstreetbets').getHot({time: 'hour'});

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

function countInstances(comments, ticker) {
    let count = 0;
    const regex = new RegExp(` ${ticker} `, 'ig');
    for (const comment of comments) {
       count += (comment.match(regex) || []).length;
    }
    return count;
}

module.exports = {scrapeWSB, countInstances};