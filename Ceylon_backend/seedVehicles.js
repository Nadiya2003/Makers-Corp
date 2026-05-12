require('dotenv').config();
const mongoose = require('mongoose');
const Vehicle = require('./models/Vehicle');

const vehicles = [
  {
    name: 'Toyota Land Cruiser Prado',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    year: '2023',
    fuel: 'Petrol',
    mileage: '4,500 km',
    price: '38,500,000',
    category: 'SUV',
    isFeatured: true
  },
  {
    name: 'Honda Vezel e:HEV',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    year: '2022',
    fuel: 'Hybrid',
    mileage: '12,000 km',
    price: '14,200,000',
    category: 'SUV',
    isFeatured: true
  },
  {
    name: 'Suzuki Swift RS',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    year: '2021',
    fuel: 'Petrol',
    mileage: '28,000 km',
    price: '8,500,000',
    category: 'Hatchback',
    isFeatured: true
  },
  {
    name: 'Toyota CH-R G-T',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    year: '2020',
    fuel: 'Petrol',
    mileage: '35,000 km',
    price: '12,800,000',
    category: 'SUV',
    isFeatured: true
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding');
    
    await Vehicle.deleteMany({});
    console.log('Cleared existing vehicles');
    
    await Vehicle.insertMany(vehicles);
    console.log('Seeded vehicles successfully');
    
    process.exit();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();
