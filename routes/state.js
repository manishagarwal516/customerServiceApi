var express = require('express');
var router = express.Router();
var state = require('../controllers/stateController.js'); 

/* GET users listing. */
router.get('/', function(req, res, next) {
	state.getAction(req, function(data){
        res.send(data);
    });
});

module.exports = router;
