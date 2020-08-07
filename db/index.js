const mongoose = require("mongoose");
mongoose.set("debug", true);
mongoose.Promise = Promise;
mongoose.connect("mongodb+srv://admin:<password>@cluster0.prupk.mongodb.net/<dbname>?retryWrites=true&w=majority", {
  keepAlive: true,
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

module.exports.Hashtag = require("./hastags");
module.exports.Tweet = require("./tweet");