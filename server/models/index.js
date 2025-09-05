const User = require('./User');
const Property = require('./Property');
const BlogPost = require('./BlogPost');
const Inquiry = require('./Inquiry');

// Define relationships

// User - Property relationship (one-to-many)
User.hasMany(Property, { foreignKey: 'userId', as: 'properties' });
Property.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

// User - BlogPost relationship (one-to-many)
User.hasMany(BlogPost, { foreignKey: 'userId', as: 'posts' });
BlogPost.belongsTo(User, { foreignKey: 'userId', as: 'author' });

// Property - Inquiry relationship (one-to-many)
Property.hasMany(Inquiry, { foreignKey: 'propertyId', as: 'inquiries' });
Inquiry.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });

// User - Inquiry relationship (one-to-many)
User.hasMany(Inquiry, { foreignKey: 'userId', as: 'userInquiries' });
Inquiry.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  User,
  Property,
  BlogPost,
  Inquiry
};