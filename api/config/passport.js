const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("User");

passport.use(
  new LocalStrategy(
    {
      usernameField: "name",
      passwordField: "password",
    },
    (username, password, cbDone) => {
      User.findOne({ name: username }, (err, user) => {
        if (err) return cbDone(err);
        if (!user)
          return cbDone(null, false, { message: "Incorrect username." });
        if (!user.validPassword(password))
          return cbDone(null, false, { message: "Incorrect password." });
        else return cbDone(null, user);
      });
    }
  )
);