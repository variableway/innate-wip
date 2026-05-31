# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-flask/
# Original language: python
# Normalized: python
# Block index: 18

[label schemas/post.py]
from marshmallow import Schema, fields, validate

class PostSchema(Schema):
    id = fields.String(dump_only=True)
    title = fields.String(required=True, validate=validate.Length(min=3, max=100))
    content = fields.String(required=True, validate=validate.Length(min=10))
    published = fields.Boolean(missing=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class PostQuerySchema(Schema):
    published = fields.Boolean(missing=None)