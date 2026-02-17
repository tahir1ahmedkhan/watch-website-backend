import dotenv from 'dotenv';
import { connectDatabase, disconnectDatabase } from '../utils/database';
import Product from '../models/Product';

// Load environment variables
dotenv.config();

const watchesData = [
  {
    name: "Rolex Submariner",
    price: 1200,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    description: "Luxury diving watch with premium build quality.",
    brand: "Rolex",
    category: "Diving",
    movement: "Automatic",
    caseMaterial: "Stainless Steel",
    caseSize: "40mm",
    waterResistance: "300m",
    warranty: "2 years",
    features: ["Unidirectional rotating bezel", "Luminescent markers", "Screw-down crown", "Anti-reflective sapphire crystal"],
    specifications: {
      "Case Diameter": "40mm",
      "Case Thickness": "12.5mm",
      "Lug Width": "20mm",
      "Crystal": "Sapphire",
      "Bezel": "Unidirectional rotating",
      "Crown": "Screw-down",
      "Clasp": "Oysterlock safety clasp"
    },
    inStock: true,
    stockCount: 5,
    rating: 4.8,
    reviews: 127
  },
  {
    name: "Apple Watch Series 9",
    price: 499,
    image: "https://images.unsplash.com/photo-1673997303871-178507ca875a?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Smartwatch with fitness and health tracking.",
    brand: "Apple",
    category: "Smartwatch",
    movement: "Digital",
    caseMaterial: "Aluminum",
    caseSize: "45mm",
    waterResistance: "50m",
    warranty: "1 year",
    features: ["Heart rate monitoring", "GPS tracking", "Cellular connectivity", "Always-on Retina display", "ECG app", "Blood oxygen monitoring"],
    specifications: {
      "Case Diameter": "45mm",
      "Case Thickness": "10.7mm",
      "Display": "Always-On Retina LTPO OLED",
      "Processor": "S9 SiP",
      "Storage": "64GB",
      "Battery Life": "Up to 18 hours",
      "Connectivity": "Wi-Fi, Bluetooth, Cellular"
    },
    inStock: true,
    stockCount: 12,
    rating: 4.6,
    reviews: 89
  },
  {
    name: "Casio G-Shock",
    price: 199,
    image: "https://images.unsplash.com/photo-1595520407624-66b24f015830?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Durable watch with shock resistance.",
    brand: "Casio",
    category: "Sports",
    movement: "Quartz",
    caseMaterial: "Resin",
    caseSize: "48mm",
    waterResistance: "200m",
    warranty: "2 years",
    features: ["Shock resistant", "Multi-function alarm", "Stopwatch", "World time", "LED backlight", "Auto calendar"],
    specifications: {
      "Case Diameter": "48mm",
      "Case Thickness": "16.3mm",
      "Weight": "67g",
      "Battery Life": "Approximately 2 years",
      "Functions": "Stopwatch, Timer, Alarm, World Time",
      "Display": "Digital LCD",
      "Band Material": "Resin"
    },
    inStock: true,
    stockCount: 8,
    rating: 4.4,
    reviews: 156
  },
  {
    name: "Omega Speedmaster",
    price: 3500,
    image: "https://images.unsplash.com/photo-1594534475808-b18fc33b045e",
    description: "Professional chronograph worn on the moon.",
    brand: "Omega",
    category: "Chronograph",
    movement: "Manual Wind",
    caseMaterial: "Stainless Steel",
    caseSize: "42mm",
    waterResistance: "50m",
    warranty: "5 years",
    features: ["Tachymeter bezel", "Chronograph function", "Hesalite crystal", "Manual winding", "Moon watch heritage"],
    specifications: {
      "Case Diameter": "42mm",
      "Case Thickness": "13mm",
      "Lug Width": "20mm",
      "Crystal": "Hesalite",
      "Movement": "Calibre 1861",
      "Power Reserve": "48 hours",
      "Frequency": "21,600 vph"
    },
    inStock: true,
    stockCount: 3,
    rating: 4.9,
    reviews: 78
  },
  {
    name: "TAG Heuer Formula 1",
    price: 1100,
    image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3",
    description: "Racing-inspired luxury sports watch.",
    brand: "TAG Heuer",
    category: "Sports",
    movement: "Quartz",
    caseMaterial: "Stainless Steel",
    caseSize: "43mm",
    waterResistance: "200m",
    warranty: "2 years",
    features: ["Unidirectional rotating bezel", "Luminous hands", "Date display", "Scratch-resistant sapphire crystal"],
    specifications: {
      "Case Diameter": "43mm",
      "Case Thickness": "12mm",
      "Crystal": "Sapphire",
      "Bezel": "Unidirectional rotating",
      "Band Material": "Stainless Steel"
    },
    inStock: true,
    stockCount: 6,
    rating: 4.5,
    reviews: 42
  },
  {
    name: "Seiko Prospex",
    price: 350,
    image: "https://images.unsplash.com/photo-1611353229593-16439c293495?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Professional diving watch with solar movement.",
    brand: "Seiko",
    category: "Diving",
    movement: "Solar",
    caseMaterial: "Stainless Steel",
    caseSize: "42mm",
    waterResistance: "200m",
    warranty: "3 years",
    features: ["Solar powered", "Date display", "Rotating bezel", "Luminous markers"],
    specifications: {
      "Case Diameter": "42mm",
      "Movement": "Solar V157",
      "Battery Life": "10 months (fully charged)"
    },
    inStock: true,
    stockCount: 9,
    rating: 4.3,
    reviews: 67
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    await connectDatabase();
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');
    
    // Insert new products
    const products = await Product.insertMany(watchesData);
    console.log(`✅ Inserted ${products.length} products`);
    
    console.log('🎉 Database seeding completed successfully!');
    
    // Display inserted products
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.price} (${product.brand})`);
    });
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
  } finally {
    await disconnectDatabase();
  }
};

// Run the seeding script
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;