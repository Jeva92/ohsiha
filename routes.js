var rss = require('rss-to-json');

module.exports = function(app, passport) {
    app.get('*', function(req, res, next) {
	        res.locals.user = req.user || null;
		next();
    });
    app.get('/old', function(req, res) {       
        res.render('index', {title: 'Jeva ohsiha'});
    });
    
    app.get('/', function(req, res) {
        rss.load("http://www.io-tech.fi/feed/", function(err, feed) {
	   res.render('index', {title: 'Jeva ohsiha', json: feed});
	   });
    });
    
    app.get('/json', function(req, res) {
        rss.load("http://www.io-tech.fi/feed/", function(err, feed) {
	   res.json(feed);
	   });
     });
    app.get('/auth/google', passport.authenticate('google', {scope : ['profile', 'email'] }));

    app.get('/auth/google/callback', 
            passport.authenticate('google', {
	        successRedirect : '/',
		failureRedirect : '/'
	    }));      
     app.get('/logout', function(req, res) {
         req.logout();
	 res.redirect('/');
     });
};


function isLoggedIn(req, res, next) {
    if(req.isAuthenticated())
        return next;
    res.redirect('/');
};     