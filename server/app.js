require('./src/lib/instrument.js')
require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const Sentry = require('@sentry/node');
const cors = require('cors');
const io = require("./src/lib/socketio.js")(app);

var app = express();

const router = require("./src/routes")

Sentry.setupExpressErrorHandler(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api/v1', router);
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});
app.use("/*", (req,res) => {
  res.status(404).send({
    status: "failed",
    message: "Route not found"
  })  
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use(function onError(err, req, res, next) {
  res.statusCode = 500;
  res.end(res.sentry + "\n");
})

const ioPort = 5200;
io.listen(ioPort, () => {
  console.log(`Io running on port ${ioPort}`)
})

module.exports = app;