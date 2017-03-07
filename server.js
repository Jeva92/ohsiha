var express = require('express');

var app = express();

app.set('view engine', 'jade');

app.locals.pretty = true;

require('./routes.js')(app);

app.listen(8000);