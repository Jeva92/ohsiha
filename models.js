var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ohsihadb');

var User = mongoose.Schema({
    fb : {
        id : String,
	token : String,
	email: String,
	name : String
    }
});

module.exports = {User: User};