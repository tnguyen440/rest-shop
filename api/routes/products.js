const express = require('express');
const router = express.Router();

const Product = require('../models/product');

// get all products
router.get('/', (req, res, next) => {
  Product.find()
    .select('name price _id')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            id: doc._id,
            request: {
              type: 'GET',
              url: 'http://localhost:5000/products/' + doc._id
            }
          }
        })
      }
      // if (docs.length = 0) {
        res.status(200).json(response);
      // } else {
      //   res.status(404).json({
      //     message: 'No entries found'
      //   });
      // }
      
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
  // res.status(200).json({
  //   message: 'GET request to /products'
  // });
});

// create product
router.post('/', (req, res, next) => {
  // const product = {
  //   name: req.body.name,
  //   price:  req.body.price
  // };
  const product = new Product({
    name: req.body.name,
    price:  req.body.price
  });

  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Created product successfully',
        createdProduct: {
          name: result.name,
          price: result.price,
          id: result._id,
          request: {
            type: 'GET',
            url: 'http://localhost:5000/products/' + result._id
          }
        }
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });

  // res.status(201).json({
  //   message: 'POST request to /products',
  //   createdProduct: product
  // });
});

// get product details
router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select('name price _id')
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: 'GET',
            description: 'Get all products',
            url: 'http://localhost:5000/products/'
          }
        });
      } else {
        res.status(404).json({
          message: 'No valid enry found for provided ID'
        });
      }
      
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

// update
router.patch('/:productId', (req, res, next) => {
  const id = req.params.productId;

  const udpateOps = {};

  for(const op of req.body) {
    udpateOps[op.propName] = op.value;
  }

  Product.update({ _id: id }, {
    $set: udpateOps
  }).exec()
    .then(result => {
      res.status(200).json({
        message: 'Product updated',
        request: {
          type: 'GET',
          url: 'http://localhost:5000/products/' + id
        }
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
  // res.status(200).json({
  //   message: 'Updated product!'
  // })
});

// delete
router.delete('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Product deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:5000/products/',
          body: {
            name: 'String',
            price: 'Number'
          }
        }
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});


module.exports = router;