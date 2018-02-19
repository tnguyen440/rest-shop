const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const productsController = require('../controllers/products');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() +  file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
   fieldSize: 1024 *1024 * 5
  },
  fileFilter: fileFilter
});

const Product = require('../models/product');

// get all products
router.get('/', productsController.products_get_all);

// create product
router.post('/', checkAuth, upload.single('productImage'), productsController.products_create);

// get product details
router.get('/:productId', productsController.products_get_product);

// update
router.patch('/:productId', checkAuth, productsController.products_update);

// delete
router.delete('/:productId', checkAuth, productsController.products_delete);

module.exports = router;