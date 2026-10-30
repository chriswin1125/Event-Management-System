const crypto = require('crypto');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const Notification = require('../models/Notification');
const { generateQRCode } = require('../utils/qrCodeService');
const { sendBookingConfirmation } = require('../utils/emailService');

// @desc    Create a new booking with atomic seat reservation
// @route   POST /api/bookings
// @access  Private (User/Organizer/Admin)
const createBooking = async (req, res) => {
  try {
    const {
      eventId,
      tierName,
      quantity,
      paymentMethod = 'Card / UPI (Test Mode)',
      paymentId,
      orderId,
    } = req.body;

    const numTickets = parseInt(quantity, 10);
    if (!numTickets || numTickets <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid ticket quantity' });
    }

    if (numTickets > 10) {
      return res.status(400).json({ success: false, message: 'Maximum 10 tickets per booking permitted' });
    }

    // 1. Fetch event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.status !== 'approved') {
      return res.status(400).json({ success: false, message: 'This event is not open for bookings' });
    }

    const selectedTier = event.ticketTiers.find(t => t.tierName.toLowerCase() === tierName.toLowerCase());
    if (!selectedTier) {
      return res.status(400).json({ success: false, message: `Ticket tier '${tierName}' not found for this event` });
    }

    // 2. ATOMIC INVENTORY UPDATE:
    // Update only if sufficient availableSeats exist
    const updatedEvent = await Event.findOneAndUpdate(
      {
        _id: eventId,
        'ticketTiers.tierName': selectedTier.tierName,
        'ticketTiers.availableSeats': { $gte: numTickets },
      },
      {
        $inc: {
          'ticketTiers.$.availableSeats': -numTickets,
          totalAvailableSeats: -numTickets,
        },
      },
      { returnDocument: 'after' }
    );

    if (!updatedEvent) {
      return res.status(400).json({
        success: false,
        message: `Sorry, there are not enough tickets available for ${selectedTier.tierName}. Only ${selectedTier.availableSeats} remaining.`,
      });
    }

    // 3. Compute totals
    const unitPrice = selectedTier.price;
    const subtotal = unitPrice * numTickets;
    const taxAmount = Math.round(subtotal * 0.05); // 5% service & processing
    const totalAmount = subtotal + taxAmount;

    // 4. Generate unique Booking ID
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const bookingId = `BK-${randomSuffix}`;

    // 5. Generate verifiable QR Code payload
    const qrPayload = {
      bookingId,
      eventId: event._id,
      eventTitle: event.title,
      userName: req.user.name,
      userEmail: req.user.email,
      tierName: selectedTier.tierName,
      quantity: numTickets,
      date: event.date,
      venue: event.venueName,
      verifiedHash: crypto.createHash('sha256').update(`${bookingId}-${req.user._id}-${totalAmount}`).digest('hex').substring(0, 16),
    };

    const qrCodeDataUrl = await generateQRCode(qrPayload);

    // 6. Create Booking Record
    const booking = await Booking.create({
      bookingId,
      user: req.user._id,
      event: event._id,
      tierName: selectedTier.tierName,
      unitPrice,
      quantity: numTickets,
      subtotal,
      taxAmount,
      totalAmount,
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentId: paymentId || `pay_test_${crypto.randomBytes(6).toString('hex')}`,
      orderId: orderId || `order_test_${crypto.randomBytes(6).toString('hex')}`,
      paymentMethod,
      qrCodeDataUrl,
    });

    // 7. Create in-app notification for the user
    await Notification.create({
      user: req.user._id,
      title: 'Booking Confirmed!',
      message: `Your booking for ${event.title} (${numTickets}x ${selectedTier.tierName}) is confirmed. Ref: ${bookingId}`,
      type: 'booking',
      link: `/user/bookings`,
    });

    // 8. Send confirmation email asynchronously
    sendBookingConfirmation({
      to: req.user.email,
      userName: req.user.name,
      bookingId,
      eventTitle: event.title,
      eventDate: event.date,
      venue: `${event.venueName}, ${event.city}`,
      quantity: numTickets,
      tierName: selectedTier.tierName,
      totalAmount,
    }).catch(err => console.error('Email dispatch error:', err));

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged-in user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: 'event',
        select: 'title bannerImage date startTime endTime venueName address city category status lowestPrice',
      })
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

// @desc    Get booking by ID with full ticket details
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone avatar')
      .populate('event');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Only owner, organizer of that event, or admin can access
    const isOwner = booking.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    const isEventOrganizer = booking.event && booking.event.organizer.toString() === req.user._id.toString();

    if (!isOwner && !isAdmin && !isEventOrganizer) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this booking' });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel booking and atomically restore seats
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const { reason = 'Cancelled by customer' } = req.body;

    const booking = await Booking.findById(req.params.id).populate('event');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Only booking owner or admin can cancel
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
    }

    // Atomic restoration of seats
    if (booking.event) {
      await Event.findOneAndUpdate(
        {
          _id: booking.event._id,
          'ticketTiers.tierName': booking.tierName,
        },
        {
          $inc: {
            'ticketTiers.$.availableSeats': booking.quantity,
            totalAvailableSeats: booking.quantity,
          },
        }
      );
    }

    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    booking.cancellationReason = reason;
    booking.cancelledAt = new Date();
    await booking.save();

    // Notify user
    await Notification.create({
      user: booking.user,
      title: 'Booking Cancelled & Refund Initiated',
      message: `Your booking ${booking.bookingId} for ${booking.event?.title || 'the event'} has been cancelled.`,
      type: 'booking',
      link: '/user/bookings',
    });

    res.json({
      success: true,
      message: 'Booking cancelled successfully. Refund initiated.',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
};
