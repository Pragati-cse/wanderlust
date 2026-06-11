// const mongoose = require("mongoose");
// const Review = require("./review.js");
// const Schema = mongoose.Schema;

// const listingSchema = new Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true,
//   },

//   description: {
//     type: String,
//     trim: true,
//   },

//   image: {
//     filename: {
//       type: String,
//       default: "listingimage",
//     },
//     url: {
//       type: String,
//       default:
//         "https://plus.unsplash.com/premium_photo-1755882941156-b8d4490b71cb?q=80&w=685&auto=format&fit=crop",
//     },
//   },

//   price: {
//     type: Number,
//     min: 0,
//   },

//   location: String,
//   country: String,

//   owner: {
//     type: Schema.Types.ObjectId,
//     ref: "User",
//     required: true,   // 🔥 IMPORTANT FIX
//   },

//   reviews: [
//     {
//       type: Schema.Types.ObjectId,
//       ref: "Review",
//     },
//   ],

//   avgRating: {
//     type: Number,
//     default: 0,
//   },

//   reviewCount: {
//     type: Number,
//     default: 0,
//   },
// });

// listingSchema.post("findOneAndDelete", async (listing) => {
//   if (listing) {
//     await Review.deleteMany({ _id: { $in: listing.reviews } });
//   }
// });

// const Listing = mongoose.model("Listing", listingSchema);
// module.exports = Listing;










const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    trim: true,
  },

  image: {
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      default:
        "https://plus.unsplash.com/premium_photo-1755882941156-b8d4490b71cb?q=80&w=685&auto=format&fit=crop",
    },
  },

  price: {
    type: Number,
    min: 0,
  },

  location: String,
  country: String,

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

  avgRating: {
    type: Number,
    default: 0,
  },

  reviewCount: {
    type: Number,
    default: 0,
  },
});

// cleanup hook
listingSchema.post("findOneAndDelete", async (listing) => {
  if (!listing) return;

  const Review = mongoose.model("Review");
  await Review.deleteMany({ _id: { $in: listing.reviews } });
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;