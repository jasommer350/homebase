var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    //logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    swig = require('swig'),
    routes = require('./routes'),
    app = express(),
    db = require('./database/dboperations').opendb('photoblog.db', __dirname);


// Disables caching in Swig.
swig.setDefaults({ cache: false });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
//app.use(logger('dev'));
//app.use(bodyParser.json());
app.use('/todo', bodyParser.urlencoded({ extended: true }));
app.use('/todo', cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', routes);
routes(app, __dirname);




module.exports = app;
