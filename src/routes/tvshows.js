const express = require("express");
const { body } = require("express-validator");
const TVShow = require("../models/TVShow");
const validate = require("../middleware/validate");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * /api/tvshows:
 *   get:
 *     tags: [TV Shows]
 *     summary: Get all TV shows with pagination and filtering
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
 *         schema: { type: string, enum: [rating, releaseYear, title, numberOfSeasons, createdAt] }
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc], default: desc }
 *     responses:
 *       200:
 *         description: List of TV shows
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

    const total = await TVShow.countDocuments(filter);
    const tvshows = await TVShow.find(filter)
      .populate("genres", "name slug")
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: tvshows.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: tvshows,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/tvshows/{id}:
 *   get:
 *     tags: [TV Shows]
 *     summary: Get single TV show by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: TV show details
 *       404:
 *         description: TV show not found
 */
router.get("/:id", async (req, res, next) => {
  try {
    const tvshow = await TVShow.findById(req.params.id).populate(
      "genres",
      "name slug"
    );
    if (!tvshow) {
      return res
        .status(404)
        .json({ success: false, message: "TV show not found" });
    }
    res.json({ success: true, data: tvshow });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/tvshows:
 *   post:
 *     tags: [TV Shows]
 *     summary: Create a new TV show (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, releaseYear, numberOfSeasons, category]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               releaseYear: { type: integer }
 *               numberOfSeasons: { type: integer }
 *               rating: { type: number }
 *               poster: { type: string }
 *               genres: { type: array, items: { type: string } }
 *               category: { type: string }
 *               maturityRating: { type: string }
 *               isTrending: { type: boolean }
 *               isPopular: { type: boolean }
 *               isTopRated: { type: boolean }
 *               status: { type: string, enum: [ongoing, ended, cancelled] }
 *               cast: { type: array, items: { type: string } }
 *               language: { type: string }
 *     responses:
 *       201:
 *         description: TV show created
 */
router.post(
  "/",
  protect,
  authorize("admin"),
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("releaseYear").isInt().withMessage("Release year must be a number"),
    body("numberOfSeasons")
      .isInt({ min: 1 })
      .withMessage("Number of seasons must be at least 1"),
    body("category").notEmpty().withMessage("Category is required"),
  ],
  validate,
  async (req, res, next) => {
    try {
      const tvshow = await TVShow.create(req.body);
      res.status(201).json({ success: true, data: tvshow });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @swagger
 * /api/tvshows/{id}:
 *   put:
 *     tags: [TV Shows]
 *     summary: Update a TV show (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: TV show updated
 */
router.put("/:id", protect, authorize("admin"), async (req, res, next) => {
  try {
    const tvshow = await TVShow.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!tvshow) {
      return res
        .status(404)
        .json({ success: false, message: "TV show not found" });
    }
    res.json({ success: true, data: tvshow });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/tvshows/{id}:
 *   delete:
 *     tags: [TV Shows]
 *     summary: Delete a TV show (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: TV show deleted
 */
router.delete("/:id", protect, authorize("admin"), async (req, res, next) => {
  try {
    const tvshow = await TVShow.findByIdAndDelete(req.params.id);
    if (!tvshow) {
      return res
        .status(404)
        .json({ success: false, message: "TV show not found" });
    }
    res.json({ success: true, message: "TV show deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
