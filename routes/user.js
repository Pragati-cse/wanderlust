







// const express = require("express");
// const router = express.Router();

// const passport = require("passport");
// const userController = require("../controllers/users.js");

// const { isLoggedIn } = require("../middleware.js");

// // Signup
// router.get("/signup", userController.renderSignupForm);
// router.post("/signup", userController.signup);

// // Login
// router.get("/login", userController.renderLoginForm);
// router.post(
//   "/login",
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   userController.login
// );

// // Logout
// router.get("/logout", userController.logout);

// //  PROFILE PAGE (NEW)
// router.get("/profile", isLoggedIn, userController.userProfile);

// module.exports = router;



const express = require("express");
const router = express.Router();

const passport = require("passport");
const userController = require("../controllers/users.js");
const { isLoggedIn } = require("../middleware.js");

// Signup
router.get("/signup", userController.renderSignupForm);
router.post("/signup", userController.signup);

// Login
router.get("/login", userController.renderLoginForm);
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);

// Logout
router.get("/logout", userController.logout);

// Profile
router.get("/profile", isLoggedIn, userController.userProfile);

module.exports = router;