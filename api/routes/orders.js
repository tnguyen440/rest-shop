const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');
const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', checkAuth, (req, res, next) => {
  Order.find()
    .select('product quantity _id')
    .populate('product', 'name')
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => {
          return {
            id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: 'GET',
              url: 'http://localhost:5000/orders/' + doc._id
            }
          }
        })
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
  // res.status(200).json({
  //   message: 'GET request to /orders'
  // });
});

router.post('/', checkAuth,(req, res, next) => {
  Product.findById(req.body.productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({
          message: 'Product not found'
        })
      }
      const order = new Order({
        quantity:  req.body.quantity,
        product: req.body.productId
      });
      return order.save();
    })
    .then(result => {
      res.status(201).json({
        message: 'Order stored',
        createdOrder: {
          id: result._id,
          product: result.product,
          quantity: result.quantity
        },
        request: {
          type: 'GET',
          url: 'http://localhost:5000/orders/' + result._id
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
  // const order = new Order({
  //   quantity:  req.body.quantity,
  //   product: req.body.productId
  // });

  // order
  //   .save()
  //   .then(result => {
  //     res.status(201).json({
  //       message: 'Order stored',
  //       createdOrder: {
  //         id: result._id,
  //         product: result.product,
  //         quantity: result.quantity
  //       },
  //       request: {
  //         type: 'GET',
  //         url: 'http://localhost:5000/orders/' + result._id
  //       }
  //     });
  //   })
  //   .catch(err => {
  //     res.status(500).json({ error: err });
  //   });

  // res.status(201).json({
  //   message: 'Order created',
  //   orderCreated: order
  // });
});

router.get('/:orderId', checkAuth,(req, res, next) => {
  Order.findById(req.params.orderId)
    .populate('product')
    .exec()
    .then(order => {
      if (!order) {
        return res.status(404).json({
          message: 'Order not found'
        })
      }
      res.status(200).json({
        order: order,
        request: {
          type: 'GET',
           url: 'http://localhost:5000/orders/'
        }
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
  // res.status(200).json({
  //   message: 'Order details',
  //   orderId: req.params.orderId
  // })
});

// router.patch('/:productId', (req, res, next) => {
//   res.status(200).json({
//     message: 'Updated product!'
//   })
// });

router.delete('/:orderId', checkAuth, (req, res, next) => {
  const id = req.params.orderId;
  Order.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Order deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:5000/orders/',
          body: {
            productId: 'ID',
            quantity: 'Number'
          }
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
  // res.status(200).json({
  //   message: 'Order deleted!'
  // })
});


module.exports = router;