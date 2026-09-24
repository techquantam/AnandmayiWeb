const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
        ? {
              name: {
                  $regex: req.query.keyword,
                  $options: 'i',
              },
          }
        : {};

    // Filter by Category (allow comma-separated multiple categories)
    const categoryFilter = req.query.category ? { category: { $in: req.query.category.split(',') } } : {};

    const count = await Product.countDocuments({ ...keyword, ...categoryFilter });
    const products = await Product.find({ ...keyword, ...categoryFilter })
        .populate('category', 'name slug')
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/:slug
// @access  Public
const getProductBySlug = asyncHandler(async (req, res) => {
    const identifier = req.params.slug;
    
    // Check if identifier is a valid MongoDB ObjectId
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
    
    const query = isObjectId ? { _id: identifier } : { slug: identifier };
    
    const product = await Product.findOne(query).populate('category', 'name slug');

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: 'Sample name',
        slug: 'sample-name-' + Date.now(),
        sku: 'SKU-' + Date.now(),
        price: 0,
        mrp: 0,
        user: req.user._id,
        images: [
            { public_id: 'sample_id', url: '/images/sample.jpg' }
        ],
        brand: 'Sample brand',
        category: req.body.category || '60c72b2f9b1e8a0015b6d1f9', // Needs valid object ID here normally
        stock: 0,
        numReviews: 0,
        description: 'Sample description',
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const {
        name,
        slug,
        sku,
        price,
        mrp,
        description,
        shortDescription,
        images,
        brand,
        category,
        stock,
        isFeatured,
        isFlashSale,
        isBestSeller,
        isNewArrival
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name || product.name;
        product.slug = slug || product.slug;
        product.sku = sku || product.sku;
        product.price = price || product.price;
        product.mrp = mrp || product.mrp;
        product.description = description || product.description;
        product.shortDescription = shortDescription || product.shortDescription;
        product.images = images || product.images;
        product.brand = brand || product.brand;
        product.category = category || product.category;
        product.stock = stock || product.stock;
        product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
        product.isFlashSale = isFlashSale !== undefined ? isFlashSale : product.isFlashSale;
        product.isBestSeller = isBestSeller !== undefined ? isBestSeller : product.isBestSeller;
        product.isNewArrival = isNewArrival !== undefined ? isNewArrival : product.isNewArrival;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

module.exports = {
    getProducts,
    getProductBySlug,
    createProduct,
    updateProduct,
    deleteProduct,
};
