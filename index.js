const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const Tweet = require('./db/tweet');
const Hashtag = require('./db/hastags');

const db = require('./db/index');

aws.config.update({
    secretAccessKey: '',
    accessKeyId: '',
    region: ''
});

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
} else {
    cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);
}
}

const upload = multer({
    fileFilter,
    storage: multerS3({
        acl: 'public-read',
        s3,
        bucket: 'bucket-name',
        metadata: function (req, file, cb) {
            cb(null, {fieldName: 'TESTING_METADATA'});
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString());
        }
        
    })
});

app.use(bodyParser.json());

app.post('/tweet', async (req,res)=>{
    let newTweet = new Tweet({
        caption: req.body.caption,
        body: req.body.body
    });
    try{
        
        if(req.body.img){
            const up = await upload.single('req.body.img');
            newTweet.image = up;
        }
         
        await newTweet.save();
        let tags = req.body.caption.match(/#[a-z0-9_]+/g);
        if(tags.length>0){
            tags.forEach(async tagName => {
                let tag = await Hashtag.find({tag:tagName});
                console.log("Tag from find: ",tag);
                if(tag.length!==0){
                    tag[0].tweets = [...tag[0].tweets,newTweet.id]
                    await tag[0].save();
                    console.log("Saved tag's tweets: ",tag[0].tweets);
                }else{
                    let hashtag = new Hashtag({
                        tag:tagName,
                        tweets: new Array(newTweet.id)
                    });
                    await hashtag.save();
                    console.log(hashtag);
                }
            });
        }
        return res.status(200).json(newTweet);
    }catch(err){
        console.log(err);
        return res.status(500).json('cannot save tweet');
    }
});

app.get('/tweets', async (req,res)=>{
    try{
        let tagName = req.body.tag;
        let tag = await db.Hashtag.find({tag:tagName});
        return res.status(200).json(tag);
    }catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
});

app.listen(3000,()=>{
    console.log('server is running');
})