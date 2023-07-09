// const USERNAME = "a@secure.com";

// Third party packages
require("dotenv").config();
const express = require("express");
// const authRoutes = require("./routes/auth");
const session = require("express-session");
const mongoose = require("mongoose");
const passport = require("passport");
// const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
// utility method for ease
// const findOrCreate = require("mongoose-findorcreate");

const app = express();
const { Schema, model } = mongoose;
const { User } = require("./models/user");

// MiddleWare
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.set("view engine", "ejs");

// Set up session middleware
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// MongoDB connectivity
mongoose
  .connect("mongodb://127.0.0.1:27017/todoDB", {
    useNewUrlParser: true,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport.js local strategy
passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(function (user, done) {
  process.nextTick(function () {
    done(null, user.id);
  });
});

passport.deserializeUser(function (id, done) {
  process.nextTick(async function () {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/tasks",
    },
    function (accessToken, refreshToken, profile, cb) {
      //   console.log(profile);
      const email = profile.emails[0].value;
      User.findOrCreate(
        {
          googleId: profile.id,
          username: email,
          displayName: profile.displayName,
        },
        function (err, user) {
          return cb(err, user);
        }
      );
    }
  )
);

// its important to use this after passport config
const tasksRoutes = require("./routes/tasks");
app.use("/tasks", tasksRoutes);

app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/tasks/today");
  }
  res.render("home");
});

app
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post((req, res) => {
    User.register(
      {
        username: req.body.username,
        displayName: req.body.displayName,
        tasks: [],
      },
      req.body.password,
      function (err, user) {
        if (err) {
          console.log(err);
          res.redirect("/register");
        } else {
          passport.authenticate("local")(req, res, function () {
            res.redirect("/tasks/today");
          });
        }
      }
    );
  });

app
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });
    req.login(user, function (err) {
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/tasks/today");
        });
      }
    });
  });

app.get("/auth/google", (req, res, next) => {
  //   console.log("in /auth/google");
  passport.authenticate("google", { scope: ["openid", "email", "profile"] })(
    req,
    res,
    next
  );
});

app.get(
  "/auth/google/tasks",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect to secrets.
    res.redirect("/tasks/today");
  }
);

app.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
