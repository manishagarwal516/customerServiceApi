var express = require('express');
var router = express.Router();
var customer = require('../controllers/customerController.js'); 

/* GET users listing. */
router.get('/', function(req, res, next) {
  	customer.getAction(req, function(data){
        res.send(data);
    });
});

module.exports = router;
