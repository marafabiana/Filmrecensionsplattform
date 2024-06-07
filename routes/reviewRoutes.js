//1 Imports
const router = require('express').Router();
const Review = require('../models/review');
const checkAuth = require('../middlewares/checkAuth');

//2 Endpoints
// POST /reviews
router.post('/reviews', checkAuth, async (req, res) => {
  const { movieId, rating, comment } = req.body;
  const userId = req.user.id; // get the authenticated user ID

  if (!movieId || !userId || !rating || !comment) {
    return res.status(422).json({ message: 'All fields are required' });
  }
  const review = new Review({
    movieId,
    userId,
    rating,
    comment
  });

  try {
    await review.save();
    res.status(201).json({ message: 'Review added successfully', review });
  } catch (error) {
    res.status(500).json({ message: 'Server error, try again later' });
  }
});

// GET /reviews
router.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('movieId', 'title')
      .populate('userId', 'name');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error, try again later' });
  }
});

// GET /reviews/:id
router.get('/reviews/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findById(id)
      .populate('movieId', 'title')
      .populate('userId', 'name');
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error, try again later' });
  }
});

// PUT /reviews/:id
router.put('/reviews/:id', checkAuth, async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id;

  if (!rating || !comment) {
    return res.status(422).json({ message: 'All fields are required' });
  }

  try {
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // check if user is the owner of the review
    if (review.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    // update the review
    review.rating = rating;
    review.comment = comment;
    await review.save();

    res.status(200).json({ message: 'Review updated successfully', review });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error, try again later' });
  }
});

// DELETE /reviews/:id
router.delete('/reviews/:id', checkAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // check if the user is the owner of the review
    if (review.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await review.deleteOne();

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error, try again later' });
  }
});

module.exports = router;
