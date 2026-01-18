# Quick Start - Test NexHome Locally

## 🚀 Fast Setup (3 Steps)

### 1. Install Dependencies
Open PowerShell or Command Prompt in the project folder and run:
```bash
npm install
```

### 2. Create .env File
Create a file named `.env` in the root folder with this content:
```
PORT=3000
JWT_SECRET=nexhome_secret_key_12345
OPENAI_API_KEY=sk-placeholder-key
```

### 3. Start Server
```bash
npm start
```

### 4. Open Browser
Go to: **http://localhost:3000**

---

## ✅ Quick Test

1. **Homepage**: Should show featured properties
2. **Sign Up**: Create a buyer account
3. **Search**: Try searching for "Manhattan"
4. **View Property**: Click any property card
5. **Login**: Use `admin@nexhome.com` / `admin123` (seller account)

---

## 📋 Default Login Credentials

**Seller Account:**
- Email: `admin@nexhome.com`
- Password: `admin123`

---

## 🛠️ If Something Goes Wrong

**Port already in use?**
- Change `PORT=3001` in `.env` file

**Module not found?**
- Run `npm install` again

**Database error?**
- Delete `backend/database/nexhome.db` and restart

**Need help?**
- Check `TESTING_GUIDE.md` for detailed instructions

---

## 🎯 What to Test

- ✅ Browse properties
- ✅ Register/Login
- ✅ Search with filters
- ✅ Save favorites
- ✅ List property (as seller)
- ✅ AI Assistant
- ✅ Property Valuation
- ✅ Loan Calculator
- ✅ Contact seller (as buyer)

---

**That's it! Your site should be running.** 🎉

