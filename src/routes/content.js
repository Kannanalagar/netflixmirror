const express = require("express");
const Movie = require("../models/Movie");
const TVShow = require("../models/TVShow");

const router = express.Router();

/**
 * @swagger
 * /api/content/trending:
 *   get:
 *     tags: [Content]
 *     summary: Get trending movies and TV shows
 *     responses:
 *       200:
 *         description: Trending content
 */
router.get("/trending", async (req, res, next) => {
  try {
    const movies = await Movie.find({ isTrending: true })
      .populate("genres", "name slug")
      .sort({ rating: -1 });
    const tvshows = await TVShow.find({ isTrending: true })
      .populate("genres", "name slug")
      .sort({ rating: -1 });

    res.json({
      success: true,
      data: {
        movies,
        tvshows,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/content/popular:
 *   get:
 *     tags: [Content]
 *     summary: Get popular movies and TV shows
 *     responses:
 *       200:
 *         description: Popular content
 */
router.get("/popular", async (req, res, next) => {
  try {
    const movies = await Movie.find({ isPopular: true })
      .populate("genres", "name slug")
      .sort({ rating: -1 });
    const tvshows = await TVShow.find({ isPopular: true })
      .populate("genres", "name slug")
      .sort({ rating: -1 });

    res.json({
      success: true,
      data: {
        movies,
        tvshows,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/content/top-rated:
 *   get:
 *     tags: [Content]
 *     summary: Get top-rated movies and TV shows
 *     responses:
 *       200:
 *         description: Top-rated content
 */
router.get("/top-rated", async (req, res, next) => {
  try {
    const movies = await Movie.find({ isTopRated: true })
      .populate("genres", "name slug")
      .sort({ rating: -1 });
    const tvshows = await TVShow.find({ isTopRated: true })
      .populate("genres", "name slug")
      .sort({ rating: -1 });

    res.json({
      success: true,
      data: {
        movies,
        tvshows,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/content/upcoming:
 *   get:
 *     tags: [Content]
 *     summary: Get upcoming movies
 *     responses:
 *       200:
 *         description: Upcoming content
 */
router.get("/upcoming", async (req, res, next) => {
  try {
    const movies = await Movie.find({ isUpcoming: true })
      .populate("genres", "name slug")
      .sort({ releaseYear: 1 });

    res.json({
      success: true,
      data: { movies },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
