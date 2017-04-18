var express = require('express');
var router = express.Router();

var users = require('../storage/__fake').users;

router.get('/', (req, res) => {
    res.render({
        title: 'HR',
        personnelPage: {
            users: users
        }
    });
});

module.exports = router;