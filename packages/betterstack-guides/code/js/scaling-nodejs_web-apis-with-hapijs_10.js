# Source: https://betterstack.com/community/guides/scaling-nodejs/web-apis-with-hapijs/
# Original language: javascript
# Normalized: js
# Block index: 10

[label src/models/Post.js]
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    published: {
        type: Boolean,
        default: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }]
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

export const Post = mongoose.model('Post', postSchema);