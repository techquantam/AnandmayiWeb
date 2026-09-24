const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');

const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '.env') });

const checkCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const categories = await Category.find({});
        console.log("Categories in DB:", categories);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkCategories();
