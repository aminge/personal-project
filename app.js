var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var pg = require('pg');
var dataRoute = require('./routes/data');
//var passport = require('passport');
var auth = require('./routes/auth');
var session = require('express-session');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//////////////

//var mongoose = require('mongoose');
//var Schema = mongoose.Schema;
//var contactlist = require('./routes/contact');


var passport = require('./routes/user'); // pass passport for configuration

// mongoose.connect('mongodb://localhost/bbupdata'); //should put connectionString in here instead of the actual link. Require the route in the page.

// this is for the calendar api
app.get('https://www.googleapis.com/calendar/v3/calendars/primary/events?key=AIzaSyCFvSdVmtOo90Ix46P280K_n7zr5iyh6ZM', function(req, res) {
    console.log('calendar event list: ', res);
    (function sendData (err, data) {
        if (err) {
            console.log('ERROR:', err);
        }
        res.send(data);
    }());
});

// Passport Session Configuration //
app.use(session({
    secret: 'secret',
    key: 'user',
    resave: 'true',
    saveUninitialized: false,
    cookie: {maxage: 60000, secure: false}
}));

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());


require('./routes/auth.js')(app, passport); // load our routes and pass in our app and fully configured passport
//require('./routes/contact.js')(app, passport);

//////////////

app.use('/data', dataRoute);

app.use(express.static('public'));
app.use(express.static('public/views'));
app.use(express.static('public/scripts'));
app.use(express.static('public/styles'));
app.use(express.static('public/vendors'));

app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), function() {
    console.log('Listening on port: ', app.get('port'));
});