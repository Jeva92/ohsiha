var express = require('express');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');

var app = express();
var User = require('./models/user.js');
var authConfig = require('./auth.js');

mongoose.connect('mongodb://localhost:27017/ohsihadb');

app.set('view engine', 'pug');

app.use(session({
    secret: 'Fail',
    resave: false,
    saveUninitailize: false,
}));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.locals.pretty = true;
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID : authConfig.googleAuth.clientID,
    clientSecret : authConfig.googleAuth.clientSecret,
    callbackURL : authConfig.googleAuth.callbackURL,
},
function(token, refreshToken, profile, done) {
    process.nextTick(function() {
        User.findOne({'google.id' : profile.id }, function(err, user) {
	if(err)
	    return done(err);
	if(user) {
	    console.log("Logged in as " + user);
	    return done(null, user);
	} else {
	    var newUser = new User();
	    newUser.google.id = profile.id;
	    newUser.google.token = token;
	    newUser.google.name = profile.displayName;
	    newUser.google.email = profile.emails[0].value;
	    newUser.save(function(err) {
	        if(err)
		    throw err;
		return done(null, newUser);
                });
  	    }
	});
    });
}));

require('./routes.js')(app, passport);

app.listen(8000);
