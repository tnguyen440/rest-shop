const mongoose = require('mongoose');

const orderSchema =  mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  quantity: {
    type: Number,
    default: 1
  }
});

module.exports = mongoose.model('Order', orderSchema);