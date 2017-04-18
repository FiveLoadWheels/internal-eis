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
        title: 'User #' + user.id,
        personnelPage: {
            users: req.query.filter ? [user] : users,
            user: user
        }
    })
});

router.post('/handle/:id', (req, res) => {
    let user = users.find(u => u.id === Number(req.params.id));
    let action = req.body;
    switch (action.type) {
    case 'MODIFY_USER':

    break;

    case 'DELETE_USER':

    break;
    }
})

module.exports = router;