var express = require('express');
var router = express.Router();
var user = require('../controllers/userController.js'); 

/* GET users listing. */
router.post('/logout', function(req, res, next) {
  	user.logout(req, function(data){
        res.send(data);
    });
});

module.exports = router;
