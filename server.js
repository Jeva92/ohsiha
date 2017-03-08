var express = require('express');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var passport = require('passport');

var app = express();
var models = require('./models.js');
var authConfig = require('./auth.js');

app.set('view engine', 'jade');

app.locals.pretty = true;

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new FacebookStrategy({
    clientID : authConfig.facebookAuth.clientID,
    clientSecret : authConfig.facebookAuth.clientSecret,
    callbackURL : authConfig.facebookAuth.callbackURL
},

function(token, refreshToken, profile, done) {
    process.findOne({ 'facebook.id' : profile.id }, function(err, user) {
        if (err)
	    return done(err);
	if (user) {
	    return done(null, user);
	} else {
	    var newUser = new models.User();
	    newUser.facebook.id = profile.id;
	    newUser.facebook.token = token;
	    newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
	    newUser.facebook.email = profile.emails[0].value;
	    
	    newUser.save(function(err) {
	        if(err)
		    throw err;
		return done(null, newUser);
	    });
	}
    });
}));


require('./routes.js')(app, passport);

app.listen(8000);