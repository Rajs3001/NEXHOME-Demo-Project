# Quick Setup Guide

## Environment Variables

Create a `.env` file in the root directory with the following:

```
PORT=3000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
OPENAI_API_KEY=sk-your-openai-api-key-here
```

**Note**: 
- Change `JWT_SECRET` to a strong random string in production
- `OPENAI_API_KEY` is optional - the AI assistant will work with a fallback if not provided

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Open browser:
   ```
   http://localhost:3000
   ```

## Default Login

- Email: `admin@nexhome.com`
- Password: `admin123`

**Important**: Change this password in production!

## Features

✅ Direct buyer-seller marketplace (no brokers)
✅ User authentication (buyer/seller accounts)
✅ Property search and filters
✅ AI assistant
✅ Property valuation tool
✅ Loan calculator
✅ Favorites system
✅ Direct messaging between buyers and sellers

