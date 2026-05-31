# Source: https://betterstack.com/community/guides/scaling-nodejs/rails-vs-express/
# Original language: javascript
# Normalized: js
# Block index: 18

// Choose testing framework (Jest, Mocha, etc.)
const request = require('supertest');
const app = require('../app');
const Product = require('../models/Product');

describe('Product API', () => {
  beforeEach(async () => {
    await Product.deleteMany({});
  });

  test('POST /products creates a new product', async () => {
    const productData = {
      name: 'Test Product',
      price: 25.99,
      description: 'A test product'
    };

    const response = await request(app)
      .post('/products')
      .send(productData)
      .expect(201);

    expect(response.body.name).toBe(productData.name);
    
    const product = await Product.findById(response.body._id);
    expect(product).toBeTruthy();
  });

  test('GET /products returns available products', async () => {
    await Product.create([
      { name: 'Product 1', price: 10, available: true },
      { name: 'Product 2', price: 20, available: false }
    ]);

    const response = await request(app)
      .get('/products')
      .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].name).toBe('Product 1');
  });
});