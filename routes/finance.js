var express = require('express');
var router = express.Router();

var records = require('../storage/__fake').records;

router.get('/', function(req, res) {
    res.render('finance', {
        title: 'Finance Records',
        financePage: {
            records: records
        }
    });
});

router.get('/search', function(req, res) {
    var recs = records;
    var results = new Array;
    if (req.query.id) {
        results.push( recs.find( r => r.id === Number(req.query.id)));
    } else {
        if (req.query.StartTime) {
            recs = recs.filter(r => r.ctime >= req.query.StartTime);
        }
        if (req.query.EndTime) {
            recs = recs.filter(r => r.ctime <= req.query.EndTime);
        }
        if (req.query.type) {
            recs = recs.filter( (r) => {
                return r.type === req.query.type;
            });
        }
        if (req.query.StartAmount) {
            recs = recs.filter(r => r.amount >= req.query.StartAmount);
        }
        if (req.query.EndAmount) {
            recs = recs.filter(r => r.amount <= req.query.EndTime);
        }
        results = recs;
    }

    res.render('finance', {
        title: 'Finance Records',
        financePage: {
            records: results
        }
    });
});

module.exports = router;