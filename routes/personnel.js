var express = require('express');
var router = express.Router();

var users = require('../storage/__fake').users;

router.get('/', (req, res) => {
    res.render('personnel', {
        title: 'HR',
        personnelPage: {
            users: users
        }
    });
});

router.get('/view/:id', (req, res) => {
    let user = users.find(u => u.id === Number(req.params.id));
    res.render('personnel', {
        title: 'HR',
        personnelPage: {
            users: users,
            user: user
        }
    })
});

module.exports = router;