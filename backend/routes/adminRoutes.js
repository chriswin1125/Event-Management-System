const express = require('express');
const router = express.Router();
const {
  getAdminDashboardStats,
  getAllUsers,
  updateUserByAdmin,
  getAllEventsForAdmin,
  approveOrRejectEvent,
  toggleFeatureEvent,
  getAllBookingsForAdmin,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All admin routes require admin role
router.use(protect, authorize('admin'));

router.get('/dashboard', getAdminDashboardStats);
router.get('/users', getAllUsers);
router.patch('/users/:id', updateUserByAdmin);
router.get('/events', getAllEventsForAdmin);
router.patch('/events/:id/approve', approveOrRejectEvent);
router.patch('/events/:id/feature', toggleFeatureEvent);
router.get('/bookings', getAllBookingsForAdmin);

module.exports = router;
