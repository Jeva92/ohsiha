var rss = require('rss-to-json');
var Comment = require('./models/comment.js');

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
};

module.exports = function(app, passport) {
    app.get('*', function(req, res, next) {
	        res.locals.user = req.user || null;
		next();
    });

    app.use(function(req, res, next) {
     res.setHeader('Access-Control-Allow-Origin', '*');
     res.setHeader('Access-Control-Allow-Credentials', 'true');
     res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
     res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    //and remove cacheing so we get the most recent comments
     res.setHeader('Cache-Control', 'no-cache');
     next();
    });

    app.get('/', function(req, res) {
      rss.load("http://www.io-tech.fi/feed/", function(err, feed) {
        Comment.find({}, 'author date comment id').sort('-date').limit(10).exec(function(err, comments) {
          if(err) {
            return console.log(err);
          } else {
            res.render('index', {title: 'Jeva ohsiha', json: feed, comments: comments});
          }
        })
	   });
    });

    app.get('/delete', isLoggedIn, function(req, res) {
      Comment.findOne({_id: req.query.id}).remove(function(err) {
        if(err) {
          return console.log(err);
        } else {
          res.redirect('/');
        }
      });
    });

    app.post('/comments', function(req, res) {
      var newComment = new Comment();
      newComment.author = req.body.author;
      newComment.comment = req.body.comment;
      newComment.save(function(err) {
        if (err) {
          return console.log(err);
        } else {
          res.redirect('/');
        }
      });
    });

    app.post('/comments', isLoggedIn, function(req, res) {
      var newComment = new Comment();
      newComment.author = req.user.google.name;
      newComment.comment = req.body.comment;
      newComment.save(function(err) {
        if (err) {
          return console.log(err);
        } else {
          res.redirect('/');
        }
      });
    });

    app.get('/comments', function(req, res) {
      Comment.find({}, 'author date comment id').sort('-date').limit(10).exec(function(err, comments) {
        if(err) {
          return console.log(err);
        } else {
          console.log('comments loaded');
          res.json(comments);
        }
      });
    });

    app.get('/json', function(req, res) {
        rss.load("http://www.io-tech.fi/feed/", function(err, feed) {
	   console.log('json loaded');
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
