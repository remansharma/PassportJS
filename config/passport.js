const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Load User Model
const userModel = require("../models/users");

module.exports = function (passport) {
  // PASSPORT.USE STARTS
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // Match Usr
      userModel
        .findOne({ email: email })
        .then((userFROMdatabase) => {
          if (!userFROMdatabase) {
            return done(null, false, "That email is not registered ");
          }

          // Match password
          bcrypt.compare(
            password,
            userFROMdatabase.password,
            (err, isMatch) => {
              if (err) throw err;
              // isMatch is booleon
              // it will be true is password is correct
              if (isMatch) {
                return done(null, userFROMdatabase);
              } else {
                return done(null, false, "Incorrect Password");
              }
            }
          );
        })
        .catch((err) => console.log(err));
    })
  );
  // PASSPORT.USE ENDS

  // SERIALIZING USER
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // DESERIALIZING USER
  passport.deserializeUser(function (id, done) {
    userModel.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
