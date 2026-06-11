
require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError.js");

const listingsRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const multer = require("multer");
const { storage } = require("./utils/cloudConfig.js");
const upload = multer({ storage });

const { MongoStore } = require("connect-mongo");

const dbUrl = process.env.MONGO_URL;

// DB connection
mongoose
  .connect(dbUrl)
  .then(() => console.log("connected to DB"))
  .catch((err) => console.log(err));

// view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));



const store = MongoStore.create({
  mongoUrl: process.env.MONGO_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});


// session
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOptions));
app.use(flash());



// passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// locals
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// routes
app.use("/", userRouter);
app.use("/listings", listingsRouter);
app.use("/listings", reviewRouter);
app.use("/listings/:id/reviews", reviewRouter);



// // root
// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });


// demo
app.get("/demouser", (req, res) => {
  res.send(req.user);
});

app.get("/", (req, res) => {
  res.redirect("/listings");
});

// 404
app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "page not found"));
});


// error handler
app.use((err, req, res, next) => {
  console.log("FULL ERROR:", err);

  let { statusCode = 500, message = "Something went wrong" } = err;

  res.status(statusCode).render("error.ejs", { message });
});


// server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});