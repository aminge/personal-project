var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = require('./connect');

// routes for ajax requests go here

router.post('/', function(req, res) {

    pg.connect(connectionString, function(err, client, done) {
        client.query('INSERT INTO goals (name, deadline, description) VALUES ($1, $2, $3)',
            [req.body.name, req.body.deadline, req.body.description],
            function (err, result) {
                if(err) {
                    console.log("Error inserting data: ", err);
                    res.send(false);
                } else {
                    res.send(result);
                }
            }
        );
    });
});

router.get('/', function(req, res) {

    var results = [];

    pg.connect(connectionString, function(err, client, done) {
        var query = client.query('SELECT * FROM goals');

        query.on('row', function(row) {
            results.push(row);
        });
        query.on('end', function() {
            done();
            return res.json(results);
        });
        if(err) {
            console.log(err);
        }
    });
});

module.exports = router;