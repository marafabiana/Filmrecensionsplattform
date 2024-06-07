const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const checkAuth = require('../middlewares/checkAuth');

// POST /movies
router.post('/movies', checkAuth, movieController.createMovie);

// GET /movies
router.get('/movies', movieController.getAllMovies)

// GET /movies/:id
router.get('/movies/:id', movieController.getMovieById);

// PUT /movies/:id
router.put('/movies/:id', checkAuth, movieController.updateMovie);

// GET /movies/:id/reviews
router.get('/movies/:id/reviews', movieController.getMoviesReviews);

// DELETE /movies/:id
router.delete('/movies/:id', checkAuth, movieController.deleteMovie);

module.exports = router;
