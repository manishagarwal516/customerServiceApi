var express = require('express');
var router = express.Router();
var customer = require('../controllers/customerController.js'); 

/* GET users listing. */
router.get('/', function(req, res, next) {
  	customer.getAction(req, function(data){
        res.send(data);
    });
});

router.post('/', function(req, res, next) {
  	customer.postAction(req, function(data){
        res.send(data);
    });
});

router.put('/:id', function(req, res, next) {
  	customer.putAction(req, function(data){
        res.send(data);
    });
});

router.get('/:id', function(req, res, next) {
  	customer.getCustomerDetail(req, function(data){
        res.send(data);
    });
});

router.get('/:id/orders', function(req, res, next) {
  	customer.getCustomerOrders(req, function(data){
        res.send(data);
    });
});

module.exports = router;
