const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const bCrypt = require("bcrypt-nodejs");

module.exports = function (passport) {
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      function (req, username, password, done) {
        username = username.toLowerCase();
        User.findOne({ email: username })
          .catch((err) => {
            return done(err);
          })
          .then((user) => {
            if (!user) {
              console.log("User Not Found with username " + username);
              return done(null, false, "Invalid Username");
            }
            if (user && user.password) {
              console.log("No Password");
              return done(null, false, "No Password");
            }
            if (!isValidPassword(user, password)) {
              console.log("Invalid Password");
              return done(null, false, "Invalid Password");
            }
            if (isValidPassword(user, password)) {
              return done(null, user);
            }
          });
      }
    )
  );
  const isValidPassword = function (user, password) {
    return bCrypt.compareSync(password, user.password);
  };
};
