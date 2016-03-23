var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = require('./connect');
var passport = require('passport');

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

router.get('/alltasks', function(req, res) {

    var results = [];

    pg.connect(connectionString, function(err, client, done) {
        var query = client.query('SELECT * FROM tasks');

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

router.put('/edit', function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        client.query('UPDATE goals SET name = $1, deadline = $2, description = $3 WHERE id = $4',
        [req.body.name, req.body.deadline, req.body.description, req.body.id],
        function(err, result) {
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

router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email', 'https://www.googleapis.com/auth/calendar'] }));

//function isLoggedIn(req, res, next) {
//    // console.log('auth.js: ', req.isAuthenticated());
//    if (req.isAuthenticated() && req.user.token !== undefined)
//        return next();
//    // console.log('user logged in::', req.user);
//    res.redirect('/');
//}

// the callback after google has authenticated the user
router.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect : '/home',
        failureRedirect : '/'
    })
);

router.get('/auth/logout', isLoggedIn, function(req, res) {
    var user = req.user;

    user.token = undefined;
    user.save(function(err) {
        // console.log(user, ' has been successfully logged out.');
        // res.redirect('/');
        req.logout();
        res.redirect('https://accounts.google.com/logout?continue=https://appengine.google.com/_ah/logout?continue=http://localhost:5000');
    });
    // req.session.destroy();

    // req.redirect('/');
});

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    // console.log('user logged in::', req.user);
    res.redirect('/');
}

router.get('/home', isLoggedIn, function(req, res) {
    // console.log('user logged in :: ', req.user);
    res.sendFile(path.resolve(__dirname, '../public/views/home.html'));
});

module.exports = router;