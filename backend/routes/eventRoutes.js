const express = require('express');
const router = express.Router();
const {
  getEvents,
  getFeaturedEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getOrganizerEvents,
  getEventAttendees,
  getOrganizerStats,
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getEvents);
router.get('/featured', getFeaturedEvents);

// Organizer routes (placed before /:id)
router.get('/organizer/my-events', protect, authorize('organizer', 'admin'), getOrganizerEvents);
router.get('/organizer/stats', protect, authorize('organizer', 'admin'), getOrganizerStats);
router.get('/:id/attendees', protect, authorize('organizer', 'admin'), getEventAttendees);

// Single event public route
router.get('/:id', getEventById);

// Organizer / Admin write routes
router.post('/', protect, authorize('organizer', 'admin'), createEvent);
router.put('/:id', protect, authorize('organizer', 'admin'), updateEvent);
router.delete('/:id', protect, authorize('organizer', 'admin'), deleteEvent);

module.exports = router;
