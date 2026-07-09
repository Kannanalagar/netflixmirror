const mongoose = require("mongoose");

const WatchlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contentType: {
      type: String,
      enum: ["movie", "tvshow"],
      required: [true, "Please specify content type"],
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Please add content ID"],
      refPath: "contentTypeModel",
    },
    contentTypeModel: {
      type: String,
      required: true,
      enum: ["Movie", "TVShow"],
    },
  },
  { timestamps: true }
);

WatchlistSchema.index({ user: 1, contentId: 1 }, { unique: true });

module.exports = mongoose.model("Watchlist", WatchlistSchema);
