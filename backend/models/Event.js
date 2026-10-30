const mongoose = require('mongoose');

const ticketTierSchema = new mongoose.Schema({
  tierName: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative'],
  },
  totalSeats: {
    type: Number,
    required: true,
    min: [1, 'Total seats must be at least 1'],
  },
  availableSeats: {
    type: Number,
    required: true,
    min: [0, 'Available seats cannot be negative'],
  },
  description: {
    type: String,
    default: '',
  },
  perks: [{
    type: String,
  }],
});

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      maxlength: [240, 'Short description cannot exceed 240 characters'],
    },
    description: {
      type: String,
      required: [true, 'Detailed description is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
    },
    venueName: {
      type: String,
      required: [true, 'Venue name is required'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
    },
    state: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: 'India',
    },
    bannerImage: {
      type: String,
      required: [true, 'Banner image URL is required'],
    },
    galleryImages: [{
      type: String,
    }],
    ticketTiers: {
      type: [ticketTierSchema],
      validate: [val => val.length > 0, 'Event must have at least one ticket tier'],
    },
    status: {
      type: String,
      enum: ['pending_approval', 'approved', 'rejected', 'completed', 'cancelled'],
      default: 'pending_approval',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    tags: [{
      type: String,
    }],
    totalCapacity: {
      type: Number,
      default: 0,
    },
    totalAvailableSeats: {
      type: Number,
      default: 0,
    },
    lowestPrice: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    ratingsAverage: {
      type: Number,
      default: 5.0,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for fast searching and filtering
eventSchema.index({ title: 'text', description: 'text', city: 'text' });
eventSchema.index({ category: 1, date: 1, status: 1 });
eventSchema.index({ organizer: 1 });

// Helper pre-save hook to calculate aggregates
eventSchema.pre('save', function () {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-') + '-' + Date.now().toString().slice(-4);
  }

  if (this.ticketTiers && this.ticketTiers.length > 0) {
    this.totalCapacity = this.ticketTiers.reduce((acc, tier) => acc + (tier.totalSeats || 0), 0);
    this.totalAvailableSeats = this.ticketTiers.reduce((acc, tier) => acc + (tier.availableSeats || 0), 0);
    this.lowestPrice = Math.min(...this.ticketTiers.map(t => t.price));
  }
});

module.exports = mongoose.model('Event', eventSchema);
