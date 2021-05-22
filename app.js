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
  const formData = req.body;

  function dataPrototype(obj) {
    this.id = 1;
    for (let key of Object.keys(obj)) {
      this[key] = obj[key];
    }
  }
  req.formData = new dataPrototype(formData);

  // could alternately do
  // const dataPrototype = {id: 1}
  // const formData = req.body
  // Object.setPrototypeOf(formData, dataPrototype)

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
  console.log(req.formData, req.formData.prototype);
  res.end();
});

module.exports = app;
