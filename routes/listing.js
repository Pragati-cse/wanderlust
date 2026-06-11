const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");

const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner } = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const upload = require("../middleware/multer");

// DEBUG (temporary)
console.log("index:", typeof listingController.index);
console.log("search:", typeof listingController.searchListing);
console.log("show:", typeof listingController.showListing);

// 🔥 SAFE ID CHECK MIDDLEWARE (ADD THIS ONCE)
const validateId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    req.flash("error", "Invalid request");
    return res.redirect("/listings");
  }
  next();
};


// SEARCH
router.get("/search", wrapAsync(listingController.searchListing));

// NEW
router.get("/new", isLoggedIn, listingController.renderNewForm);

// INDEX
router.get("/", wrapAsync(listingController.index));

// CREATE
router.post(
  "/",
  isLoggedIn,
  upload.single("image"),
  wrapAsync(listingController.createListing)
);

// SHOW (KEEP LAST)
router.get("/:id", wrapAsync(listingController.showListing));

// EDIT
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing)
);

// UPDATE
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("image"),
  wrapAsync(listingController.updateListing)
);

// DELETE
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.deleteListing)
);

module.exports = router;