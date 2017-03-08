var rss = require('rss-to-json');

module.exports = function(app, passport) {
    app.get('*', function(req, res, next) {
	        next();
    });
    app.get('/', function(req, res) {
       
        res.render('index', {title: 'Jeva ohsiha'});
    });
    
    app.get('/test', function(req, res) {
        rss.load("http://www.io-tech.fi/feed/", function(err, feed) {
	   res.render('test', {title: 'Jeva ohsiha', json: feed});
	   });
    });
    
    app.get('/json', function(req, res) {
        rss.load("http://www.io-tech.fi/feed/", function(err, feed) {
	   res.json(feed);
	   });
     });
     
     app.get('/auth/facebook', passport.authenticate('facebook',{ scope : 'email' }));
     
     app.get('/auth/facebook/callback',
         passport.authenticate('facebook', {
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