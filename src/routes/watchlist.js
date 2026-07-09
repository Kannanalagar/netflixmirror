const express = require("express");
const Watchlist = require("../models/Watchlist");
const { protect } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * /api/watchlist:
 *   get:
 *     tags: [Watchlist]
 *     summary: Get user's watchlist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: contentType
 *         schema: { type: string, enum: [movie, tvshow] }
 *     responses:
 *       200:
 *         description: User's watchlist
 *       401:
 *         description: Not authorized
 */
router.get("/", protect, async (req, res, next) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.contentType) filter.contentType = req.query.contentType;

    const watchlist = await Watchlist.find(filter)
      .populate({
        path: "contentId",
        select:
          "title description rating poster releaseYear category genres isTrending",
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, count: watchlist.length, data: watchlist });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/watchlist:
 *   post:
 *     tags: [Watchlist]
 *     summary: Add content to watchlist
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [contentType, contentId]
 *             properties:
 *               contentType:
 *                 type: string
 *                 enum: [movie, tvshow]
 *               contentId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Added to watchlist
 *       400:
 *         description: Already in watchlist
 *       404:
 *         description: Content not found
 */
router.post("/", protect, async (req, res, next) => {
  try {
    const { contentType, contentId } = req.body;

    if (!contentType || !contentId) {
      return res.status(400).json({
        success: false,
        message: "Please provide contentType and contentId",
      });
    }

    if (!["movie", "tvshow"].includes(contentType)) {
      return res.status(400).json({
        success: false,
        message: "contentType must be 'movie' or 'tvshow'",
      });
    }

    const contentTypeModel = contentType === "movie" ? "Movie" : "TVShow";

    const existing = await Watchlist.findOne({
      user: req.user._id,
      contentId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Content already in watchlist",
      });
    }

    const watchlistItem = await Watchlist.create({
      user: req.user._id,
      contentType,
      contentId,
      contentTypeModel,
    });

    res.status(201).json({ success: true, data: watchlistItem });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/watchlist/{id}:
 *   delete:
 *     tags: [Watchlist]
 *     summary: Remove content from watchlist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Removed from watchlist
 *       404:
 *         description: Item not found
 */
router.delete("/:id", protect, async (req, res, next) => {
  try {
    const watchlistItem = await Watchlist.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!watchlistItem) {
      return res.status(404).json({
        success: false,
        message: "Watchlist item not found",
      });
    }

    await watchlistItem.deleteOne();
    res.json({ success: true, message: "Removed from watchlist" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
