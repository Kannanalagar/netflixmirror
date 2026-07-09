const express = require("express");
const { body, param, query } = require("express-validator");
const Movie = require("../models/Movie");
const validate = require("../middleware/validate");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * /api/movies:
 *   get:
 *     tags: [Movies]
 *     summary: Get all movies with pagination and filtering
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: genre
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: year
 *         schema: { type: integer }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [rating, releaseYear, title, createdAt] }
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc], default: desc }
 *     responses:
 *       200:
 *         description: List of movies
 */
router.get("/", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.genre) filter.genres = req.query.genre;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.year) filter.releaseYear = parseInt(req.query.year, 10);

    const sortField = req.query.sort || "createdAt";
    const sortOrder = req.query.order === "asc" ? 1 : -1;

    const total = await Movie.countDocuments(filter);
    const movies = await Movie.find(filter)
      .populate("genres", "name slug")
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: movies.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: movies,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/movies/{id}:
 *   get:
 *     tags: [Movies]
 *     summary: Get single movie by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Movie details
 *       404:
 *         description: Movie not found
 */
router.get("/:id", async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id).populate(
      "genres",
      "name slug"
    );
    if (!movie) {
      return res
        .status(404)
        .json({ success: false, message: "Movie not found" });
    }
    res.json({ success: true, data: movie });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/movies:
 *   post:
 *     tags: [Movies]
 *     summary: Create a new movie (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, releaseYear, duration, category]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               releaseYear: { type: integer }
 *               duration: { type: integer }
 *               rating: { type: number }
 *               poster: { type: string }
 *               backdrop: { type: string }
 *               trailer: { type: string }
 *               genres: { type: array, items: { type: string } }
 *               category: { type: string }
 *               maturityRating: { type: string }
 *               isTrending: { type: boolean }
 *               isPopular: { type: boolean }
 *               isTopRated: { type: boolean }
 *               isUpcoming: { type: boolean }
 *               cast: { type: array, items: { type: string } }
 *               director: { type: string }
 *               language: { type: string }
 *     responses:
 *       201:
 *         description: Movie created
 *       401:
 *         description: Not authorized
 */
router.post(
  "/",
  protect,
  authorize("admin"),
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description")
      .notEmpty()
      .withMessage("Description is required")
      .isLength({ max: 2000 })
      .withMessage("Description cannot exceed 2000 characters"),
    body("releaseYear")
      .isInt()
      .withMessage("Release year must be a number"),
    body("duration")
      .isInt({ min: 1 })
      .withMessage("Duration must be a positive number"),
    body("category").notEmpty().withMessage("Category is required"),
  ],
  validate,
  async (req, res, next) => {
    try {
      const movie = await Movie.create(req.body);
      res.status(201).json({ success: true, data: movie });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @swagger
 * /api/movies/{id}:
 *   put:
 *     tags: [Movies]
 *     summary: Update a movie (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Movie updated
 *       404:
 *         description: Movie not found
 */
router.put("/:id", protect, authorize("admin"), async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!movie) {
      return res
        .status(404)
        .json({ success: false, message: "Movie not found" });
    }
    res.json({ success: true, data: movie });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/movies/{id}:
 *   delete:
 *     tags: [Movies]
 *     summary: Delete a movie (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Movie deleted
 *       404:
 *         description: Movie not found
 */
router.delete("/:id", protect, authorize("admin"), async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res
        .status(404)
        .json({ success: false, message: "Movie not found" });
    }
    res.json({ success: true, message: "Movie deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
