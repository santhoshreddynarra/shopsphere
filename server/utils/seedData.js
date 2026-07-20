import dotenv from 'dotenv';
dotenv.config();

// Workaround for Node.js failing to resolve SRV/A records in some Windows environments
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import mongoose from 'mongoose';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

const categories = [
  { name: 'Electronics', slug: 'electronics', description: 'Gadgets, devices, and tech gear', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400' },
  { name: 'Fashion', slug: 'fashion', description: 'Clothing, shoes, and accessories', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400' },
  { name: 'Home & Living', slug: 'home-living', description: 'Furniture, decor, and appliances', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400' },
  { name: 'Sports', slug: 'sports', description: 'Fitness, outdoor, and sports gear', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400' },
  { name: 'Books', slug: 'books', description: 'Books, e-books, and educational materials', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400' },
  { name: 'Beauty', slug: 'beauty', description: 'Skincare, makeup, and wellness products', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400' },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    await Category.deleteMany();
    await Product.deleteMany();
    console.log('Cleared existing data.');

    const createdCategories = await Category.insertMany(categories);
    console.log(`Seeded ${createdCategories.length} categories.`);

    const findCat = (slug) => createdCategories.find((c) => c.slug === slug)._id;

    const products = [
      // Electronics
      {
        name: 'Sony WH-1000XM5 Headphones',
        slug: 'sony-wh-1000xm5',
        description: 'Industry-leading noise canceling with Speak-to-Chat technology. Up to 30-hour battery life with quick charge.',
        brand: 'Sony',
        category: findCat('electronics'),
        price: 29999,
        discountPrice: 24999,
        images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600'],
        stock: 45,
        sku: 'SONY-WH1000XM5',
        rating: 4.8,
        numReviews: 312,
        isFeatured: true,
        specifications: [{ key: 'Battery Life', value: '30 hours' }, { key: 'Driver Size', value: '40mm' }, { key: 'Weight', value: '250g' }],
        numSales: 521,
      },
      {
        name: 'Apple MacBook Air M3',
        slug: 'apple-macbook-air-m3',
        description: 'Supercharged by M3 chip. Up to 18 hours of battery. Fanless design with 13.6-inch Liquid Retina display.',
        brand: 'Apple',
        category: findCat('electronics'),
        price: 114900,
        discountPrice: 109900,
        images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600', 'https://images.unsplash.com/photo-1611186871525-9aaad09c2e3d?w=600'],
        stock: 20,
        sku: 'APPLE-MBA-M3',
        rating: 4.9,
        numReviews: 897,
        isFeatured: true,
        specifications: [{ key: 'Chip', value: 'Apple M3' }, { key: 'RAM', value: '8GB' }, { key: 'Storage', value: '256GB SSD' }],
        numSales: 1203,
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        slug: 'samsung-galaxy-s24-ultra',
        description: 'The most powerful Galaxy ever. 200MP camera, 5000mAh battery, and S Pen included.',
        brand: 'Samsung',
        category: findCat('electronics'),
        price: 134999,
        discountPrice: 124999,
        images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600', 'https://images.unsplash.com/photo-1553179459-4514c0f52f41?w=600'],
        stock: 30,
        sku: 'SAMSUNG-S24U',
        rating: 4.7,
        numReviews: 654,
        isFeatured: true,
        specifications: [{ key: 'Display', value: '6.8" QHD+' }, { key: 'Camera', value: '200MP' }, { key: 'Battery', value: '5000mAh' }],
        numSales: 876,
      },
      {
        name: 'LG OLED 4K TV 55"',
        slug: 'lg-oled-4k-tv-55',
        description: 'Self-lit OLED pixels deliver perfect black and infinite contrast. Powered by α9 Gen6 AI Processor.',
        brand: 'LG',
        category: findCat('electronics'),
        price: 89999,
        discountPrice: 79999,
        images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=600'],
        stock: 12,
        sku: 'LG-OLED55',
        rating: 4.6,
        numReviews: 234,
        isFeatured: false,
        specifications: [{ key: 'Size', value: '55 inches' }, { key: 'Resolution', value: '4K UHD' }, { key: 'Refresh Rate', value: '120Hz' }],
        numSales: 345,
      },
      // Fashion
      {
        name: 'Nike Air Max 270',
        slug: 'nike-air-max-270',
        description: 'The Nike Air Max 270 features Nike largest-ever Air unit for an incredibly plush, comfortable ride.',
        brand: 'Nike',
        category: findCat('fashion'),
        price: 12995,
        discountPrice: 9995,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600'],
        stock: 89,
        sku: 'NIKE-AM270',
        rating: 4.5,
        numReviews: 512,
        isFeatured: true,
        specifications: [{ key: 'Upper', value: 'Mesh and synthetic' }, { key: 'Sole', value: 'Rubber' }, { key: 'Closure', value: 'Lace-up' }],
        numSales: 1540,
      },
      {
        name: 'Levi\'s 511 Slim Jeans',
        slug: 'levis-511-slim-jeans',
        description: 'The slimmer, more streamlined jeans. Sits below waist with slim fit through seat and thigh.',
        brand: "Levi's",
        category: findCat('fashion'),
        price: 4499,
        discountPrice: 3599,
        images: ['https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=600'],
        stock: 200,
        sku: 'LEVIS-511-SLIM',
        rating: 4.3,
        numReviews: 765,
        isFeatured: false,
        specifications: [{ key: 'Fit', value: 'Slim' }, { key: 'Rise', value: 'Below waist' }, { key: 'Material', value: '99% Cotton' }],
        numSales: 2300,
      },
      // Home & Living
      {
        name: 'Dyson V15 Detect Vacuum',
        slug: 'dyson-v15-detect',
        description: 'Laser reveals microscopic dust. Acoustic piezo sensor counts particles and reports in real-time.',
        brand: 'Dyson',
        category: findCat('home-living'),
        price: 62900,
        discountPrice: 54900,
        images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'],
        stock: 25,
        sku: 'DYSON-V15D',
        rating: 4.7,
        numReviews: 289,
        isFeatured: true,
        specifications: [{ key: 'Run Time', value: '60 min' }, { key: 'Bin Volume', value: '0.77L' }, { key: 'Weight', value: '3.1kg' }],
        numSales: 432,
      },
      {
        name: 'Instant Pot Duo 7-in-1',
        slug: 'instant-pot-duo-7in1',
        description: '7-in-1 multi-use cooker: pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker & warmer.',
        brand: 'Instant Pot',
        category: findCat('home-living'),
        price: 8999,
        discountPrice: 6999,
        images: ['https://images.unsplash.com/photo-1585515320310-259814833e62?w=600'],
        stock: 67,
        sku: 'IP-DUO7IN1',
        rating: 4.6,
        numReviews: 1230,
        isFeatured: false,
        specifications: [{ key: 'Capacity', value: '6 Quart' }, { key: 'Functions', value: '7-in-1' }, { key: 'Warranty', value: '1 Year' }],
        numSales: 3210,
      },
      // Sports
      {
        name: 'Whey Protein Isolate 2kg',
        slug: 'whey-protein-isolate-2kg',
        description: 'Ultra-pure whey protein isolate with 27g protein per serving. No added sugar. Banned substance free.',
        brand: 'MuscleBlaze',
        category: findCat('sports'),
        price: 4299,
        discountPrice: 3599,
        images: ['https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=600'],
        stock: 120,
        sku: 'MB-WPI-2KG',
        rating: 4.4,
        numReviews: 876,
        isFeatured: false,
        specifications: [{ key: 'Protein per Serving', value: '27g' }, { key: 'Flavour', value: 'Chocolate' }, { key: 'Servings', value: '67' }],
        numSales: 1890,
      },
      {
        name: 'Yoga Mat Premium 6mm',
        slug: 'yoga-mat-premium-6mm',
        description: 'Extra-thick 6mm non-slip yoga mat with alignment lines. Eco-friendly TPE material.',
        brand: 'FitFlex',
        category: findCat('sports'),
        price: 1299,
        discountPrice: 999,
        images: ['https://images.unsplash.com/photo-1601925228948-8a5e4b0a3993?w=600'],
        stock: 300,
        sku: 'FF-YM-6MM',
        rating: 4.2,
        numReviews: 432,
        isFeatured: false,
        specifications: [{ key: 'Thickness', value: '6mm' }, { key: 'Material', value: 'TPE' }, { key: 'Dimensions', value: '183cm x 61cm' }],
        numSales: 765,
      },
      // Books
      {
        name: 'Atomic Habits - James Clear',
        slug: 'atomic-habits-james-clear',
        description: 'An easy and proven way to build good habits and break bad ones. A revolutionary system for getting 1% better every day.',
        brand: 'Penguin Random House',
        category: findCat('books'),
        price: 599,
        discountPrice: 449,
        images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600'],
        stock: 500,
        sku: 'BOOK-ATOMICHABITS',
        rating: 4.9,
        numReviews: 2340,
        isFeatured: true,
        specifications: [{ key: 'Pages', value: '320' }, { key: 'Language', value: 'English' }, { key: 'Format', value: 'Paperback' }],
        numSales: 5600,
      },
      // Beauty
      {
        name: 'Minimalist SPF 50 Sunscreen',
        slug: 'minimalist-spf50-sunscreen',
        description: 'Ultra-lightweight SPF 50 PA++++ sunscreen with no white cast. Protects against UVA and UVB.',
        brand: 'Minimalist',
        category: findCat('beauty'),
        price: 549,
        discountPrice: 0,
        images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600'],
        stock: 400,
        sku: 'MIN-SPF50',
        rating: 4.5,
        numReviews: 1678,
        isFeatured: false,
        specifications: [{ key: 'SPF', value: '50' }, { key: 'Volume', value: '50ml' }, { key: 'Skin Type', value: 'All' }],
        numSales: 4320,
      },
      {
        name: 'Dyson Airwrap Styler',
        slug: 'dyson-airwrap-styler',
        description: 'Style with air for salon-worthy curls and waves. No extreme heat damage. Coanda effect curls hair.',
        brand: 'Dyson',
        category: findCat('beauty'),
        price: 44900,
        discountPrice: 39900,
        images: ['https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600'],
        stock: 18,
        sku: 'DYSON-AIRWRAP',
        rating: 4.8,
        numReviews: 543,
        isFeatured: true,
        specifications: [{ key: 'Voltage', value: '220-240V' }, { key: 'Attachments', value: '6' }, { key: 'Weight', value: '1.36kg' }],
        numSales: 678,
      },
    ];

    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products.`);
    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
