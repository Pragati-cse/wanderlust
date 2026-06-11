// const Listing = require("../models/listing");
// const Review = require("../models/review");

// // CREATE REVIEW
// module.exports.createReview = async (req, res) => {
//   let { id } = req.params;

//   let listing = await Listing.findById(id);

//   if (!listing) {
//     req.flash("error", "Listing not found");
//     return res.redirect("/listings");
//   }

//   let review = new Review(req.body.review);
//   review.author = req.user._id;

//   await review.save();

//   listing.reviews.push(review._id);

//   // update rating properly
//   const allReviews = await Review.find({ _id: { $in: listing.reviews } });

//   let total = allReviews.reduce((sum, r) => sum + r.rating, 0);

//   listing.reviewCount = allReviews.length;
//   listing.avgRating = allReviews.length ? total / allReviews.length : 0;

//   await listing.save();

//   req.flash("success", "Review added!");
//   res.redirect(`/listings/${id}`);
// };

// // DELETE REVIEW
// module.exports.deleteReview = async (req, res) => {
//   let { id, reviewId } = req.params;

//   await Listing.findByIdAndUpdate(id, {
//     $pull: { reviews: reviewId },
//   });

//   await Review.findByIdAndDelete(reviewId);

//   let listing = await Listing.findById(id);

//   const allReviews = await Review.find({ _id: { $in: listing.reviews } });

//   let total = allReviews.reduce((sum, r) => sum + r.rating, 0);

//   listing.reviewCount = allReviews.length;
//   listing.avgRating = allReviews.length ? total / allReviews.length : 0;

//   await listing.save();

//   req.flash("success", "Review deleted!");
//   res.redirect(`/listings/${id}`);
// };









const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.createReview = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  const review = new Review(req.body.review);

  review.author = req.user._id;

  await review.save();

  listing.reviews.push(review._id);

  await listing.save();

  req.flash("success", "Review added successfully");
  res.redirect(`/listings/${id}`);
};