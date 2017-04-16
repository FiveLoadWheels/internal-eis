var express = require('express');
var router = express.Router();

router.get('/', function() {
    res.render('finance');
});

module.exports = router;