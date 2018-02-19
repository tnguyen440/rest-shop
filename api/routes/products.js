const express = require('express');
const router = express.Router();

const Product = require('../models/product');

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'GET request to /products'
  });
});

router.post('/', (req, res, next) => {
  // const product = {
  //   name: req.body.name,
  //   price:  req.body.price
  // };
  const product = new Product({
    name: req.body.name,
    price:  req.body.price
  });

  product.save()
    .then(result => console.log(result))
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });

  res.status(201).json({
    message: 'POST request to /products',
    createdProduct: product
  });
});

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .exec()
    .then(doc => {
      console.log('from db', doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({
          message: 'No valid enry found for provided ID'
        });
      }
      
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch('/:productId', (req, res, next) => {
  res.status(200).json({
    message: 'Updated product!'
  })
});

router.delete('/:productId', (req, res, next) => {
  res.status(200).json({
    message: 'Deleted product!'
  })
});


module.exports = router;