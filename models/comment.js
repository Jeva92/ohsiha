var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
  author : String,
  date : Date,
  comment : String
})

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
