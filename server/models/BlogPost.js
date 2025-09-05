const { DataTypes } = require('sequelize');
const slugify = require('slugify');
const { sequelize } = require('../config/db');

const BlogPost = sequelize.define('BlogPost', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    unique: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  excerpt: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  featuredImage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('draft', 'published'),
    defaultValue: 'draft'
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  metaTitle: {
    type: DataTypes.STRING,
    allowNull: true
  },
  metaDescription: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: (post) => {
      post.slug = slugify(post.title, { lower: true, strict: true });
      
      if (!post.excerpt && post.content) {
        post.excerpt = post.content.substring(0, 160) + '...';
      }
      
      if (!post.metaTitle) {
        post.metaTitle = post.title;
      }
      
      if (!post.metaDescription && post.excerpt) {
        post.metaDescription = post.excerpt;
      }
    },
    beforeUpdate: (post) => {
      if (post.changed('title')) {
        post.slug = slugify(post.title, { lower: true, strict: true });
      }
      
      if (post.changed('content') && !post.changed('excerpt')) {
        post.excerpt = post.content.substring(0, 160) + '...';
      }
      
      if (post.changed('title') && !post.changed('metaTitle')) {
        post.metaTitle = post.title;
      }
      
      if (post.changed('excerpt') && !post.changed('metaDescription')) {
        post.metaDescription = post.excerpt;
      }
    }
  }
});

module.exports = BlogPost;