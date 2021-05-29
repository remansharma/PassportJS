const { render } = require("ejs");
const express = require("express");
const user = require("../models/users");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { checkLoginStatus } = require("../config/auth");

// User Model
const USER = require("../models/users");

// Login Page
router.get("/login", checkLoginStatus, (req, res) => res.render("login"));

// Register Page
router.get("/register", (req, res) => res.render("register"));

// Register Handle
router.post("/register", (req, res) => {
  // Destructuring
  const { name, email, password, password2 } = req.body;
  let errors = [];

  // Check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }

  // Check passwords match
  if (password !== password2) {
    errors.push({ msg: "Password do not match" });
  }

  // Check pass length
  if (password.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters" });
  }

  //
  if (errors.length > 0) {
    return res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    // Validation passed
    user.findOne({ email: email }).then((user) => {
      if (user) {
        // User Exists
        errors.push({ msg: "Email is already Registered" });
        return res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new USER({
          name,
          email,
          password,
        });

        // Hash Password
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(newUser.password, salt, function (err, hash) {
            // console.log(hash);
            (err) => console.log(err);
            // Set Password To Hashed Password
            newUser.password = hash;

            // Save User
            newUser
              .save()
              .then((user) => {
                // console.log(user);
                // console.log("SAVED");
                req.flash(
                  "success_msg",
                  "You are now registered and can login."
                );
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

router.get("/logout", function (req, res) {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

// MOST IMPORTANT LINE
module.exports = router;
