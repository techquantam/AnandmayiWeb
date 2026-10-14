const asyncHandler = require('express-async-handler');
const Banner = require('../models/Banner');
const Product = require('../models/Product');

// @desc    Get all active banners
// @route   GET /api/banners
// @access  Public
const getBanners = asyncHandler(async (req, res) => {
    const banners = await Banner.find({ isActive: true }).populate('product', 'name slug price images mrp');
    res.json(banners);
});

// @desc    Get all banners (Admin)
// @route   GET /api/banners/admin
// @access  Private/Admin
const getAdminBanners = asyncHandler(async (req, res) => {
    const banners = await Banner.find({}).populate('product', 'name slug price images mrp');
    res.json(banners);
});

// @desc    Create a banner
// @route   POST /api/banners
// @access  Private/Admin
const createBanner = asyncHandler(async (req, res) => {
    const { title, subtitle, link, product, image, isActive } = req.body;

    const banner = new Banner({
        title,
        subtitle,
        link,
        product: product || null,
        image,
        isActive
    });

    const createdBanner = await banner.save();
    const populatedBanner = await Banner.findById(createdBanner._id).populate('product', 'name slug price images mrp');
    res.status(201).json(populatedBanner);
});

// @desc    Update a banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
const updateBanner = asyncHandler(async (req, res) => {
    const { title, subtitle, link, product, image, isActive } = req.body;

    const banner = await Banner.findById(req.params.id);

    if (banner) {
        if (title !== undefined) banner.title = title;
        if (subtitle !== undefined) banner.subtitle = subtitle;
        if (link !== undefined) banner.link = link;
        if (req.body.hasOwnProperty('product')) banner.product = product || null;
        if (image) banner.image = image;
        if (isActive !== undefined) banner.isActive = isActive;

        await banner.save();
        const populatedBanner = await Banner.findById(banner._id).populate('product', 'name slug price images mrp');
        res.json(populatedBanner);
    } else {
        res.status(404);
        throw new Error('Banner not found');
    }
});

// @desc    Delete a banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
const deleteBanner = asyncHandler(async (req, res) => {
    const banner = await Banner.findById(req.params.id);

    if (banner) {
        await Banner.deleteOne({ _id: banner._id });
        res.json({ message: 'Banner removed' });
    } else {
        res.status(404);
        throw new Error('Banner not found');
    }
});

module.exports = {
    getBanners,
    getAdminBanners,
    createBanner,
    updateBanner,
    deleteBanner
};
