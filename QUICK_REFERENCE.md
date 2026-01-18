# Quick Reference Guide

## 🚀 Starting the Project

```bash
npm install          # Install dependencies
npm start            # Start server
# Server runs on http://localhost:3000
```

## 📍 Finding Features

### Backend Features
| Feature | Model | Controller | Routes |
|---------|-------|------------|--------|
| Properties | `backend/models/Property.js` | `backend/controllers/propertyController.js` | `backend/routes/propertyRoutes.js` |
| Authentication | - | `backend/controllers/authController.js` | `backend/routes/auth.js` |
| Search | - | `backend/controllers/searchController.js` | `backend/routes/search.js` |
| Favorites | - | `backend/controllers/favoriteController.js` | `backend/routes/favorites.js` |
| AI Assistant | - | `backend/controllers/aiController.js` | `backend/routes/ai.js` |
| Valuation | - | `backend/controllers/valuationController.js` | `backend/routes/valuation.js` |
| Admin | - | - | `backend/routes/adminRoutes.js` |

### Frontend Features
| Feature | Files |
|---------|-------|
| Main Site | `public/index.html`, `public/app.js`, `public/styles.css` |
| Admin Panel | `public/admin.html`, `public/admin.js`, `public/admin.css` |
| Property Cards | `public/app.js` (displayProperties function) |
| Search | `public/app.js` (performSearch function) |

## 🔧 Common Modifications

### Add New Property Field
1. `backend/database/init.js` - Add column
2. `backend/models/Property.js` - Add to model
3. `backend/controllers/propertyController.js` - Handle in controller
4. `public/admin.html` - Add form field
5. `public/admin.js` - Add to form data

### Modify Image Upload
- Config: `backend/config/upload.js`
- Service: `backend/services/imageService.js`
- Controller: `backend/controllers/propertyController.js`

### Add New API Endpoint
1. `backend/routes/[feature]Routes.js` - Add route
2. `backend/controllers/[feature]Controller.js` - Add method
3. `server.js` - Register route

## 📂 Key Directories

```
backend/
├── models/          # Data models
├── controllers/     # Business logic
├── routes/          # API endpoints
├── services/        # Reusable services
├── config/          # Configuration
└── database/        # Database setup

public/
├── admin.html      # Admin panel
├── index.html        # Main site
└── styles.css        # Styles

uploads/
└── properties/       # Uploaded images

tests/
├── backend/          # Backend tests
└── frontend/         # Frontend tests
```

## 🎯 Admin Panel

**Access**: `http://localhost:3000/admin.html`

**Features**:
- View all properties
- Add new properties with images
- Edit properties
- Delete properties
- View statistics

**Login**: Use any seller account (default: `admin@nexhome.com` / `admin123`)

## 🖼️ Image Upload

**Location**: `uploads/properties/`

**Features**:
- Multiple image upload
- Image preview
- Automatic filename generation
- 5MB max file size
- Supports: jpeg, jpg, png, gif, webp

## 🧪 Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
```

## 📚 Documentation Files

- `PROJECT_STRUCTURE.md` - Complete structure
- `FEATURE_GUIDE.md` - Detailed feature guide
- `DATABASE_GUIDE.md` - Database management
- `RESTRUCTURE_SUMMARY.md` - What changed
- `QUICK_REFERENCE.md` - This file

## 🔍 Quick Search

**Find property code**: `grep -r "property" backend/`
**Find search code**: `grep -r "search" backend/`
**Find image code**: `grep -r "image" backend/`

## ⚡ Quick Commands

```bash
# Start server
npm start

# Development mode
npm run dev

# Run tests
npm test

# Database admin
node database-admin.js list-users
```

---

**For detailed information, see FEATURE_GUIDE.md**

