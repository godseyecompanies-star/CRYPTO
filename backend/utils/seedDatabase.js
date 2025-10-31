const mongoose = require('mongoose');
const User = require('../models/User');
const Coin = require('../models/Coin');
const Settings = require('../models/Settings');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({ role: 'admin' });
    await Coin.deleteMany({});
    await Settings.deleteMany({});

    // Create admin user
    const adminUser = await User.create({
      phoneNumber: '+919999999999',
      password: 'Admin@123',
      fullName: 'Admin User',
      email: 'admin@cryptocoins.com',
      role: 'admin',
      isActive: true,
    });

    console.log('✅ Admin user created');
    console.log('   Phone: +919999999999');
    console.log('   Password: Admin@123');

    // Create top 15 popular coins ordered by price (highest to lowest)
    const coins = [
      {
        name: 'Bitcoin',
        symbol: 'BTC',
        currentPrice: 3500000,
        priceChange24h: 2.5,
        profitPercentage: 8.5,
        isActive: true,
      },
      {
        name: 'Ethereum',
        symbol: 'ETH',
        currentPrice: 250000,
        priceChange24h: 3.2,
        profitPercentage: 7.8,
        isActive: true,
      },
      {
        name: 'Binance Coin',
        symbol: 'BNB',
        currentPrice: 45000,
        priceChange24h: 1.8,
        profitPercentage: 6.5,
        isActive: true,
      },
      {
        name: 'Solana',
        symbol: 'SOL',
        currentPrice: 12000,
        priceChange24h: 5.5,
        profitPercentage: 9.2,
        isActive: true,
      },
      {
        name: 'Avalanche',
        symbol: 'AVAX',
        currentPrice: 4000,
        priceChange24h: 4.3,
        profitPercentage: 7.5,
        isActive: true,
      },
      {
        name: 'Polkadot',
        symbol: 'DOT',
        currentPrice: 800,
        priceChange24h: 2.8,
        profitPercentage: 6.8,
        isActive: true,
      },
      {
        name: 'Tether',
        symbol: 'USDT',
        currentPrice: 83,
        priceChange24h: 0.1,
        profitPercentage: 2.5,
        isActive: true,
      },
      {
        name: 'Polygon',
        symbol: 'MATIC',
        currentPrice: 75,
        priceChange24h: 3.5,
        profitPercentage: 7.2,
        isActive: true,
      },
      {
        name: 'Litecoin',
        symbol: 'LTC',
        currentPrice: 70,
        priceChange24h: 1.9,
        profitPercentage: 5.8,
        isActive: true,
      },
      {
        name: 'Chainlink',
        symbol: 'LINK',
        currentPrice: 65,
        priceChange24h: 2.4,
        profitPercentage: 6.3,
        isActive: true,
      },
      {
        name: 'Ripple',
        symbol: 'XRP',
        currentPrice: 55,
        priceChange24h: 2.1,
        profitPercentage: 6.0,
        isActive: true,
      },
      {
        name: 'Cardano',
        symbol: 'ADA',
        currentPrice: 45,
        priceChange24h: -1.2,
        profitPercentage: 5.5,
        isActive: true,
      },
      {
        name: 'Tron',
        symbol: 'TRX',
        currentPrice: 15,
        priceChange24h: 1.5,
        profitPercentage: 5.2,
        isActive: true,
      },
      {
        name: 'Dogecoin',
        symbol: 'DOGE',
        currentPrice: 12,
        priceChange24h: 4.3,
        profitPercentage: 8.0,
        isActive: true,
      },
      {
        name: 'Shiba Inu',
        symbol: 'SHIB',
        currentPrice: 0.002,
        priceChange24h: 5.8,
        profitPercentage: 10.5,
        isActive: true,
      },
    ];

    await Coin.insertMany(coins);
    console.log('✅ Top 15 popular coins created (ordered by price)');

    // Create default settings
    await Settings.create({
      qrCodeImage: '',
      maintenanceMode: false,
      platformFee: 0,
    });

    console.log('✅ Default settings created');
    console.log('\n🎉 Database seeded successfully!');
    console.log('\nYou can now:');
    console.log('1. Login as admin with phone: +919999999999 and password: Admin@123');
    console.log('2. Register new users through the app');
    console.log('3. Start using the platform\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
