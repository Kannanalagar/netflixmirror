const express = require("express");
const Movie = require("../models/Movie");
const TVShow = require("../models/TVShow");

const router = express.Router();

/**
 * @swagger
 * /api/search:
 *   get:
 *     tags: [Search]
 *     summary: Search movies and TV shows by title, genre, or release year
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Search query (title text search)
 *       - in: query
 *         name: genre
 *         schema: { type: string }
 *         description: Genre ID to filter by
 *       - in: query
 *         name: year
 *         schema: { type: integer }
 *         description: Release year to filter by
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [movie, tvshow, all], default: all }
 *         description: Content type to search
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Search results
 */
router.get("/", async (req, res, next) => {
  try {
    const { q, genre, year, type = "all" } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const results = [];
    const buildFilter = () => {
      const filter = {};
      if (q) filter.$text = { $search: q };
      if (genre) filter.genres = genre;
      if (year) filter.releaseYear = parseInt(year, 10);
      return filter;
    };

    const filter = buildFilter();

    if (type === "movie" || type === "all") {
      const movies = await Movie.find(filter)
        .populate("genres", "name slug")
        .sort({ rating: -1 })
        .skip(type === "all" ? 0 : skip)
        .limit(type === "all" ? 50 : limit);

      results.push(
        ...movies.map((m) => ({ ...m.toObject(), _type: "movie" }))
      );
    }

    if (type === "tvshow" || type === "all") {
      const tvshows = await TVShow.find(filter)
        .populate("genres", "name slug")
        .sort({ rating: -1 })
        .skip(type === "all" ? 0 : skip)
        .limit(type === "all" ? 50 : limit);

      results.push(
        ...tvshows.map((t) => ({ ...t.toObject(), _type: "tvshow" }))
      );
    }

    results.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    const total = results.length;
    const paginated = results.slice(skip, skip + limit);

    res.json({
      success: true,
      count: paginated.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: paginated,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
