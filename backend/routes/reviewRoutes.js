const express = require('express');
const router = express.Router();
const { addReview, getEventReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:eventId', getEventReviews);
router.post('/', protect, addReview);

module.exports = router;
