// 





const User = require("../models/user.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    const newUser = new User({ email, username });

    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);

      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = (req, res) => {
  let redirectUrl = res.locals.redirectUrl || "/listings";

  req.flash("success", "Welcome back to Wanderlust!");
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
};

module.exports.userProfile = async (req, res) => {
  if (!req.user) {
    req.flash("error", "You must be logged in!");
    return res.redirect("/login");
  }

  const user = req.user;

  const listings = await Listing.find({ owner: req.user._id });
  const reviews = await Review.find({ author: req.user._id });

  res.render("users/profile.ejs", { user, listings, reviews });
};