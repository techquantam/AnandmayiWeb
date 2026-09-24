const asyncHandler = require('express-async-handler');
const Banner = require('../models/Banner');

// @desc    Get all active banners
// @route   GET /api/banners
// @access  Public
const getBanners = asyncHandler(async (req, res) => {
    const banners = await Banner.find({ isActive: true });
    res.json(banners);
});

// @desc    Get all banners (Admin)
// @route   GET /api/banners/admin
// @access  Private/Admin
const getAdminBanners = asyncHandler(async (req, res) => {
    const banners = await Banner.find({});
    res.json(banners);
});

// @desc    Create a banner
// @route   POST /api/banners
// @access  Private/Admin
const createBanner = asyncHandler(async (req, res) => {
    const { title, subtitle, link, image, isActive } = req.body;

    const banner = new Banner({
        title,
        subtitle,
        link,
        image,
        isActive
    });

    const createdBanner = await banner.save();
    res.status(201).json(createdBanner);
});

// @desc    Update a banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
const updateBanner = asyncHandler(async (req, res) => {
    const { title, subtitle, link, image, isActive } = req.body;

    const banner = await Banner.findById(req.params.id);

    if (banner) {
        banner.title = title || banner.title;
        banner.subtitle = subtitle || banner.subtitle;
        banner.link = link || banner.link;
        if (image) banner.image = image;
        if (isActive !== undefined) banner.isActive = isActive;

        const updatedBanner = await banner.save();
        res.json(updatedBanner);
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
