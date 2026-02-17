import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../utils/database';
import Admin from '../models/Admin';
import User from '../models/User';
import Product from '../models/Product';
import Order from '../models/Order';

const seedAll = async () => {
  try {
    console.log('🌱 Starting complete database seeding...\n');
    
    await connectDatabase();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      Admin.deleteMany({}),
      User.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({})
    ]);
    console.log('✅ Cleared all collections\n');

    // 1. Create Admin
    console.log('👤 Creating admin account...');
    const admin = new Admin({
      email: 'admin@watchstore.com',
      password: 'admin123',
      firstName: 'Super',
      lastName: 'Admin',
      role: 'super-admin'
    });
    await admin.save();
    console.log('✅ Admin created: admin@watchstore.com / admin123\n');

    // 2. Create Users
    console.log('👥 Creating users...');
    const users = await User.insertMany([
      {
        email: 'john.doe@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        addresses: [{
          type: 'shipping',
          firstName: 'John',
          lastName: 'Doe',
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
          phone: '+1234567890',
          isDefault: true
        }]
      },
      {
        email: 'jane.smith@example.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+1234567891',
        addresses: [{
          type: 'shipping',
          firstName: 'Jane',
          lastName: 'Smith',
          street: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90001',
          country: 'USA',
          phone: '+1234567891',
          isDefault: true
        }]
      },
      {
        email: 'mike.johnson@example.com',
        password: 'password123',
        firstName: 'Mike',
        lastName: 'Johnson',
        phone: '+1234567892',
        addresses: [{
          type: 'shipping',
          firstName: 'Mike',
          lastName: 'Johnson',
          street: '789 Pine Rd',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA',
          phone: '+1234567892',
          isDefault: true
        }]
      },
      {
        email: 'sarah.williams@example.com',
        password: 'password123',
        firstName: 'Sarah',
        lastName: 'Williams',
        phone: '+1234567893',
        addresses: [{
          type: 'shipping',
          firstName: 'Sarah',
          lastName: 'Williams',
          street: '321 Elm St',
          city: 'Houston',
          state: 'TX',
          zipCode: '77001',
          country: 'USA',
          phone: '+1234567893',
          isDefault: true
        }]
      },
      {
        email: 'david.brown@example.com',
        password: 'password123',
        firstName: 'David',
        lastName: 'Brown',
        phone: '+1234567894',
        addresses: [{
          type: 'shipping',
          firstName: 'David',
          lastName: 'Brown',
          street: '654 Maple Dr',
          city: 'Phoenix',
          state: 'AZ',
          zipCode: '85001',
          country: 'USA',
          phone: '+1234567894',
          isDefault: true
        }]
      }
    ]);
    console.log(`✅ Created ${users.length} users\n`);

    // 3. Create Products
    console.log('⌚ Creating products...');
    const products = await Product.insertMany([
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
        image: "https://images.unsplash.com/photo-1673997303871-178507ca875a?q=80&w=880&auto=format&fit=crop",
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
        image: "https://images.unsplash.com/photo-1595520407624-66b24f015830?q=80&w=1170&auto=format&fit=crop",
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
        image: "https://images.unsplash.com/photo-1611353229593-16439c293495?q=80&w=1170&auto=format&fit=crop",
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
      },
      {
        name: "Citizen Eco-Drive",
        price: 275,
        image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1000&auto=format&fit=crop",
        description: "Eco-friendly solar-powered watch.",
        brand: "Citizen",
        category: "Casual",
        movement: "Solar",
        caseMaterial: "Stainless Steel",
        caseSize: "40mm",
        waterResistance: "100m",
        warranty: "5 years",
        features: ["Eco-Drive technology", "Date display", "Luminous hands", "Scratch-resistant crystal"],
        specifications: {
          "Case Diameter": "40mm",
          "Power Reserve": "6 months",
          "Crystal": "Mineral"
        },
        inStock: true,
        stockCount: 15,
        rating: 4.5,
        reviews: 92
      },
      {
        name: "Tissot PRX Powermatic 80",
        price: 650,
        image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1000&auto=format&fit=crop",
        description: "Swiss automatic watch with 80-hour power reserve.",
        brand: "Tissot",
        category: "Dress",
        movement: "Automatic",
        caseMaterial: "Stainless Steel",
        caseSize: "40mm",
        waterResistance: "100m",
        warranty: "2 years",
        features: ["80-hour power reserve", "Integrated bracelet", "See-through caseback", "Swiss Made"],
        specifications: {
          "Case Diameter": "40mm",
          "Power Reserve": "80 hours",
          "Movement": "Powermatic 80"
        },
        inStock: true,
        stockCount: 7,
        rating: 4.7,
        reviews: 54
      }
    ]);
    console.log(`✅ Created ${products.length} products\n`);

    // 4. Create Orders
    console.log('📦 Creating orders...');
    
    // Helper function to calculate order totals
    const calculateOrderTotals = (itemsTotal: number) => {
      const subtotal = itemsTotal;
      const tax = subtotal * 0.08; // 8% tax
      const shipping = subtotal > 500 ? 0 : 15; // Free shipping over $500
      const total = subtotal + tax + shipping;
      return { subtotal, tax, shipping, total };
    };
    
    const orders = await Order.insertMany([
      {
        user: users[0]._id,
        orderNumber: 'ORD-2026-001',
        items: [
          {
            product: products[0]._id,
            quantity: 1,
            price: products[0].price,
            name: products[0].name,
            image: products[0].image
          }
        ],
        ...calculateOrderTotals(products[0].price),
        status: 'delivered',
        paymentMethod: 'credit-card',
        shippingAddress: {
          type: 'shipping',
          firstName: users[0].firstName,
          lastName: users[0].lastName,
          street: users[0].addresses[0].street,
          city: users[0].addresses[0].city,
          state: users[0].addresses[0].state,
          zipCode: users[0].addresses[0].zipCode,
          country: users[0].addresses[0].country,
          phone: users[0].phone
        },
        trackingNumber: 'TRK123456789'
      },
      {
        user: users[1]._id,
        orderNumber: 'ORD-2026-002',
        items: [
          {
            product: products[1]._id,
            quantity: 1,
            price: products[1].price,
            name: products[1].name,
            image: products[1].image
          }
        ],
        ...calculateOrderTotals(products[1].price),
        status: 'shipped',
        paymentMethod: 'paypal',
        shippingAddress: {
          type: 'shipping',
          firstName: users[1].firstName,
          lastName: users[1].lastName,
          street: users[1].addresses[0].street,
          city: users[1].addresses[0].city,
          state: users[1].addresses[0].state,
          zipCode: users[1].addresses[0].zipCode,
          country: users[1].addresses[0].country,
          phone: users[1].phone
        },
        trackingNumber: 'TRK987654321'
      },
      {
        user: users[2]._id,
        orderNumber: 'ORD-2026-003',
        items: [
          {
            product: products[2]._id,
            quantity: 2,
            price: products[2].price,
            name: products[2].name,
            image: products[2].image
          }
        ],
        ...calculateOrderTotals(products[2].price * 2),
        status: 'processing',
        paymentMethod: 'credit-card',
        shippingAddress: {
          type: 'shipping',
          firstName: users[2].firstName,
          lastName: users[2].lastName,
          street: users[2].addresses[0].street,
          city: users[2].addresses[0].city,
          state: users[2].addresses[0].state,
          zipCode: users[2].addresses[0].zipCode,
          country: users[2].addresses[0].country,
          phone: users[2].phone
        }
      },
      {
        user: users[3]._id,
        orderNumber: 'ORD-2026-004',
        items: [
          {
            product: products[3]._id,
            quantity: 1,
            price: products[3].price,
            name: products[3].name,
            image: products[3].image
          }
        ],
        ...calculateOrderTotals(products[3].price),
        status: 'pending',
        paymentMethod: 'apple-pay',
        shippingAddress: {
          type: 'shipping',
          firstName: users[3].firstName,
          lastName: users[3].lastName,
          street: users[3].addresses[0].street,
          city: users[3].addresses[0].city,
          state: users[3].addresses[0].state,
          zipCode: users[3].addresses[0].zipCode,
          country: users[3].addresses[0].country,
          phone: users[3].phone
        }
      },
      {
        user: users[4]._id,
        orderNumber: 'ORD-2026-005',
        items: [
          {
            product: products[4]._id,
            quantity: 1,
            price: products[4].price,
            name: products[4].name,
            image: products[4].image
          },
          {
            product: products[5]._id,
            quantity: 1,
            price: products[5].price,
            name: products[5].name,
            image: products[5].image
          }
        ],
        ...calculateOrderTotals(products[4].price + products[5].price),
        status: 'delivered',
        paymentMethod: 'credit-card',
        shippingAddress: {
          type: 'shipping',
          firstName: users[4].firstName,
          lastName: users[4].lastName,
          street: users[4].addresses[0].street,
          city: users[4].addresses[0].city,
          state: users[4].addresses[0].state,
          zipCode: users[4].addresses[0].zipCode,
          country: users[4].addresses[0].country,
          phone: users[4].phone
        },
        trackingNumber: 'TRK555666777'
      },
      {
        user: users[0]._id,
        orderNumber: 'ORD-2026-006',
        items: [
          {
            product: products[6]._id,
            quantity: 1,
            price: products[6].price,
            name: products[6].name,
            image: products[6].image
          }
        ],
        ...calculateOrderTotals(products[6].price),
        status: 'shipped',
        paymentMethod: 'google-pay',
        shippingAddress: {
          type: 'shipping',
          firstName: users[0].firstName,
          lastName: users[0].lastName,
          street: users[0].addresses[0].street,
          city: users[0].addresses[0].city,
          state: users[0].addresses[0].state,
          zipCode: users[0].addresses[0].zipCode,
          country: users[0].addresses[0].country,
          phone: users[0].phone
        },
        trackingNumber: 'TRK111222333'
      },
      {
        user: users[1]._id,
        orderNumber: 'ORD-2026-007',
        items: [
          {
            product: products[7]._id,
            quantity: 1,
            price: products[7].price,
            name: products[7].name,
            image: products[7].image
          }
        ],
        ...calculateOrderTotals(products[7].price),
        status: 'processing',
        paymentMethod: 'credit-card',
        shippingAddress: {
          type: 'shipping',
          firstName: users[1].firstName,
          lastName: users[1].lastName,
          street: users[1].addresses[0].street,
          city: users[1].addresses[0].city,
          state: users[1].addresses[0].state,
          zipCode: users[1].addresses[0].zipCode,
          country: users[1].addresses[0].country,
          phone: users[1].phone
        }
      }
    ]);
    console.log(`✅ Created ${orders.length} orders\n`);

    // Summary
    console.log('🎉 Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Admins: 1`);
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Orders: ${orders.length}`);
    console.log('\n🔐 Admin Credentials:');
    console.log('   Email: admin@watchstore.com');
    console.log('   Password: admin123');
    console.log('\n👥 Sample User Credentials (all use password: password123):');
    users.slice(0, 3).forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email}`);
    });

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
  } finally {
    await disconnectDatabase();
  }
};

// Run the seeding script
if (require.main === module) {
  seedAll();
}

export default seedAll;
