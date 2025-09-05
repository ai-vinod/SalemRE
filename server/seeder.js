const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Import database and models
const db = require('./config/db');
const { User, Property, BlogPost, Inquiry } = require('./models');

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
    phone: '555-123-4567',
    status: 'active'
  },
  {
    name: 'Agent User',
    email: 'agent@example.com',
    password: 'password123',
    role: 'agent',
    phone: '555-987-6543',
    status: 'active'
  },
  {
    name: 'Regular User',
    email: 'user@example.com',
    password: 'password123',
    role: 'user',
    status: 'active'
  }
];

const properties = [
  {
    title: 'Modern Luxury Villa with Ocean View',
    description: 'This stunning modern villa offers breathtaking ocean views and luxurious amenities. Features include a private pool, spacious living areas, and state-of-the-art kitchen. Perfect for those seeking a high-end lifestyle.',
    type: 'Villa',
    status: 'For Sale',
    location: 'Malibu, CA',
    price: 2500000,
    bedrooms: 5,
    bathrooms: 4,
    area: 4200,
    features: ['Swimming Pool', 'Ocean View', 'Smart Home', 'Security System', 'Garden'],
    images: [
      'https://res.cloudinary.com/demo/image/upload/v1/salem-re/properties/villa1.jpg'
    ],
    isFeatured: true
  },
  {
    title: 'Downtown Luxury Apartment',
    description: 'Elegant apartment in the heart of downtown. Features high ceilings, hardwood floors, and modern appliances. Walking distance to restaurants, shops, and entertainment.',
    type: 'Apartment',
    status: 'For Rent',
    location: 'Downtown, Salem',
    price: 2500,
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    features: ['Hardwood Floors', 'City View', 'Fitness Center', 'Concierge', 'Parking'],
    images: [
      'https://res.cloudinary.com/demo/image/upload/v1/salem-re/properties/apartment1.jpg'
    ],
    isFeatured: true
  },
  {
    title: 'Suburban Family Home',
    description: 'Spacious family home in a quiet suburban neighborhood. Features a large backyard, updated kitchen, and finished basement. Close to schools, parks, and shopping centers.',
    type: 'House',
    status: 'For Sale',
    location: 'Suburbia, Salem',
    price: 450000,
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    features: ['Backyard', 'Garage', 'Basement', 'Fireplace', 'Patio'],
    images: [
      'https://res.cloudinary.com/demo/image/upload/v1/salem-re/properties/house1.jpg'
    ],
    isFeatured: false
  }
];

const blogPosts = [
  {
    title: 'Top 10 Tips for First-Time Home Buyers',
    content: 'Buying your first home can be both exciting and overwhelming. Here are our top 10 tips to help you navigate the process with confidence. From securing financing to closing the deal, we cover everything you need to know to make your first home purchase a success.',
    status: 'published',
    categories: ['Buying', 'Tips', 'First-Time Buyers'],
    tags: ['home buying', 'mortgage', 'first-time buyer', 'real estate tips'],
    featuredImage: 'https://res.cloudinary.com/demo/image/upload/v1/salem-re/blog/home-buying-tips.jpg'
  },
  {
    title: 'Investment Properties: What You Need to Know',
    content: 'Investing in real estate can be a lucrative opportunity, but it requires careful planning and knowledge. This comprehensive guide covers the essentials of property investment, including market analysis, financing options, and property management considerations.',
    status: 'published',
    categories: ['Investment', 'Finance', 'Property Management'],
    tags: ['investment property', 'real estate investment', 'passive income', 'property management'],
    featuredImage: 'https://res.cloudinary.com/demo/image/upload/v1/salem-re/blog/investment-property.jpg'
  },
  {
    title: 'The Latest Trends in Home Design for 2023',
    content: 'Stay ahead of the curve with our roundup of the hottest home design trends for 2023. From sustainable materials to smart home technology, we explore the innovations that are shaping modern living spaces and enhancing quality of life.',
    status: 'published',
    categories: ['Design', 'Trends', 'Home Improvement'],
    tags: ['home design', 'interior design', 'trends', 'smart home', 'sustainable living'],
    featuredImage: 'https://res.cloudinary.com/demo/image/upload/v1/salem-re/blog/design-trends.jpg'
  }
];

const inquiries = [
  {
    name: 'John Smith',
    email: 'john@example.com',
    message: 'I am interested in the Downtown Luxury Apartment. Is it still available for rent? I would like to schedule a viewing this weekend if possible.',
    propertyType: 'Apartment',
    budget: '2000-3000',
    location: 'Downtown',
    status: 'new'
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    message: 'I am looking for a family home in the suburbs with at least 4 bedrooms. Do you have any listings that match this criteria?',
    propertyType: 'House',
    budget: '400000-500000',
    location: 'Suburbs',
    status: 'in-progress'
  }
];

// Seed database
const seedDatabase = async () => {
  try {
    // Sync database (force: true will drop tables if they exist)
    await db.sync({ force: true });
    console.log('Database synced');

    // Create users
    const createdUsers = [];
    for (const user of users) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      
      const createdUser = await User.create(user);
      createdUsers.push(createdUser);
    }
    console.log(`${createdUsers.length} users created`);

    // Create properties
    const createdProperties = [];
    for (let i = 0; i < properties.length; i++) {
      const property = properties[i];
      // Assign to admin user
      property.userId = createdUsers[0].id;
      
      const createdProperty = await Property.create(property);
      createdProperties.push(createdProperty);
    }
    console.log(`${createdProperties.length} properties created`);

    // Create blog posts
    const createdBlogPosts = [];
    for (let i = 0; i < blogPosts.length; i++) {
      const blogPost = blogPosts[i];
      // Assign to admin user
      blogPost.userId = createdUsers[0].id;
      
      const createdBlogPost = await BlogPost.create(blogPost);
      createdBlogPosts.push(createdBlogPost);
    }
    console.log(`${createdBlogPosts.length} blog posts created`);

    // Create inquiries
    const createdInquiries = [];
    for (let i = 0; i < inquiries.length; i++) {
      const inquiry = inquiries[i];
      // Assign to regular user and a property
      inquiry.userId = createdUsers[2].id;
      inquiry.propertyId = createdProperties[i].id;
      
      const createdInquiry = await Inquiry.create(inquiry);
      createdInquiries.push(createdInquiry);
    }
    console.log(`${createdInquiries.length} inquiries created`);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();