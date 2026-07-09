const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const connectDB = require("./src/config/db");
const errorHandler = require("./src/middleware/errorHandler");

dotenv.config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Netflix Clone API",
      version: "1.0.0",
      description:
        "A Netflix-style streaming platform REST API with authentication, movies, TV shows, search, filtering, and watchlist features.",
      contact: { name: "API Support" },
    },
    servers: [{ url: `http://localhost:${process.env.PORT || 5000}` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            role: { type: "string", enum: ["user", "admin"] },
          },
        },
        Movie: {
          type: "object",
          properties: {
            _id: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            releaseYear: { type: "integer" },
            duration: { type: "integer" },
            rating: { type: "number" },
            poster: { type: "string" },
            backdrop: { type: "string" },
            trailer: { type: "string" },
            genres: { type: "array", items: { type: "string" } },
            category: { type: "string" },
            maturityRating: { type: "string" },
            isTrending: { type: "boolean" },
            isPopular: { type: "boolean" },
            isTopRated: { type: "boolean" },
            isUpcoming: { type: "boolean" },
          },
        },
        TVShow: {
          type: "object",
          properties: {
            _id: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            releaseYear: { type: "integer" },
            numberOfSeasons: { type: "integer" },
            rating: { type: "number" },
            poster: { type: "string" },
            backdrop: { type: "string" },
            genres: { type: "array", items: { type: "string" } },
            category: { type: "string" },
            maturityRating: { type: "string" },
            isTrending: { type: "boolean" },
            isPopular: { type: "boolean" },
            isTopRated: { type: "boolean" },
          },
        },
        Genre: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            slug: { type: "string" },
          },
        },
        Watchlist: {
          type: "object",
          properties: {
            _id: { type: "string" },
            user: { type: "string" },
            contentType: { type: "string", enum: ["movie", "tvshow"] },
            contentId: { type: "string" },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/movies", require("./src/routes/movies"));
app.use("/api/tvshows", require("./src/routes/tvshows"));
app.use("/api/genres", require("./src/routes/genres"));
app.use("/api/watchlist", require("./src/routes/watchlist"));
app.use("/api/search", require("./src/routes/search"));
app.use("/api/content", require("./src/routes/content"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Netflix Clone API is running" });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
});

module.exports = app;
