const router = require('express').Router();
const reviewController = require('../controllers/reviewController');
const checkAuth = require('../middlewares/checkAuth');

// POST /reviews
router.post('/reviews', checkAuth, reviewController.addReview);

// GET /reviews
router.get('/reviews', reviewController.getAllReviews);

// GET /reviews/:id
router.get('/reviews/:id', reviewController.getReviewById);

// PUT /reviews/:id
router.put('/reviews/:id', checkAuth, reviewController.updateReview);

// DELETE /reviews/:id
router.delete('/reviews/:id', checkAuth, reviewController.deleteReview);

module.exports = router;
