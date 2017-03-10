var rss = require('rss-to-json');
var Comment = require('./models/comment.js');

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
        Comment.find({}, function(err, comments) {
          if(err) {
            return err;
          } else {
            res.render('index', {title: 'Jeva ohsiha', json: feed, comments: comments});
          }
        })
	   });
    });

    app.post('/comment', function(req, res) {
      var newComment = new Comment;
      newComment.author = req.user.google.name;
      newComment.comment = req.body.message;
      newcomment.date = new Date();
      newComment.save(function(err) {
        if (err)
          return err;
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
