// 1 Imports
const express = require("express"); 
const router = require("express").Router();
const Movie = require("../models/movie");
const Review = require("../models/review");
const checkAuth = require("../middlewares/checkAuth");

// 2 Endpoints
// POST /movies
router.post('/movies', checkAuth, async (req, res) => {
  const { title, director, releaseYear, genre } = req.body;
  const userId = req.user.id;


  if (!title || !director || !releaseYear || !genre) {
    return res.status(422).json({ message: 'All fields are required' });
  }

  const movie = new Movie({
    title,
    director,
    releaseYear,
    genre,
    userId
  });

  try {
    await movie.save();
    res.status(201).json({ message: 'Movie created successfully', movie });
  } catch (error) {
    res.status(500).json({ message: 'Server error, try again later' });
  }
});

// GET /movies
router.get("/movies", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: "Server error, try again later" });
  }
});

// GET /movies/:id
router.get("/movies/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ message: "Server error, try again later" });
  }
});

/// PUT /movies/:id
router.put("/movies/:id", checkAuth, async (req, res) => {
  const { id } = req.params;
  const { title, director, releaseYear, genre } = req.body;
  const userId = req.user.id;

  if (!title || !director || !releaseYear || !genre) {
    console.log("Missing fields in request body");
    return res.status(422).json({ message: "All fields are required" });
  }

  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      console.log("Movie not found");
      return res.status(404).json({ message: "Movie not found" });
    }

    // check if movie.userId is valid
    if (!movie.userId) {
      console.log("movie.userId is undefined");
      return res
        .status(500)
        .json({ message: "Movie does not have an associated userId" });
    }

    // check if the user owns the movie
    if (movie.userId.toString() !== userId) {
      console.log("User not authorized to update this movie");
      return res
        .status(403)
        .json({ message: "Not authorized to update this movie" });
    }

    movie.title = title;
    movie.director = director;
    movie.releaseYear = releaseYear;
    movie.genre = genre;

    await movie.save();

    console.log("Movie updated successfully");
    res.status(200).json({ message: "Movie updated successfully", movie });
  } catch (error) {
    console.log("Server error:", error);
    res.status(500).json({ message: "Server error, try again later" });
  }
});

// GET /movies/:id/reviews
router.get("/movies/:id/reviews", async (req, res) => {
  const { id } = req.params;

  try {
    const reviews = await Review.find({ movieId: id });
    if (reviews.length === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for this movie" });
    }
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error, try again later" });
  }
});

// DELETE /movies/:id
router.delete("/movies/:id", checkAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // check if the user owns the movie
    if (movie.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this movie" });
    }

    await movie.deleteOne(); // use deleteOne to ensure we are deleting the found movie

    console.log("Movie deleted successfully");
    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error, try again later" });
  }
});

module.exports = router;
