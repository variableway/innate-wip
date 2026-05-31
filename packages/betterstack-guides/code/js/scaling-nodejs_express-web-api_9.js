# Source: https://betterstack.com/community/guides/scaling-nodejs/express-web-api/
# Original language: javascript
# Normalized: js
# Block index: 9

[label models/post.js]
import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/database.js';

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [3, 100]
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [10, Infinity]
    }
  },
  published: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  // Use created_at and updated_at instead of createdAt and updatedAt
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  
  // Use posts as the table name
  tableName: 'posts'
});

export default Post;