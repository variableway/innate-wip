# Source: https://betterstack.com/community/guides/scaling-nodejs/rails-vs-express/
# Original language: bash
# Normalized: sh
# Block index: 13

# Development workflow depends on chosen tools
npm install --save-dev nodemon jest supertest
npm install mongoose express-session connect-mongo

# Custom npm scripts for development
npm run dev    # nodemon app.js
npm run test   # jest
npm run build  # webpack or custom build process

# Database management varies by choice
mongosh        # MongoDB shell
psql           # PostgreSQL shell
npm run migrate # Custom migration scripts