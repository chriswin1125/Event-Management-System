const Category = require('../models/Category');
const Event = require('../models/Event');

// @desc    Get all categories with event count
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ featured: -1, name: 1 });

    // Compute live event counts
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Event.countDocuments({
          category: { $regex: new RegExp(`^${cat.name}$`, 'i') },
          status: 'approved',
        });
        return {
          ...cat.toObject(),
          eventCount: count,
        };
      })
    );

    res.json({
      success: true,
      count: categoriesWithCount.length,
      data: categoriesWithCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create category (Admin)
// @route   POST /api/categories
// @access  Private (Admin)
const createCategory = async (req, res) => {
  try {
    const { name, description, iconName, image, featured } = req.body;

    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }

    const category = await Category.create({
      name,
      description,
      iconName: iconName || 'Sparkles',
      image: image || '',
      featured: !!featured,
    });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
};
