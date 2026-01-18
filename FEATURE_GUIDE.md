# Feature Guide - Finding and Modifying Features

## 📍 Quick Navigation

### Backend Features

#### Authentication
- **Model**: `backend/models/User.js` (if exists)
- **Controller**: `backend/controllers/authController.js`
- **Routes**: `backend/routes/auth.js`
- **Middleware**: `backend/middleware/auth.js`
- **Tests**: `tests/backend/auth.test.js`

#### Properties
- **Model**: `backend/models/Property.js`
- **Controller**: `backend/controllers/propertyController.js`
- **Routes**: `backend/routes/propertyRoutes.js`
- **Service**: `backend/services/imageService.js`
- **Tests**: `tests/backend/property.test.js`

#### Search
- **Controller**: `backend/controllers/searchController.js`
- **Routes**: `backend/routes/search.js`

#### Favorites
- **Model**: `backend/models/Favorite.js` (if exists)
- **Controller**: `backend/controllers/favoriteController.js`
- **Routes**: `backend/routes/favorites.js`

#### AI Assistant
- **Controller**: `backend/controllers/aiController.js`
- **Service**: `backend/services/aiService.js`
- **Routes**: `backend/routes/ai.js`

#### Valuation
- **Controller**: `backend/controllers/valuationController.js`
- **Service**: `backend/services/valuationService.js`
- **Routes**: `backend/routes/valuation.js`

#### Admin Panel
- **Routes**: `backend/routes/adminRoutes.js`
- **Frontend**: `public/admin.html`, `public/admin.js`, `public/admin.css`

### Frontend Features

#### Authentication UI
- **Components**: `frontend/components/auth/LoginModal.js`, `RegisterModal.js`
- **Styles**: `public/styles.css` (auth section)

#### Property Display
- **Components**: `frontend/components/property/PropertyCard.js`, `PropertyList.js`, `PropertyDetails.js`
- **Styles**: `public/styles.css` (property section)

#### Search
- **Components**: `frontend/components/search/SearchBar.js`, `FilterPanel.js`
- **Scripts**: `public/app.js` (search functions)

#### Admin Interface
- **Files**: `public/admin.html`, `public/admin.js`, `public/admin.css`

## 🔧 How to Modify Features

### Adding a New Property Field

1. **Update Database Schema**:
   - File: `backend/database/init.js`
   - Add column to properties table

2. **Update Model**:
   - File: `backend/models/Property.js`
   - Add field to create/update methods

3. **Update Controller**:
   - File: `backend/controllers/propertyController.js`
   - Handle new field in create/update

4. **Update Frontend Form**:
   - File: `public/admin.html` or `public/index.html`
   - Add input field to form

5. **Update Tests**:
   - File: `tests/backend/property.test.js`
   - Add test for new field

### Modifying Image Upload

1. **Upload Configuration**:
   - File: `backend/config/upload.js`
   - Modify file size limits, allowed types

2. **Image Service**:
   - File: `backend/services/imageService.js`
   - Modify image processing logic

3. **Property Controller**:
   - File: `backend/controllers/propertyController.js`
   - Modify image handling in create/update

### Adding a New API Endpoint

1. **Add Route**:
   - File: `backend/routes/[feature]Routes.js`
   - Add new route definition

2. **Add Controller Method**:
   - File: `backend/controllers/[feature]Controller.js`
   - Implement business logic

3. **Register Route**:
   - File: `server.js`
   - Add `app.use('/api/[feature]', require('./backend/routes/[feature]Routes'))`

4. **Add Tests**:
   - File: `tests/backend/[feature].test.js`
   - Test new endpoint

### Modifying UI Components

1. **Find Component**:
   - Check `frontend/components/` or `public/` directory
   - Look for component name in HTML/JS files

2. **Modify HTML**:
   - Update component structure

3. **Modify Styles**:
   - Update CSS in `public/styles.css` or component-specific CSS

4. **Modify Logic**:
   - Update JavaScript in component file or `public/app.js`

## 📁 File Organization Rules

1. **Backend**:
   - Models: Data structure and database operations
   - Controllers: Business logic
   - Routes: HTTP endpoints
   - Services: Reusable business logic
   - Middleware: Request processing

2. **Frontend**:
   - Components: Reusable UI elements
   - Services: API calls and data management
   - Styles: CSS files
   - Utils: Helper functions

3. **Tests**:
   - Mirror backend/frontend structure
   - One test file per feature

## 🎯 Common Tasks

### Task: Add Property Image Upload
**Files to modify**:
1. `backend/config/upload.js` - Upload configuration
2. `backend/controllers/propertyController.js` - Handle uploads
3. `public/admin.html` - Add file input
4. `public/admin.js` - Handle file selection

### Task: Change Property Search Logic
**Files to modify**:
1. `backend/controllers/searchController.js` - Search logic
2. `backend/models/Property.js` - Database queries
3. `public/app.js` - Frontend search

### Task: Add New User Role
**Files to modify**:
1. `backend/database/init.js` - Update user_type check
2. `backend/middleware/auth.js` - Add role middleware
3. `backend/routes/` - Add role checks to routes

### Task: Modify Property Display
**Files to modify**:
1. `public/index.html` - Property card HTML
2. `public/styles.css` - Property card styles
3. `public/app.js` - Property rendering logic

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test tests/backend/property.test.js
```

## 📝 Adding New Features

1. **Create Model** (if needed):
   - `backend/models/[Feature].js`

2. **Create Controller**:
   - `backend/controllers/[feature]Controller.js`

3. **Create Routes**:
   - `backend/routes/[feature]Routes.js`

4. **Register in server.js**:
   - Add route registration

5. **Create Frontend Component**:
   - `frontend/components/[feature]/[Feature].js`

6. **Create Tests**:
   - `tests/backend/[feature].test.js`
   - `tests/frontend/[feature].test.js`

7. **Update Documentation**:
   - Add to this guide

## 🔍 Finding Code

### Search by Feature Name
```bash
# Find all files mentioning "property"
grep -r "property" backend/ frontend/

# Find all files mentioning "search"
grep -r "search" backend/ frontend/
```

### Search by Function Name
```bash
# Find function definition
grep -r "functionName" backend/ frontend/
```

## 📚 Additional Resources

- **Project Structure**: See `PROJECT_STRUCTURE.md`
- **Database Guide**: See `DATABASE_GUIDE.md`
- **API Documentation**: Check route files in `backend/routes/`
- **Testing Guide**: See test files in `tests/`

---

**Remember**: Each feature is self-contained. Modify only the files related to that feature to keep changes isolated and maintainable.

