const { DataTypes } = require('sequelize');
const slugify = require('slugify');
const { sequelize } = require('../config/db');

const Property = sequelize.define('Property', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('Apartment', 'Villa', 'House', 'Plot', 'Commercial', 'Farm House'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'pending', 'sold', 'rented'),
    defaultValue: 'pending'
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Salem'
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Tamil Nadu'
  },
  zipCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  pricePerSqFt: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  propertySize: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Size in square feet'
  },
  lotSize: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Size in square feet'
  },
  bedrooms: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  bathrooms: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  yearBuilt: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  features: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  mainImage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: (property) => {
      property.slug = slugify(property.title, { lower: true, strict: true });
    },
    beforeUpdate: (property) => {
      if (property.changed('title')) {
        property.slug = slugify(property.title, { lower: true, strict: true });
      }
    }
  }
});

module.exports = Property;