var express = require('express');
var path = require('path');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

const prototypeRouter = require('./routes/prototype');
app.use('/submission', prototypeRouter);

const classRouter = require('./routes/class');
app.use('/submission', classRouter);
const compositionRouter = require('./routes/composition');
app.use('/submission', compositionRouter);

module.exports = app;
