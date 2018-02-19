const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productrRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

mongoose.connect('mongodb://localhost:27017/test');
mongoose.Promise = global.Promise;

// app.use((req, res, next) => {
//   res.status(200).json({
//     message: 'hello'
//   });
// });
app.use(morgan('dev'));

app.use('/uploads', express.static('uploads'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req,res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Header', 
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

app.use('/products', productrRoutes);
app.use('/orders', ordersRoutes);
app.use('/user', userRoutes);

// Errors Handling
app.use('/*', (req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req,res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  }); 
});

module.exports = app;
