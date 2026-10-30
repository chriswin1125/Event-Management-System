const Event = require('../models/Event');
const Booking = require('../models/Booking');

// @desc    Get all events with filters, search, sort, and pagination
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const {
      search,
      category,
      city,
      startDate,
      endDate,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = { status: 'approved' };

    // Search by title, description, or city
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { venueName: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by Category
    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // Filter by City
    if (city && city !== 'All') {
      query.city = { $regex: new RegExp(`^${city}$`, 'i') };
    }

    // Filter by Date
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Filter by Price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.lowestPrice = {};
      if (minPrice !== undefined) query.lowestPrice.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.lowestPrice.$lte = Number(maxPrice);
    }

    // Sorting
    let sortOption = { date: 1 }; // Default: upcoming first
    if (sort === 'price-low') sortOption = { lowestPrice: 1 };
    else if (sort === 'price-high') sortOption = { lowestPrice: -1 };
    else if (sort === 'popular') sortOption = { views: -1, ratingsQuantity: -1 };
    else if (sort === 'rating') sortOption = { ratingsAverage: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Event.countDocuments(query);
    const events = await Event.find(query)
      .populate('organizer', 'name email avatar organizationName')
      .sort(sortOption)
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

// @desc    Get featured events for Apple-style showcase
// @route   GET /api/events/featured
// @access  Public
const getFeaturedEvents = async (req, res) => {
  try {
    const featured = await Event.find({ status: 'approved', isFeatured: true })
      .populate('organizer', 'name email avatar organizationName')
      .sort({ date: 1 })
      .limit(6);

    // If less than 4 featured, fill with top upcoming events
    if (featured.length < 4) {
      const additional = await Event.find({
        status: 'approved',
        _id: { $nin: featured.map(e => e._id) },
      })
        .populate('organizer', 'name email avatar organizationName')
        .sort({ date: 1 })
        .limit(6 - featured.length);

      featured.push(...additional);
    }

    res.json({
      success: true,
      data: featured,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single event by ID or slug
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    let event;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      event = await Event.findById(id).populate('organizer', 'name email avatar bio organizationName phone');
    } else {
      event = await Event.findOne({ slug: id }).populate('organizer', 'name email avatar bio organizationName phone');
    }

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Increment view count asynchronously
    Event.findByIdAndUpdate(event._id, { $inc: { views: 1 } }).exec();

    // Fetch related events from same category
    const relatedEvents = await Event.find({
      category: event.category,
      _id: { $ne: event._id },
      status: 'approved',
    })
      .limit(3)
      .select('title bannerImage date lowestPrice city venueName ticketTiers');

    res.json({
      success: true,
      data: event,
      related: relatedEvents,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Organizer / Admin)
const createEvent = async (req, res) => {
  try {
    const {
      title,
      shortDescription,
      description,
      category,
      date,
      startTime,
      endTime,
      venueName,
      address,
      city,
      state,
      country,
      bannerImage,
      galleryImages,
      ticketTiers,
      tags,
    } = req.body;

    // Automatically approve if Admin creates it, otherwise submit for approval
    const initialStatus = req.user.role === 'admin' ? 'approved' : 'pending_approval';

    // Ensure availableSeats equals totalSeats initially for tiers
    const formattedTiers = ticketTiers.map(tier => ({
      tierName: tier.tierName,
      price: Number(tier.price),
      totalSeats: Number(tier.totalSeats),
      availableSeats: Number(tier.totalSeats),
      description: tier.description || '',
      perks: Array.isArray(tier.perks) ? tier.perks : [],
    }));

    const event = await Event.create({
      title,
      shortDescription,
      description,
      category,
      organizer: req.user._id,
      date,
      startTime,
      endTime,
      venueName,
      address,
      city,
      state: state || '',
      country: country || 'India',
      bannerImage,
      galleryImages: galleryImages || [],
      ticketTiers: formattedTiers,
      tags: tags || [],
      status: initialStatus,
    });

    res.status(201).json({
      success: true,
      message: initialStatus === 'approved' 
        ? 'Event published successfully' 
        : 'Event submitted for admin approval',
      data: event,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private (Organizer owner or Admin)
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check authorization: must be event organizer or admin
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this event' });
    }

    // Update allowed fields
    const fieldsToUpdate = [
      'title',
      'shortDescription',
      'description',
      'category',
      'date',
      'startTime',
      'endTime',
      'venueName',
      'address',
      'city',
      'state',
      'country',
      'bannerImage',
      'galleryImages',
      'tags',
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    });

    // Update ticket tiers if provided (preserves bookings count)
    if (req.body.ticketTiers && Array.isArray(req.body.ticketTiers)) {
      event.ticketTiers = req.body.ticketTiers.map(t => ({
        tierName: t.tierName,
        price: Number(t.price),
        totalSeats: Number(t.totalSeats),
        availableSeats: t.availableSeats !== undefined ? Number(t.availableSeats) : Number(t.totalSeats),
        description: t.description || '',
        perks: t.perks || [],
      }));
    }

    if (req.user.role === 'admin' && req.body.status !== undefined) {
      event.status = req.body.status;
    }

    if (req.user.role === 'admin' && req.body.isFeatured !== undefined) {
      event.isFeatured = req.body.isFeatured;
    }

    const updatedEvent = await event.save();

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private (Organizer owner or Admin)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this event' });
    }

    // Check if there are active bookings
    const activeBookings = await Booking.countDocuments({ event: event._id, status: 'confirmed' });
    if (activeBookings > 0 && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: `Cannot delete event with ${activeBookings} confirmed bookings. Please cancel or contact admin.`,
      });
    }

    await Event.findByIdAndDelete(event._id);

    res.json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get organizer's own events with live attendee & ticket metrics
// @route   GET /api/events/organizer/my-events
// @access  Private (Organizer)
const getOrganizerEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id }).sort({ createdAt: -1 });

    // Aggregate booking numbers for each event
    const eventsWithStats = await Promise.all(
      events.map(async (event) => {
        const bookings = await Booking.find({ event: event._id });
        const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
        const totalTicketsSold = confirmedBookings.reduce((sum, b) => sum + b.quantity, 0);
        const revenue = confirmedBookings.reduce((sum, b) => sum + b.totalAmount, 0);

        return {
          ...event.toObject(),
          totalTicketsSold,
          revenue,
          bookingCount: confirmedBookings.length,
        };
      })
    );

    res.json({
      success: true,
      data: eventsWithStats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get organizer analytics and attendees for an event
// @route   GET /api/events/:id/attendees
// @access  Private (Organizer / Admin)
const getEventAttendees = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const bookings = await Booking.find({ event: event._id })
      .populate('user', 'name email phone avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get organizer dashboard high-level stats
// @route   GET /api/events/organizer/stats
// @access  Private (Organizer)
const getOrganizerStats = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id });
    const eventIds = events.map(e => e._id);

    const bookings = await Booking.find({
      event: { $in: eventIds },
      status: 'confirmed',
    });

    const totalEvents = events.length;
    const totalApproved = events.filter(e => e.status === 'approved').length;
    const totalPending = events.filter(e => e.status === 'pending_approval').length;
    const totalTicketsSold = bookings.reduce((sum, b) => sum + b.quantity, 0);
    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);

    // Group sales by event for chart
    const eventPerformance = events.map(ev => {
      const evBookings = bookings.filter(b => b.event.toString() === ev._id.toString());
      const ticketsSold = evBookings.reduce((sum, b) => sum + b.quantity, 0);
      const revenue = evBookings.reduce((sum, b) => sum + b.totalAmount, 0);
      return {
        name: ev.title.length > 18 ? ev.title.substring(0, 18) + '...' : ev.title,
        ticketsSold,
        revenue,
        available: ev.totalAvailableSeats,
      };
    });

    res.json({
      success: true,
      data: {
        totalEvents,
        totalApproved,
        totalPending,
        totalTicketsSold,
        totalRevenue,
        eventPerformance,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getEvents,
  getFeaturedEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getOrganizerEvents,
  getEventAttendees,
  getOrganizerStats,
};
