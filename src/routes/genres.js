const express = require("express");
const { body } = require("express-validator");
const Genre = require("../models/Genre");
const validate = require("../middleware/validate");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * /api/genres:
 *   get:
 *     tags: [Genres]
 *     summary: Get all genres
 *     responses:
 *       200:
 *         description: List of genres
 */
router.get("/", async (req, res, next) => {
  try {
    const genres = await Genre.find().sort({ name: 1 });
    res.json({ success: true, count: genres.length, data: genres });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/genres/{id}:
 *   get:
 *     tags: [Genres]
 *     summary: Get single genre
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Genre details
 *       404:
 *         description: Genre not found
 */
router.get("/:id", async (req, res, next) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre) {
      return res
        .status(404)
        .json({ success: false, message: "Genre not found" });
    }
    res.json({ success: true, data: genre });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/genres:
 *   post:
 *     tags: [Genres]
 *     summary: Create a new genre (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *     responses:
 *       201:
 *         description: Genre created
 */
router.post(
  "/",
  protect,
  authorize("admin"),
  [body("name").notEmpty().withMessage("Genre name is required")],
  validate,
  async (req, res, next) => {
    try {
      const genre = await Genre.create(req.body);
      res.status(201).json({ success: true, data: genre });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @swagger
 * /api/genres/{id}:
 *   put:
 *     tags: [Genres]
 *     summary: Update a genre (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Genre updated
 */
router.put("/:id", protect, authorize("admin"), async (req, res, next) => {
  try {
    const genre = await Genre.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!genre) {
      return res
        .status(404)
        .json({ success: false, message: "Genre not found" });
    }
    res.json({ success: true, data: genre });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/genres/{id}:
 *   delete:
 *     tags: [Genres]
 *     summary: Delete a genre (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Genre deleted
 */
router.delete("/:id", protect, authorize("admin"), async (req, res, next) => {
  try {
    const genre = await Genre.findByIdAndDelete(req.params.id);
    if (!genre) {
      return res
        .status(404)
        .json({ success: false, message: "Genre not found" });
    }
    res.json({ success: true, message: "Genre deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
