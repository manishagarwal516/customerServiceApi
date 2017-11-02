var express = require('express');
var router = express.Router();
var order = require('../controllers/orderController.js'); 


/* GET users listing. */
router.get('/', function(req, res, next) {
	order.getAction(req, function(data){
        res.send(data);
    });
});

router.post('/', function(req, res, next) {
	order.postAction(req, function(data){
        res.send(data);
    });
});

module.exports = router;
