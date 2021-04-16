const snoowrap = require('snoowrap');
require('dotenv').config();

async function scrapeWSB(data) {
    const req = new snoowrap({
        userAgent: 'user agent',
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        username: process.env.REDDIT_USER,
        password: process.env.REDDIT_PASS
    });

    // req.getHot().map(post => post.title).then(console.log);
    await req.getSubreddit('wallstreetbets').getHot({time: 'hour'})
    .then(listing => {
       listing.forEach(sub => sub.expandReplies({limit: 1, depth: 0})
        .then(c => c.comments.forEach(comment => { 
            // console.log(comment.body)
            data.push(comment.body)
        })))
    })

    return data
}

function countInstances(comments, ticker) {
    let count = 0;
    const regex = new RegExp(ticker, 'g');
    for (const comment of comments) {
       count += (comment.match(regex) || []).length;
    }
    return count;
}

module.exports = {scrapeWSB, countInstances};