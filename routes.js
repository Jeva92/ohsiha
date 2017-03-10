var rss = require('rss-to-json');
var Comment = require('./models/comment.js');

module.exports = function(app, passport) {
    app.get('*', function(req, res, next) {
	        res.locals.user = req.user || null;
		next();
    });

    app.get('/', function(req, res) {
      rss.load("http://www.io-tech.fi/feed/", function(err, feed) {
        Comment.find({}, {limit: 10}, function(err, comments) {
          if(err) {
            return console.log(err);
          } else {
            res.render('index', {title: 'Jeva ohsiha', json: feed, comments: comments});
          }
        })
	   });
    });

    app.post('/comment', isLoggedIn, function(req, res) {
      var newComment = new Comment;
      newComment.author = req.user.google.name;
      newComment.comment = req.body.comment;
      newcomment.date = new Date();
      newComment.save(function(err) {
        if (err)
          return console.log(err);
      });
      res.redirect('/');
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
