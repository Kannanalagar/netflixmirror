const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema(
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
    duration: {
      type: Number,
      required: [true, "Please add duration in minutes"],
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
    trailer: {
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
      enum: ["G", "PG", "PG-13", "R", "NC-17", "TV-Y", "TV-Y7", "TV-G", "TV-PG", "TV-14", "TV-MA"],
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
    isUpcoming: {
      type: Boolean,
      default: false,
    },
    cast: [{ type: String }],
    director: { type: String, default: "" },
    language: { type: String, default: "English" },
  },
  { timestamps: true }
);

MovieSchema.index({ title: "text", description: "text" });
MovieSchema.index({ releaseYear: 1 });
MovieSchema.index({ rating: -1 });
MovieSchema.index({ category: 1 });
MovieSchema.index({ isTrending: 1 });
MovieSchema.index({ isPopular: 1 });
MovieSchema.index({ isTopRated: 1 });
MovieSchema.index({ isUpcoming: 1 });

module.exports = mongoose.model("Movie", MovieSchema);
