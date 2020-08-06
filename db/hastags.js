const mongoose = require('mongoose');

const hashtagSchema = new mongoose.Schema({
    tag:{
        type: String,
        required:true,
        trim: true,
        minlength: 1
    },
    tweets:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tweet"
        }
    ]
});

const Hashtag = mongoose.model('Hashtag',hashtagSchema);
module.exports = Hashtag;
