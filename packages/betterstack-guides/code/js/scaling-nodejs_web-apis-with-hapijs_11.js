# Source: https://betterstack.com/community/guides/scaling-nodejs/web-apis-with-hapijs/
# Original language: javascript
# Normalized: js
# Block index: 11

[label src/utils/validation.js]
import Joi from 'joi';

export const createPostSchema = Joi.object({
    title: Joi.string().trim().max(200).required()
        .messages({
            'string.max': 'Title cannot exceed 200 characters',
            'any.required': 'Title is required'
        }),
    content: Joi.string().trim().required()
        .messages({
            'any.required': 'Content is required'
        }),
    published: Joi.boolean().default(true),
    author: Joi.string().trim().required()
        .messages({
            'any.required': 'Author is required'
        }),
    tags: Joi.array().items(Joi.string().trim().lowercase()).default([])
});

export const updatePostSchema = Joi.object({
    title: Joi.string().trim().max(200),
    content: Joi.string().trim(),
    published: Joi.boolean(),
    author: Joi.string().trim(),
    tags: Joi.array().items(Joi.string().trim().lowercase())
}).min(1); // At least one field must be provided

export const postParamsSchema = Joi.object({
    id: Joi.string().hex().length(24).required()
        .messages({
            'string.hex': 'Invalid post ID format',
            'string.length': 'Invalid post ID length'
        })
});