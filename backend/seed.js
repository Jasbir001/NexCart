const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const products = [
  {
    id: 1,
    name: 'boAt Nirvana Ion ANC Wireless Earbuds',
    price: 2999,
    originalPrice: 3999,
    rating: 4.8,
    reviewsCount: 3,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=80'
    ],
    description: 'Experience absolute sound with boAt Nirvana Ion. Featuring Active Noise Cancellation up to 32dB, massive 120-hour playback time, crystal clear calls with quad mics, and signature boAt deep bass.',
    stock: 15,
    badge: 'Best Seller',
    specs: {
      'Brand': 'boAt',
      'Model': 'Nirvana ANC',
      'Battery Life': '120 Hours Total',
      'Noise Cancellation': 'Yes (Up to 32dB)',
      'Warranty': '1 Year Domestic Warranty'
    },
    reviews: [
      { id: 'r1', name: 'Aarav Sharma', rating: 5, text: 'Amazing sound quality and great battery life. ANC works perfectly in Delhi Metro crowd!', date: '2026-05-15', verified: true, image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300&auto=format&fit=crop&q=80' },
      { id: 'r2', name: 'Priya Patel', rating: 4, text: 'Bass is very deep. Fitting is good, but white color gets dirty easily.', date: '2026-05-20', verified: true },
      { id: 'r3', name: 'Rahul Verma', rating: 5, text: 'Massive battery. Truly Nirvana!', date: '2026-05-28', verified: false }
    ]
  },
  {
    id: 2,
    name: 'Titan Neo Chronograph Premium Analog Watch',
    price: 7495,
    originalPrice: 9995,
    rating: 4.9,
    reviewsCount: 2,
    category: 'Watches',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=80'
    ],
    description: 'Titan Neo Chronograph watch for men is a classic masterpiece. Crafted with a premium silver metal strap, royal blue round dial, built-in date window, and 50m water resistance. A perfect wear for corporate and wedding parties.',
    stock: 8,
    badge: 'Premium',
    specs: {
      'Brand': 'Titan',
      'Series': 'Neo Chronograph',
      'Strap Material': 'Stainless Steel',
      'Water Resistance': '50 Meters',
      'Warranty': '2 Years Manufacturer Warranty'
    },
    reviews: [
      { id: 'r4', name: 'Amit Sengupta', rating: 5, text: 'Very royal look. Titan never fails to impress. Completely worth the price.', date: '2026-05-10', verified: true, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80' },
      { id: 'r5', name: 'Rohan Deshmukh', rating: 5, text: 'Ideal chronograph dial. Looks premium on standard wrist sizes.', date: '2026-05-22', verified: true }
    ]
  },
  {
    id: 3,
    name: 'Red Tape Classic Sporty Comfort Sneakers',
    price: 1899,
    originalPrice: 4799,
    rating: 4.7,
    reviewsCount: 2,
    category: 'Shoes',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&auto=format&fit=crop&q=80'
    ],
    description: 'Step into absolute comfort with Red Tape sneakers. Designed with a memory foam cushioned sole, premium breathable PU upper, stable grip sole, and lightweight design. Recommended for casual daily college or office walks.',
    stock: 25,
    badge: '30% OFF',
    specs: {
      'Brand': 'Red Tape',
      'Material': 'Synthetic PU upper',
      'Sole Material': 'Eva / Rubber',
      'Cushioning': 'Memory Foam Tech',
      'Closure': 'Lace-Up'
    },
    reviews: [
      { id: 'r6', name: 'Sneha Reddy', rating: 4, text: 'Very comfortable sneakers. Soft cushioning. Fit is exact.', date: '2026-05-12', verified: true },
      { id: 'r7', name: 'Vikram Malhotra', rating: 5, text: 'Best sneakers under 2000 rupees. Red Tape memory foam is exceptionally soft.', date: '2026-05-25', verified: true, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&auto=format&fit=crop&q=80' }
    ]
  },
  {
    id: 4,
    name: 'Mokobara The Transit Ergonomic Workpack',
    price: 4999,
    originalPrice: 6999,
    rating: 4.6,
    reviewsCount: 2,
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524498250428-ec03307248c8?w=500&auto=format&fit=crop&q=80'
    ],
    description: 'Mokobara Transit backpack is built for smart travelers. Features a dedicated 16-inch padded laptop compartment, integrated USB charging socket, hidden security passport pocket, and sleek water-resistant fabric.',
    stock: 12,
    specs: {
      'Brand': 'Mokobara',
      'Capacity': '25 Litres',
      'Laptop Slot': 'Up to 16 Inches',
      'Material': 'Water-Resistant Premium Nylon',
      'Warranty': '1 Year mokobara Warranty'
    },
    reviews: [
      { id: 'r8', name: 'Divya Iyer', rating: 5, text: 'Extremely aesthetic and neat design. Holds my Macbook Pro securely.', date: '2026-05-02', verified: true, image: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=300&auto=format&fit=crop&q=80' },
      { id: 'r9', name: 'Karthik Nair', rating: 4, text: 'Nice pockets. Highly functional. Price is slightly premium, but build quality is amazing.', date: '2026-05-18', verified: true }
    ]
  },
  {
    id: 5,
    name: 'Noise ColorFit Pulse 3 Smartwatch',
    price: 1999,
    originalPrice: 2999,
    rating: 4.5,
    reviewsCount: 2,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517502884422-41eaaced0168?w=500&auto=format&fit=crop&q=80'
    ],
    description: 'Stay connected with the Noise ColorFit Pulse 3. Features a large 1.96-inch HD display, bluetooth calling, SpO2 sensor, heart rate tracking, 100+ sports modes, and up to 7 days of long battery life.',
    stock: 30,
    badge: 'Popular',
    specs: {
      'Brand': 'Noise',
      'Screen Size': '1.96 Inches TFT HD',
      'Calling': 'Bluetooth Handfree Calling',
      'Battery': 'Up to 7 Days Pack',
      'Waterproof': 'IP68 Certified'
    },
    reviews: [
      { id: 'r10', name: 'Sanjay Dutt', rating: 4, text: 'Calling is clear. Screen is bright under Indian hot sun. Value for money.', date: '2026-05-14', verified: true },
      { id: 'r11', name: 'Ananya Sen', rating: 5, text: 'Very nice tracker. Accurate steps counting. Dial feels light on hand.', date: '2026-05-24', verified: true }
    ]
  },
  {
    id: 6,
    name: 'Wildhorn Premium Leather RFID Wallet',
    price: 699,
    originalPrice: 1299,
    rating: 4.8,
    reviewsCount: 1,
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1627124718414-0da7a551c19b?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=500&auto=format&fit=crop&q=80'
    ],
    description: 'Wildhorn wallet is handcrafted with 100% genuine hunter leather. Includes dynamic RFID blocking protection to secure your Indian bank debit/credit cards, 6 card slots, and dual cash slots.',
    stock: 50,
    specs: {
      'Brand': 'Wildhorn',
      'Material': '100% Genuine Leather',
      'Technology': 'RFID Blocking Secure',
      'Slots': '6 Card, 2 Cash Slots',
      'Warranty': '6 Months leather warranty'
    },
    reviews: [
      { id: 'r12', name: 'Arjun Kapoor', rating: 5, text: 'Pure leather. Authentic texture. Card slots are tight and secure.', date: '2026-05-08', verified: true }
    ]
  },
  {
    id: 7,
    name: 'Maono AU-A04 USB Professional Mic Kit',
    price: 3499,
    originalPrice: 5999,
    rating: 4.7,
    reviewsCount: 1,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1590608897129-79da98d15969?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590608897224-b0a316887556?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&auto=format&fit=crop&q=80'
    ],
    description: 'The Maono USB Microphone kit is designed for Indian podcasters, YouTubers, and voiceover artists. Plug-and-play USB connection, premium metal boom arm stand, pop filter, and studio-grade sound capture.',
    stock: 0,
    badge: 'Out of Stock',
    specs: {
      'Brand': 'Maono',
      'Connection': 'USB Plug and Play',
      'Sensor': '16mm Condenser Transducer',
      'Pattern': 'Cardioid Noise Pickup',
      'Inclusions': 'Boom Arm, Shock Mount, Pop Filter'
    },
    reviews: [
      { id: 'r13', name: 'Harish Kumar', rating: 5, text: 'No static noise. Connected instantly to my Windows PC. Perfect for online teaching!', date: '2026-05-05', verified: true }
    ]
  },
  {
    id: 8,
    name: 'FabIndia Premium Slim Fit Cotton Kurta',
    price: 1499,
    originalPrice: 1999,
    rating: 4.4,
    reviewsCount: 1,
    category: 'Fashion',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&auto=format&fit=crop&q=80'
    ],
    description: 'FabIndia hand-woven pure cotton slim-fit kurta for men. Crafted with light breathable fabric, band collar, elegant wooden buttons, and a clean finish. Fits perfectly for festive celebrations and everyday ethnic wear.',
    stock: 18,
    specs: {
      'Brand': 'FabIndia',
      'Material': '100% Pure Cotton',
      'Collar': 'Mandarin Band Collar',
      'Fit': 'Slim Fit',
      'Care': 'Hand Wash Separately'
    },
    reviews: [
      { id: 'r14', name: 'Meera Deshmukh', rating: 4, text: 'Fabric is very premium. Elegant fitting. Hand washed, color is stable.', date: '2026-05-19', verified: true }
    ]
  },
  {
    id: 9,
    name: 'Minimalist Ceramic Flower Vase Set',
    price: 1299,
    originalPrice: 1999,
    rating: 4.6,
    reviewsCount: 1,
    category: 'Home & Decor',
    images: [
      'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=500&auto=format&fit=crop&q=80'
    ],
    description: 'Handcrafted minimalist ceramic flower vases. Set of 3 vases in warm beige, terracotta, and soft grey. Perfect for modern living room decor, dry flowers, or pampas grass.',
    stock: 12,
    specs: {
      'Material': 'Stoneware Ceramic',
      'Finish': 'Matte Textured',
      'Set Includes': '3 Vases (Small, Medium, Large)'
    },
    reviews: [
      { id: 'r15', name: 'Nisha Gupta', rating: 5, text: 'Very chic and matches my Scandinavian home decor perfectly.', date: '2026-05-25', verified: true }
    ]
  },
  {
    id: 10,
    name: 'Premium Anti-Slip TPE Yoga Mat',
    price: 1499,
    originalPrice: 2499,
    rating: 4.7,
    reviewsCount: 1,
    category: 'Sports & Fitness',
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500&auto=format&fit=crop&q=80'
    ],
    description: 'Eco-friendly dual-layer TPE yoga mat with alignment lines. 6mm thickness offers optimal cushioning and joint protection. Waterproof, sweat-resistant, and comes with a carrying strap.',
    stock: 20,
    specs: {
      'Material': 'Eco-Friendly TPE',
      'Thickness': '6mm',
      'Dimensions': '183cm x 61cm',
      'Features': 'Body Alignment System'
    },
    reviews: [
      { id: 'r16', name: 'Anik Sen', rating: 5, text: 'Excellent grip even when sweaty. Highly recommended!', date: '2026-05-27', verified: true }
    ]
  },
  {
    id: 11,
    name: 'Classic Hardcover Dotted Journal & Pen Set',
    price: 699,
    originalPrice: 999,
    rating: 4.8,
    reviewsCount: 1,
    category: 'Books & Stationery',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=80'
    ],
    description: 'Premium hardcover bullet journal with 160 pages of 120GSM ink-proof dotted paper. Comes with an elegant gold-accented metal ballpoint pen, expandible back pocket, and double ribbon bookmarks.',
    stock: 30,
    specs: {
      'Paper Weight': '120 GSM',
      'Pages': '160 Pages',
      'Layout': '5mm Dotted Grid',
      'Pen Included': 'Yes'
    },
    reviews: [
      { id: 'r17', name: 'Kavita Das', rating: 5, text: 'The paper is so thick, no ghosting or bleeding even with fountain pens!', date: '2026-05-29', verified: true }
    ]
  }
];

const seedDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nexcart');
    console.log(`MongoDB Connected for Seeding: ${conn.connection.host}`);
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products.');

    // Insert new products
    await Product.insertMany(products);
    console.log('Seeded 11 premium default products successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
