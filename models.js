var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ohsihadb');

var userSchema = new mongoose.Schema({
    google : {
        id : String,
	token : String,
	email: String,
	name : String
    }
});

var User = mongoose.model('User', userSchema);

module.exports = User;