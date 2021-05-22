const express = require('express');
const router = express.Router();

// via MDN - It is essential to understand the prototypal inheritance model before writing complex code that makes use of it. Also, be aware of the length of the prototype chains in your code and break them up if necessary to avoid possible performance problems. Further, the native prototypes should never be extended unless it is for the sake of compatibility with newer JavaScript features.

/* GET home page. */
router.post('/', function (req, res, next) {
  console.log(req.body);
  res.send('proto');
});

module.exports = router;
