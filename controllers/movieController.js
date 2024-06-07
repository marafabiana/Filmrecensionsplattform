const Movie = require('../models/movie');
const Review = require('../models/review');

// POST /movies
exports.createMovie = async (req, res) => {
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
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /movies
exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: "Server error, try again later" });
  }
};

// GET /movies/:id
exports.getMovieById = async (req, res) => {
  const id = req.params.id;

  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(200).json({ movie });
  } catch (error) {
    res.status(500).json({ message: 'Server error, try again later' });
  }
};

// PUT /movies/:id
exports.updateMovie = async (req, res) => {
  const { id } = req.params;
  const { title, director, releaseYear, genre } = req.body;
  const userId = req.user.id;

  if (!title || !director || !releaseYear || !genre) {
    return res.status(422).json({ message: 'All fields are required' });
  }

  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    if (movie.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this movie' });
    }

    movie.title = title;
    movie.director = director;
    movie.releaseYear = releaseYear;
    movie.genre = genre;

    await movie.save();

    res.status(200).json({ message: 'Movie updated successfully', movie });

  } catch (error) {
    res.status(500).json({ message: 'Server error, try again later' });
  }
};

// GET /movies/:id/reviews
exports.getMoviesReviews = async (req, res) => {
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
};

// DELETE /movies/:id
exports.deleteMovie = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // check if the user owns the movie
    if (movie.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this movie" });
    }

    await movie.deleteOne(); // use deleteOne to ensure we are deleting the found movie

    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error, try again later" });
  }
};
