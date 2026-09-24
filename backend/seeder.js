const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Order = require('./models/Order');

const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '.env') });

const importData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected for seeding');

        await Order.deleteMany();
        await Product.deleteMany();
        await Category.deleteMany();
        await User.deleteMany();

        // 1. Create Users
        // We create them one by one so the pre('save') middleware hashes the passwords.
        await User.deleteMany();
        const adminUser = new User({
            name: 'Admin User',
            email: 'admin@anandmayi.com',
            password: 'password123',
            phone: '9876543210',
            role: 'admin',
        });
        await adminUser.save();
        
        const customerUser = new User({
            name: 'Test Customer',
            email: 'customer@test.com',
            password: 'password123',
            phone: '9876543211',
            role: 'customer',
        });
        await customerUser.save();

        const adminId = adminUser._id;

        // 2. Create Categories
        const createdCategories = await Category.insertMany([
            {
                name: 'Puja Kits',
                slug: 'puja-kits',
                description: 'Complete kits for various pujas'
            },
            {
                name: 'Incense & Dhoop',
                slug: 'incense-and-dhoop',
                description: 'Premium agarbatti and dhoop sticks'
            },
            {
                name: 'God Idols',
                slug: 'god-idols',
                description: 'Beautiful idols for your home temple'
            }
        ]);

        // 3. Create Sample Products
        const products = [
            {
                name: 'Premium Diwali Puja Kit',
                slug: 'premium-diwali-puja-kit',
                sku: 'DPK-001',
                price: 1499,
                mrp: 1999,
                user: adminId,
                images: [
                    { public_id: 'dummy1', url: 'https://images.unsplash.com/photo-1603793798481-9952000216bd?q=80&w=600&auto=format&fit=crop' }
                ],
                brand: 'Anandmayi',
                category: createdCategories[0]._id,
                stock: 50,
                description: 'Complete Diwali Puja kit with all essential samagri including premium quality diyas, roli, chawal, and gangajal.',
                shortDescription: 'Complete Diwali Puja kit with all essential samagri.'
            },
            {
                name: 'Sandalwood Premium Agarbatti',
                slug: 'sandalwood-premium-agarbatti',
                sku: 'INC-001',
                price: 250,
                mrp: 300,
                user: adminId,
                images: [
                    { public_id: 'dummy2', url: 'https://images.unsplash.com/photo-1608938090726-25f02bc92bc6?q=80&w=600&auto=format&fit=crop' }
                ],
                brand: 'Anandmayi',
                category: createdCategories[1]._id,
                stock: 200,
                description: 'Hand-rolled sandalwood incense sticks for a divine and calming atmosphere during your daily prayers.',
                shortDescription: 'Hand-rolled sandalwood incense sticks.'
            },
            {
                name: 'Brass Ganesha Idol (6 inch)',
                slug: 'brass-ganesha-idol-6-inch',
                sku: 'IDL-001',
                price: 2450,
                mrp: 3000,
                user: adminId,
                images: [
                    { public_id: 'dummy3', url: 'https://images.unsplash.com/photo-1594247545300-8441f98bc01d?q=80&w=600&auto=format&fit=crop' }
                ],
                brand: 'Anandmayi',
                category: createdCategories[2]._id,
                stock: 15,
                description: 'Intricately designed pure brass Ganesha idol, perfect for home temples or as an auspicious gift.',
                shortDescription: 'Pure brass Ganesha idol for home temple.'
            }
        ];

        await Product.insertMany(products);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
