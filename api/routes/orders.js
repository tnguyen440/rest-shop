const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'GET request to /orders'
  });
});

router.post('/', (req, res, next) => {
  const order = {
    productId: req.body.productId,
    quantity:  req.body.quantity
  };
  res.status(201).json({
    message: 'Order created',
    orderCreated: order
  });
});

router.get('/:orderId', (req, res, next) => {
  res.status(200).json({
    message: 'Order details',
    orderId: req.params.orderId
  })
});

// router.patch('/:productId', (req, res, next) => {
//   res.status(200).json({
//     message: 'Updated product!'
//   })
// });

router.delete('/:orderId', (req, res, next) => {
  res.status(200).json({
    message: 'Order deleted!'
  })
});


module.exports = router;