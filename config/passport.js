// I don't think I need this file. Anywhere that calls it should instead call strategies/user.js

// load all the things we need
var passport = require('passport');

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// load up the user model
var User = require('../models/user');

// load the auth variables
var configAuth = require('./auth'); // use this one for testing

module.exports = function(passport) {

    // passport session setup
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session

    passport.serializeUser(function(user, done) {
        // console.log(user);
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        // find user in the SQL database

        User.findById(id, function(err, user) {

            //this should still be the callback - still need to call done
            done(err, user);
        });
    });

    // GOOGLE
    passport.use(new GoogleStrategy({

            clientID        : configAuth.googleAuth.clientID,
            clientSecret    : configAuth.googleAuth.clientSecret,
            callbackURL     : configAuth.googleAuth.callbackURL,
            passReqToCallback : true
        // allows us to pass in the req from our route (lets us check if a user is logged in or not)

        },
        function(req, token, refreshToken, profile, done) {
            // asynchronous
            process.nextTick(function() {
                // check if the user is already logged in
                if (!req.user) {

                    // find user in the database by google_id
                    // will have to save google ids in the database
                    User.findOne({ 'google_id' : profile.id }, function(err, user) {
                        if (err)
                            return done(err);

                        if (user) {

                            // if there is a user id already but no token (user was linked at one point and then removed)
                            if (!user.token) {
                                console.log('token thing');
                                user.token = token;
                                user.name  = profile.displayName;
                                user.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                                // SQL update instead of user.save
                                user.save(function(err) {
                                    if (err)
                                        return done(err);

                                    return done(null, user);
                                });
                            }

                            return done(null, user);
                        } else {
                            console.log('new user created');

                            // instead, insert a new user into the users table

                            var newUser = new User();

                            newUser.google_id = profile.id;
                            newUser.token = token;
                            newUser.name  = profile.displayName;
                            newUser.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                            newUser.save(function(err) {
                                if (err)
                                    return done(err);

                                return done(null, newUser);
                            });
                        }
                    });

                } else {
                    // user already exists and is logged in, we have to link accounts
                    console.log('link thing');
                    var user = req.user; // pull the user out of the session

                    user.google_id = profile.id;
                    user.token = token;
                    user.name  = profile.displayName;
                    user.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                    // update user in table with the data above
                    user.save(function(err) {
                        if (err)
                            return done(err);

                        return done(null, user);
                    });
                }
            });
        }));
};