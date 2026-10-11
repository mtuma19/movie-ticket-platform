const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");

router.get("/", async (req, res) => {
  try {
    const { type } = req.query;
    let query = {};

    if (type === "now_playing") query.isNowPlaying = true;
    if (type === "coming_soon") query.isNowPlaying = false;
    if (type === "featured") query.isFeatured = true;

    const movies = await Movie.find(query);
    res.status(200).json(movies);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching movies", error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.status(200).json(movie);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching movie details", error: err.message });
  }
});

module.exports = router;
