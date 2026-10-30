const User = require('../models/User');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');

// @desc    Get admin dashboard aggregated statistics and charts data
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getAdminDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalOrganizers = await User.countDocuments({ role: 'organizer' });
    const totalEvents = await Event.countDocuments();
    const pendingEventsCount = await Event.countDocuments({ status: 'pending_approval' });
    const totalBookings = await Booking.countDocuments({ status: 'confirmed' });

    // Aggregate total revenue
    const revenueAgg = await Booking.aggregate([
      { $match: { status: 'confirmed', paymentStatus: 'paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    // Recent 5 bookings
    const recentBookings = await Booking.find()
      .populate('user', 'name email avatar')
      .populate('event', 'title date bannerImage')
      .sort({ createdAt: -1 })
      .limit(5);

    // Pending approvals list
    const pendingEvents = await Event.find({ status: 'pending_approval' })
      .populate('organizer', 'name email organizationName avatar')
      .sort({ createdAt: -1 })
      .limit(10);

    // Category distribution
    const categoryDistribution = await Event.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Monthly revenue simulation/aggregation (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const monthlySales = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          status: 'confirmed',
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%b %Y', date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          tickets: { $sum: '$quantity' },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalOrganizers,
          totalEvents,
          pendingEventsCount,
          totalBookings,
          totalRevenue,
        },
        pendingEvents,
        recentBookings,
        categoryDistribution: categoryDistribution.map(c => ({ name: c._id, count: c.count })),
        monthlySales,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users with search, role filter, pagination
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (role && role !== 'all') {
      query.role = role;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user status or role (Admin)
// @route   PATCH /api/admin/users/:id
// @access  Private (Admin)
const updateUserByAdmin = async (req, res) => {
  try {
    const { role, isActive } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (role !== undefined) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all events across all organizers for Admin
// @route   GET /api/admin/events
// @access  Private (Admin)
const getAllEventsForAdmin = async (req, res) => {
  try {
    const { status, category, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (category && category !== 'all') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Event.countDocuments(query);
    const events = await Event.find(query)
      .populate('organizer', 'name email organizationName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: events.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: events,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve or Reject an event submitted by an organizer
// @route   PATCH /api/admin/events/:id/approve
// @access  Private (Admin)
const approveOrRejectEvent = async (req, res) => {
  try {
    const { action, rejectionReason } = req.body; // action: 'approve' or 'reject'
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (action === 'approve') {
      event.status = 'approved';
      event.rejectionReason = '';
    } else if (action === 'reject') {
      event.status = 'rejected';
      event.rejectionReason = rejectionReason || 'Does not meet Apple event standards';
    } else {
      return res.status(400).json({ success: false, message: "Invalid action. Use 'approve' or 'reject'." });
    }

    await event.save();

    // Send notification to organizer
    await Notification.create({
      user: event.organizer,
      title: action === 'approve' ? 'Event Approved! 🎉' : 'Event Submission Update',
      message: action === 'approve'
        ? `Your event "${event.title}" has been approved and is now live on the marketplace.`
        : `Your event "${event.title}" was not approved. Reason: ${event.rejectionReason}`,
      type: 'event',
      link: `/organizer/events`,
    });

    res.json({
      success: true,
      message: `Event has been ${action}d successfully.`,
      data: event,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle feature status of an event
// @route   PATCH /api/admin/events/:id/feature
// @access  Private (Admin)
const toggleFeatureEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    event.isFeatured = !event.isFeatured;
    await event.save();

    res.json({
      success: true,
      message: `Event marked as ${event.isFeatured ? 'Featured' : 'Standard'}.`,
      data: event,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all platform bookings
// @route   GET /api/admin/bookings
// @access  Private (Admin)
const getAllBookingsForAdmin = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('user', 'name email avatar')
      .populate('event', 'title date venueName city')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: bookings.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAdminDashboardStats,
  getAllUsers,
  updateUserByAdmin,
  getAllEventsForAdmin,
  approveOrRejectEvent,
  toggleFeatureEvent,
  getAllBookingsForAdmin,
};
