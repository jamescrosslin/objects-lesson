var express = require('express');
var path = require('path');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// prototyping
app.use((req, res, next) => {
  // function dataPrototype(obj) {
  //   this.id = 1;
  //   for (let key of Object.keys(obj)) {
  //     this[key] = obj[key];
  //   }
  // }
  // req.formData = new dataPrototype(formData);

  // could alternately do
  const dataPrototype = { id: 1, extendsFrom: 'dataPrototype' };
  const formData = req.body;
  Object.setPrototypeOf(formData, dataPrototype);

  req.formData = formData;

  next();
});

// classing
// app.use((req, res, next) => {
//   const formData = req.body;

//   req.formData = formData;
//   next();
// });

// composing
// app.use((req, res, next) => {
//   const formData = req.body;

//   req.formData = formData;
//   next();
// });

app.post('/submission', (req, res) => {
  console.log(req.formData);
  console.log(req.formData.id, req.formData.extendsFrom);
  res.send('This is a page');
});

module.exports = app;
