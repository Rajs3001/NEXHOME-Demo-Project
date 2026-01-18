# NexHome Project Structure

## 📁 Directory Structure

```
NEXHOME-Demo-Project/
├── backend/
│   ├── config/
│   │   ├── database.js          # Database configuration
│   │   └── upload.js            # File upload configuration
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Property.js          # Property model
│   │   ├── Favorite.js          # Favorite model
│   │   └── Inquiry.js           # Inquiry model
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── propertyController.js # Property CRUD logic
│   │   ├── searchController.js  # Search logic
│   │   ├── favoriteController.js # Favorites logic
│   │   ├── inquiryController.js # Inquiries logic
│   │   ├── aiController.js      # AI assistant logic
│   │   └── valuationController.js # Valuation logic
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── propertyRoutes.js   # Property endpoints
│   │   ├── searchRoutes.js     # Search endpoints
│   │   ├── favoriteRoutes.js   # Favorite endpoints
│   │   ├── inquiryRoutes.js    # Inquiry endpoints
│   │   ├── aiRoutes.js         # AI endpoints
│   │   ├── valuationRoutes.js  # Valuation endpoints
│   │   └── adminRoutes.js      # Admin endpoints
│   ├── middleware/
│   │   ├── auth.js              # Authentication middleware
│   │   ├── upload.js            # File upload middleware
│   │   └── validation.js       # Request validation
│   ├── services/
│   │   ├── aiService.js         # AI service
│   │   ├── valuationService.js  # Valuation service
│   │   └── imageService.js     # Image handling service
│   ├── database/
│   │   ├── db.js                # Database initialization
│   │   └── migrations/          # Database migrations
│   └── utils/
│       ├── logger.js            # Logging utility
│       └── helpers.js           # Helper functions
│
├── frontend/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginModal.js
│   │   │   ├── RegisterModal.js
│   │   │   └── AuthModal.test.js
│   │   ├── property/
│   │   │   ├── PropertyCard.js
│   │   │   ├── PropertyList.js
│   │   │   ├── PropertyDetails.js
│   │   │   ├── PropertyForm.js
│   │   │   └── PropertyCard.test.js
│   │   ├── search/
│   │   │   ├── SearchBar.js
│   │   │   ├── FilterPanel.js
│   │   │   └── SearchBar.test.js
│   │   ├── favorites/
│   │   │   ├── FavoriteButton.js
│   │   │   └── FavoritesList.js
│   │   ├── ai/
│   │   │   ├── AIChat.js
│   │   │   └── AIChat.test.js
│   │   ├── tools/
│   │   │   ├── ValuationTool.js
│   │   │   ├── LoanCalculator.js
│   │   │   └── ValuationTool.test.js
│   │   ├── admin/
│   │   │   ├── AdminDashboard.js
│   │   │   ├── PropertyManager.js
│   │   │   ├── ImageUploader.js
│   │   │   └── AdminDashboard.test.js
│   │   └── common/
│   │       ├── Header.js
│   │       ├── Footer.js
│   │       ├── Toast.js
│   │       └── Modal.js
│   ├── services/
│   │   ├── api.js               # API service
│   │   ├── authService.js       # Auth service
│   │   └── storageService.js    # Local storage service
│   ├── utils/
│   │   ├── constants.js         # Constants
│   │   └── helpers.js          # Helper functions
│   ├── styles/
│   │   ├── main.css            # Main styles
│   │   ├── components.css     # Component styles
│   │   └── admin.css          # Admin styles
│   ├── index.html             # Main HTML
│   └── app.js                 # Main app entry
│
├── tests/
│   ├── backend/
│   │   ├── auth.test.js
│   │   ├── property.test.js
│   │   ├── search.test.js
│   │   └── valuation.test.js
│   └── frontend/
│       ├── components.test.js
│       └── services.test.js
│
├── uploads/                   # Uploaded images
│   └── properties/
│
├── server.js                  # Main server file
├── package.json
├── .env
└── README.md
```

## 🎯 Feature Organization

Each feature is self-contained with:
- **Model**: Data structure
- **Controller**: Business logic
- **Routes**: API endpoints
- **Frontend Component**: UI component
- **Tests**: Unit tests

## 📝 Finding Features

### Backend Features
- **Authentication**: `backend/controllers/authController.js`
- **Properties**: `backend/controllers/propertyController.js`
- **Search**: `backend/controllers/searchController.js`
- **AI Assistant**: `backend/controllers/aiController.js`
- **Valuation**: `backend/controllers/valuationController.js`

### Frontend Components
- **Login/Register**: `frontend/components/auth/`
- **Property Cards**: `frontend/components/property/`
- **Search**: `frontend/components/search/`
- **Admin Panel**: `frontend/components/admin/`

