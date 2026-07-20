import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const categoriesData = [
  { name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80' },
  { name: 'Mobiles', slug: 'mobiles', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80' },
  { name: 'Laptops', slug: 'laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80' },
  { name: 'Audio', slug: 'audio', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' },
  { name: 'Smart Watches', slug: 'smart-watches', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80' },
  { name: 'Mens Fashion', slug: 'mens-fashion', image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=500&q=80' },
  { name: 'Womens Fashion', slug: 'womens-fashion', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80' },
  { name: 'Footwear', slug: 'footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80' },
  { name: 'Beauty & Personal Care', slug: 'beauty', image: 'https://images.unsplash.com/photo-1522337360788-8b13fee7a34b?w=500&q=80' },
  { name: 'Home & Kitchen', slug: 'home-kitchen', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&q=80' },
  { name: 'Furniture', slug: 'furniture', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80' },
  { name: 'Grocery', slug: 'grocery', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80' },
  { name: 'Books', slug: 'books', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80' },
  { name: 'Sports & Fitness', slug: 'sports', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80' },
  { name: 'Toys & Games', slug: 'toys', image: 'https://images.unsplash.com/photo-1566576912321-d58ddd9a6088?w=500&q=80' },
];

const brands = ['Sony', 'Samsung', 'Apple', 'Nike', 'Adidas', 'Puma', 'Bose', 'Dell', 'HP', 'LG', 'Panasonic', 'Philips', 'Rolex', 'Casio', 'Levis', 'Zara', 'H&M', 'Gucci', 'Prada', 'IKEA'];
const adjectives = ['Premium', 'Pro', 'Max', 'Ultra', 'Essential', 'Classic', 'Modern', 'Smart', 'Advanced', 'Original', 'Sleek', 'Elite', 'Lite', 'Signature'];
const productTypes = ['Headphones', 'Speaker', 'Monitor', 'Jacket', 'Sneakers', 'Watch', 'Backpack', 'Camera', 'Tablet', 'Perfume', 'Blender', 'Chair', 'Desk', 'Yoga Mat', 'Dumbbells', 'Novel'];

// Helper to get random item
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
// Helper to get random number between min and max
const getRandomNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
// Helper to get random boolean with probability
const getRandomBool = (prob = 0.5) => Math.random() < prob;

const generateProducts = (categoriesMap) => {
  const products = [];
  
  categoriesMap.forEach((category) => {
    // Generate 8-12 products per category
    const numProducts = getRandomNum(8, 12);
    
    for (let i = 0; i < numProducts; i++) {
      const brand = getRandom(brands);
      const adj = getRandom(adjectives);
      const type = getRandom(productTypes);
      const name = `${brand} ${adj} ${type} - ${getRandomNum(100, 999)}`;
      
      const price = getRandomNum(499, 150000);
      const isDiscounted = getRandomBool(0.4); // 40% chance of discount
      const discountPrice = isDiscounted ? Math.floor(price * getRandomNum(60, 90) / 100) : 0;
      
      const isFeatured = getRandomBool(0.15); // 15% chance to be featured
      
      // Use Picsum for diverse placeholder images, appending random seed to ensure uniqueness
      const randomSeed = Math.floor(Math.random() * 100000);
      const images = [
        `https://picsum.photos/seed/${randomSeed}/800/800`,
        `https://picsum.photos/seed/${randomSeed+1}/800/800`,
        `https://picsum.photos/seed/${randomSeed+2}/800/800`
      ];

      products.push({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: `Experience the next level of innovation with the ${name}. Crafted with premium materials and cutting-edge technology, it seamlessly blends performance with style. Designed for those who demand excellence in their daily lives.`,
        brand,
        category: category._id,
        price,
        discountPrice,
        images,
        stock: getRandomNum(0, 100), // 0 to simulate out-of-stock
        sku: `SKU-${brand.substring(0,3).toUpperCase()}-${getRandomNum(10000, 99999)}`,
        rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
        numReviews: getRandomNum(0, 500),
        numSales: getRandomNum(0, 2000),
        isFeatured,
        isActive: true,
        specifications: [
          { key: 'Color', value: getRandom(['Black', 'White', 'Silver', 'Blue', 'Red']) },
          { key: 'Material', value: getRandom(['Aluminum', 'Plastic', 'Leather', 'Cotton', 'Glass']) },
          { key: 'Weight', value: `${getRandomNum(100, 2000)}g` },
          { key: 'Warranty', value: `${getRandomNum(1, 3)} Year(s)` },
        ]
      });
    }
  });
  
  return products;
};

export const importData = async () => {
  try {
    console.log('Clearing old data...');
    await Product.deleteMany();
    await Category.deleteMany();

    console.log('Inserting categories...');
    const createdCategories = await Category.insertMany(categoriesData);
    
    console.log('Generating products...');
    const generatedProducts = generateProducts(createdCategories);
    
    console.log(`Inserting ${generatedProducts.length} products...`);
    await Product.insertMany(generatedProducts);

    console.log('Data Imported successfully!');
    return { success: true, count: generatedProducts.length };
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    throw error;
  }
};
