const mongoose = require('mongoose');
const Hashtag = require('./hastags');

const tweetSchema = new mongoose.Schema({
    caption: {
        type: String,
        required: true,
        trim: true,
        maxlength: 155
        
    },
    body: {
        type: String,
        required: true,
        trim: true,
        maxlength: 250
    },
    image:{
        type: String
    }
});

const Tweet = mongoose.model('Tweet',tweetSchema);
module.exports = Tweet;