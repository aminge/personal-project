var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = require('./connect');

router.post('/goal', function(req, res) {

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

router.post('/task/:goalID', function(req, res) {
    var goalID = req.params.goalID;

    pg.connect(connectionString, function(err, client, done) {
        client.query('INSERT INTO tasks (name, date, start_time, end_time, goal_id) VALUES ($1, $2, $3, $4, $5)',
            [req.body.name, req.body.date, req.body.start_time, req.body.end_time, goalID],
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
        var query = client.query('SELECT * FROM goals WHERE complete = false');

        query.on('row', function(row) {
            results.push(row);
            // console.log(row);
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

router.get('/complete', function(req, res) {

    var results = [];

    pg.connect(connectionString, function(err, client, done) {
        var query = client.query('SELECT * FROM goals WHERE complete = true');

        query.on('row', function(row) {
            results.push(row);
            // console.log(row);
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

router.get('/tasks/:id', function(req, res) {
    var goalID = req.params.id;
    var results = [];

    pg.connect(connectionString, function(err, client, done) {
        var query = client.query('SELECT * FROM tasks WHERE goal_id = $1', [goalID]);

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

router.delete('/:id', function(req, res) {
    var goalID = req.params.id;

    pg.connect(connectionString, function(err, client, done) {
        client.query('DELETE FROM goals WHERE id = $1',
        [goalID],
        function (err, result) {
            done();
            if(err) {
                console.log("Error deleting data: ", err);
                res.send(false);
            } else {
                res.send(true);
            }
        });
    });
});

router.put('/complete/:id', function(req, res) {
    var goalID = req.params.id;

    pg.connect(connectionString, function(err, client, done) {
        client.query('UPDATE goals SET complete = true, complete_date = NOW() WHERE id = $1',
        [goalID],
        function (err, result) {
            done();
            if(err) {
                console.log("Error deleting data: ", err);
                res.send(false);
            } else {
                res.send(true);
            }
        });
    });
});

module.exports = router;