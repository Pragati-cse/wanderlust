const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const Listing = require("../models/listing");

// CREATE
module.exports.createListing = async (req, res) => {
  let listing = new Listing(req.body.listing);

  if (!req.user) {
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }

  listing.owner = req.user._id;

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await listing.save();

  req.flash("success", "Listing created");
  res.redirect("/listings");
};

// INDEX
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// NEW
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};


// SHOW (SAFE)

module.exports.showListing = async (req, res) => {
  let { id } = req.params;

  // ❌ invalid ID protection
  if (!mongoose.Types.ObjectId.isValid(id)) {
    req.flash("error", "Invalid listing id");
    return res.redirect("/listings");
  }

  let listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

// EDIT (SAFE)
module.exports.editListing = async (req, res) => {
  let { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    req.flash("error", "Invalid listing id");
    return res.redirect("/listings");
  }

  let listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  res.render("listings/edit.ejs", { listing });
};

// UPDATE

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    req.flash("error", "Invalid listing id");
    return res.redirect("/listings");
  }

  let listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  Object.assign(listing, req.body.listing);

  if (req.file) {
    try {
      if (listing.image?.filename) {
        await cloudinary.uploader.destroy(listing.image.filename);
      }

      listing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    } catch (err) {
      console.log("Cloudinary error:", err.message);
    }
  }

  await listing.save();

  req.flash("success", "Listing updated successfully");
  res.redirect(`/listings/${id}`);
};

// DELETE
module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;

  let listing = await Listing.findById(id);

  if (listing.image?.filename) {
    await cloudinary.uploader.destroy(listing.image.filename);
  }

  await Listing.findByIdAndDelete(id);

  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};

// SEARCH
module.exports.searchListing = async (req, res) => {
  let { q } = req.query;

  let allListings = !q
    ? await Listing.find({})
    : await Listing.find({
        $or: [
          { title: { $regex: q, $options: "i" } },
          { location: { $regex: q, $options: "i" } },
          { country: { $regex: q, $options: "i" } },
        ],
      });

  res.render("listings/index.ejs", {
    allListings,
    searchQuery: q || "",
  });
};