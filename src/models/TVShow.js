const mongoose = require("mongoose");

const TVShowSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
      index: "text",
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    releaseYear: {
      type: Number,
      required: [true, "Please add a release year"],
    },
    numberOfSeasons: {
      type: Number,
      required: [true, "Please add number of seasons"],
      min: 1,
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    poster: {
      type: String,
      default: "",
    },
    backdrop: {
      type: String,
      default: "",
    },
    genres: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Genre",
      },
    ],
    category: {
      type: String,
      required: [true, "Please add a category"],
      enum: [
        "action",
        "comedy",
        "drama",
        "horror",
        "sci-fi",
        "thriller",
        "romance",
        "animation",
        "documentary",
        "family",
      ],
    },
    maturityRating: {
      type: String,
      enum: ["G", "PG", "PG-13", "R", "NC-17"],
      default: "PG-13",
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    isTopRated: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["ongoing", "ended", "cancelled"],
      default: "ongoing",
    },
    cast: [{ type: String }],
    language: { type: String, default: "English" },
  },
  { timestamps: true }
);

TVShowSchema.index({ title: "text", description: "text" });
TVShowSchema.index({ releaseYear: 1 });
TVShowSchema.index({ rating: -1 });
TVShowSchema.index({ category: 1 });
TVShowSchema.index({ isTrending: 1 });
TVShowSchema.index({ isPopular: 1 });
TVShowSchema.index({ isTopRated: 1 });

module.exports = mongoose.model("TVShow", TVShowSchema);
