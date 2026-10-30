const Review = require('../models/Review');
const Event = require('../models/Event');
const Booking = require('../models/Booking');

// @desc    Add review for an event
// @route   POST /api/reviews
// @access  Private
const addReview = async (req, res) => {
  try {
    const { eventId, rating, comment } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({ user: req.user._id, event: eventId });
    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this event' });
    }

    const review = await Review.create({
      user: req.user._id,
      event: eventId,
      rating: Number(rating),
      comment,
    });

    // Recompute event average rating
    const reviews = await Review.find({ event: eventId });
    const ratingsQuantity = reviews.length;
    const ratingsAverage = reviews.reduce((sum, item) => sum + item.rating, 0) / ratingsQuantity;

    event.ratingsQuantity = ratingsQuantity;
    event.ratingsAverage = ratingsAverage;
    await event.save();

    const populatedReview = await Review.findById(review._id).populate('user', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: populatedReview,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get reviews for an event
// @route   GET /api/reviews/:eventId
// @access  Public
const getEventReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ event: req.params.eventId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addReview,
  getEventReviews,
};
