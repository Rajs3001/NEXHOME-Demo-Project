# Local Testing Guide for NexHome

## Step-by-Step Instructions

### Step 1: Check Prerequisites

Make sure you have Node.js installed:
```bash
node --version
```
You should see v14 or higher. If not, download from [nodejs.org](https://nodejs.org/)

### Step 2: Navigate to Project Directory

Open your terminal/command prompt and navigate to the project folder:
```bash
cd "C:\Users\rajde\OneDrive\Desktop\NEXHOME-Demo-Project"
```

### Step 3: Install Dependencies

Install all required packages:
```bash
npm install
```

This will install:
- express
- sqlite3
- bcryptjs
- jsonwebtoken
- cors
- dotenv
- and other dependencies

**Wait for installation to complete** (may take 1-2 minutes)

### Step 4: Create Environment File

Create a `.env` file in the root directory:

**Option A: Using Command Line**
```bash
# Windows PowerShell
echo "PORT=3000`nJWT_SECRET=nexhome_secret_key_12345`nOPENAI_API_KEY=sk-placeholder-key" > .env

# Windows CMD
echo PORT=3000 > .env
echo JWT_SECRET=nexhome_secret_key_12345 >> .env
echo OPENAI_API_KEY=sk-placeholder-key >> .env
```

**Option B: Manual Creation**
1. Create a new file named `.env` in the project root
2. Add these lines:
```
PORT=3000
JWT_SECRET=nexhome_secret_key_12345
OPENAI_API_KEY=sk-placeholder-key
```

**Note**: The OpenAI API key is optional. The AI assistant will work with a fallback if you don't have one.

### Step 5: Start the Server

Run the application:
```bash
npm start
```

You should see:
```
Connected to SQLite database
Database initialized successfully
Server running on http://localhost:3000
```

### Step 6: Open in Browser

Open your web browser and go to:
```
http://localhost:3000
```

## Testing Features

### 1. Test Homepage
- ✅ You should see the hero section with search bar
- ✅ Featured properties should be displayed
- ✅ Navigation menu should be visible

### 2. Test User Registration

1. Click **"Sign Up"** button (top right)
2. Fill in the form:
   - Name: Your Name
   - Email: test@example.com
   - Phone: (optional)
   - Password: password123
   - Select: **"Buy/Rent Properties"** (for buyer) or **"Sell/List Properties"** (for seller)
3. Click **"Create Account"**
4. You should see a success message and be logged in

### 3. Test Login

1. Click **"Login"** button
2. Use default admin account:
   - Email: `admin@nexhome.com`
   - Password: `admin123`
3. Or use the account you just created
4. You should be logged in successfully

### 4. Test Property Search

1. On homepage, enter a city name (e.g., "Manhattan") in the search box
2. Click **"Search"** button
3. You should see property listings
4. Try filters:
   - Select city from dropdown
   - Select property type
   - Enter min/max price
   - Enter number of bedrooms

### 5. Test Property Details

1. Click on any property card
2. You should see:
   - Property images
   - Full details
   - Contact seller form (if logged in as buyer)
   - Save button

### 6. Test Favorites

1. Log in as a buyer
2. Browse properties
3. Click the heart icon on any property
4. Property should be saved to favorites
5. Click the heart icon in navigation to view all favorites

### 7. Test List Property (Seller)

1. Log in as a seller (or register as seller)
2. Click **"Sell"** in navigation
3. Fill in the property listing form:
   - Title: "Beautiful 3BR Apartment"
   - Property Type: Select from dropdown
   - Listing Type: For Sale or For Rent
   - Price: 500000
   - Address: "123 Main St"
   - City: "Manhattan"
   - State: "NY"
   - Add other details
4. Click **"List Property"**
5. Your property should appear in search results

### 8. Test AI Assistant

1. Click the robot icon (🤖) in navigation
2. Type a question like: "What is the average price in Manhattan?"
3. You should get a response from the AI assistant

### 9. Test Property Valuation Tool

1. Click **"Tools"** in navigation
2. Click **"Property Valuation"** card
3. Fill in property details:
   - Property Type: House
   - Area: 1500 sqft
   - City: Manhattan
   - Bedrooms: 3
   - Bathrooms: 2
4. Click **"Estimate Value"**
5. You should see an estimated property value

### 10. Test Loan Calculator

1. Click **"Loan Calculator"** in tools section
2. Enter:
   - Property Price: 500000
   - Down Payment: 20%
   - Interest Rate: 6.5%
   - Loan Term: 30 years
3. Click **"Calculate"**
4. You should see monthly payment and total interest breakdown

### 11. Test Direct Messaging

1. Log in as a buyer
2. View a property detail page
3. Scroll to "Contact Seller" form
4. Type a message
5. Click **"Send Message"**
6. Log in as the seller
7. Click your profile → **"Inquiries"**
8. You should see the message from the buyer

## Troubleshooting

### Issue: "npm: command not found"
**Solution**: Install Node.js from [nodejs.org](https://nodejs.org/)

### Issue: "Port 3000 already in use"
**Solution**: 
1. Change PORT in `.env` file to another number (e.g., 3001)
2. Or stop the process using port 3000

### Issue: "Cannot find module"
**Solution**: 
```bash
npm install
```

### Issue: Database errors
**Solution**: 
1. Delete `backend/database/nexhome.db` if it exists
2. Restart the server (it will recreate the database)

### Issue: "Authentication failed"
**Solution**: 
- Make sure you're using correct email/password
- Default admin: `admin@nexhome.com` / `admin123`
- Or create a new account

### Issue: Properties not showing
**Solution**: 
- The database should auto-populate with sample properties
- If not, check server console for errors
- Try refreshing the page

### Issue: AI Assistant not working
**Solution**: 
- This is normal if you don't have an OpenAI API key
- The assistant will use a fallback response system
- To use real AI, add your OpenAI API key to `.env`

## Quick Test Checklist

- [ ] Server starts without errors
- [ ] Homepage loads correctly
- [ ] Can register new account
- [ ] Can login
- [ ] Can search properties
- [ ] Can view property details
- [ ] Can save favorites (buyer)
- [ ] Can list property (seller)
- [ ] AI assistant responds
- [ ] Valuation tool works
- [ ] Loan calculator works
- [ ] Can send inquiry (buyer)
- [ ] Can view inquiries (seller)

## Development Mode (Auto-reload)

For development with automatic server restart on file changes:

```bash
npm run dev
```

This requires `nodemon` which should be installed automatically.

## Stopping the Server

Press `Ctrl + C` in the terminal to stop the server.

## Next Steps

Once everything is working:
1. Explore all features
2. Create test accounts (both buyer and seller)
3. List some properties
4. Test the search and filter functionality
5. Try the AI assistant and tools
6. Test the messaging system

Enjoy testing NexHome! 🏠

