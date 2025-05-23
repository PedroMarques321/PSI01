var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var dashboardRouter = require('./routes/dashboard');
var initRouter = require('./routes/init');
var pedidosRouter = require('./routes/pedidos');



var app = express(); 

const mongoose = require('mongoose');
/*
mongoose.connect("mongodb://localhost:27017/webtaxi").then(() => {
  console.log("Ligado à base de dados MongoDB");
}).catch((err) => {
    console.error("Erro na ligação à base de dados:", err);
});
*/
// Conexão com o MongoDB AppServer

mongoose.connect("mongodb://PSI001:PSI001@localhost:27017/PSI001?retryWrites=true&authSource=PSI001/webtaxi").then(() => {
  console.log("Ligado à base de dados MongoDB");
}).catch((err) => {
    console.error("Erro na ligação à base de dados:", err);
});


// CORS
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/dashboard', dashboardRouter);
app.use('/init', initRouter);    
app.use('/pedidos', pedidosRouter);


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

// Iniciar o servidor
/*
app.listen(3051, () => {
  console.log("Servidor a correr na porta 3051");
});
*/
module.exports = app;
