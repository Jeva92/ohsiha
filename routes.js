var rss = require('rss-to-json');

module.exports = function(app) {
    app.get('*', function(req, res, next) {
	        next();
    });
    app.get('/', function(req, res) {
       
        res.render('index', {title: 'Jeva ohsiha'});
    });
    
    app.get('/test', function(req, res) {
        rss.load("http://www.iltalehti.fi/rss/uutiset.xml", function(err, feed) {
	   res.render('test', {title: 'Jeva ohsiha', json: feed});
	   });
    });
    
    app.get('/json', function(req, res) {
        rss.load("http://www.iltalehti.fi/rss/uutiset.xml", function(err, feed) {
	   res.json(feed);
	   });
     });
};