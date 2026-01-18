# NexHome - Direct Buyer-Seller Real Estate Platform

A modern, full-stack real estate brokerage platform that connects buyers and sellers directly, eliminating the need for brokers. Built with Node.js, Express, SQLite, and modern web technologies.

## Features

### 🏠 Core Features
- **Direct Buyer-Seller Marketplace**: No brokers involved - connect directly with property owners
- **Property Search & Filters**: Advanced search with filters for location, price, bedrooms, property type, etc.
- **User Authentication**: Separate accounts for buyers and sellers
- **Property Listings**: Sellers can list properties with detailed information
- **Favorites System**: Save properties for later viewing
- **Inquiry System**: Buyers can contact sellers directly

### 🤖 AI & ML Features
- **AI Assistant**: Get instant answers to property-related questions
- **Property Valuation**: ML-based property value estimation
- **Loan Calculator**: Calculate mortgage payments with detailed breakdowns

### 🎨 Modern UI/UX
- Responsive design (mobile-friendly)
- Clean, NoBroker-inspired interface
- Real-time updates
- Toast notifications
- Modal-based interactions

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Authentication**: JWT (JSON Web Tokens)
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **AI**: OpenAI API (optional, with fallback)
- **Icons**: Font Awesome

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   cd NEXHOME-Demo-Project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set your configuration:
   - `PORT`: Server port (default: 3000)
   - `JWT_SECRET`: Secret key for JWT tokens (change this!)
   - `OPENAI_API_KEY`: Your OpenAI API key (optional, for AI assistant)

4. **Initialize the database**
   The database will be automatically created on first run.

5. **Start the server**
   ```bash
   npm start
   ```
   For development with auto-reload:
   ```bash
   npm run dev
   ```

6. **Access the application**
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Default Accounts

A default seller account is created automatically:
- **Email**: admin@nexhome.com
- **Password**: admin123

**Note**: Change this password in production!

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Properties
- `GET /api/properties` - Get all properties (with filters)
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property (seller only)
- `PUT /api/properties/:id` - Update property (seller only)
- `DELETE /api/properties/:id` - Delete property (seller only)
- `GET /api/properties/seller/my-properties` - Get seller's properties

### Search
- `GET /api/search` - Advanced property search

### Favorites
- `GET /api/favorites` - Get user's favorites
- `POST /api/favorites/:propertyId` - Add to favorites
- `DELETE /api/favorites/:propertyId` - Remove from favorites

### AI & Tools
- `POST /api/ai/chat` - Chat with AI assistant
- `POST /api/valuation/property` - Estimate property value
- `POST /api/valuation/loan` - Calculate loan estimate

### Inquiries
- `POST /api/inquiries` - Create inquiry (buyer to seller)
- `GET /api/inquiries/seller` - Get seller's inquiries
- `GET /api/inquiries/buyer` - Get buyer's inquiries

## Project Structure

```
NEXHOME-Demo-Project/
├── backend/
│   ├── database/
│   │   └── db.js              # Database setup and initialization
│   ├── middleware/
│   │   └── auth.js            # Authentication middleware
│   └── routes/
│       ├── auth.js            # Authentication routes
│       ├── properties.js     # Property CRUD routes
│       ├── search.js          # Search routes
│       ├── favorites.js       # Favorites routes
│       ├── ai.js              # AI assistant routes
│       ├── valuation.js       # Valuation & loan routes
│       └── inquiries.js          # Inquiry routes
├── public/
│   ├── index.html             # Main frontend file
│   ├── styles.css             # Stylesheet
│   └── app.js                 # Frontend JavaScript
├── server.js                  # Express server setup
├── package.json               # Dependencies
├── .env.example               # Environment variables template
└── README.md                  # This file
```

## Usage Guide

### For Buyers
1. **Sign Up** as a buyer
2. **Search** for properties using filters
3. **Save** properties to favorites
4. **Contact sellers** directly through inquiries
5. **Use tools** like valuation and loan calculator

### For Sellers
1. **Sign Up** as a seller
2. **List your property** with details and images
3. **Manage listings** from your dashboard
4. **Respond to inquiries** from interested buyers

## Features in Detail

### Property Valuation
The ML model estimates property value based on:
- Property type and size
- Location (city/area)
- Number of bedrooms and bathrooms
- Year built
- Parking availability

### Loan Calculator
Calculate mortgage payments with:
- Property price
- Down payment percentage
- Interest rate
- Loan term
- Detailed payment breakdown

### AI Assistant
Get instant help with:
- Property search tips
- Pricing information
- Loan and mortgage questions
- General real estate queries

## Development

### Running in Development Mode
```bash
npm run dev
```
This uses nodemon for auto-reload on file changes.

### Database
The SQLite database file (`nexhome.db`) is created automatically in the `backend/database/` directory.

To reset the database, delete `backend/database/nexhome.db` and restart the server.

## Production Deployment

Before deploying to production:

1. **Change JWT_SECRET** in `.env` to a strong, random secret
2. **Set up proper database** (consider PostgreSQL for production)
3. **Configure HTTPS**
4. **Set up environment variables** on your hosting platform
5. **Remove default admin account** or change password
6. **Enable rate limiting** for API endpoints
7. **Set up proper logging**
8. **Configure CORS** properly for your domain

## License

MIT License

## Support

For issues and questions, please open an issue on the repository.

---

**Built with ❤️ for direct buyer-seller real estate transactions**
