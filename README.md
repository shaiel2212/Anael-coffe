# מערכת ניהול בית קפה

פלטפורמה מקיפה לניהול בתי קפה - תפריט דיגיטלי, מלאי, עובדים, כספים ועוד.

## טכנולוגיות

| שכבה | טכנולוגיה |
|------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Routing | React Router v7 |
| i18n | i18next (עברית / אנגלית / רוסית) |
| Backend | Node.js + Express.js |
| ORM | Sequelize + MySQL |
| Auth | JWT + Refresh Tokens |
| Cache | Redis |
| Storage | AWS S3 |

## הרצה מהירה עם Docker

```bash
cp .env.example .env
docker-compose up --build
```

הגישה:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/v1
- **תפריט ציבורי**: http://localhost:3000/menu/my-cafe
- **פאנל ניהול**: http://localhost:3000/admin

### פרטי כניסה ברירת מחדל
- **Email**: admin@mycafe.com  
- **Password**: admin123  

**משתמש נוסף (אם הוספת via סקריפט):** daminshaiel@coffe.com / Aa123456

## פרוד (Production) – אין רישום

באפליקציה **אין דף הרשמה**. כל המשתמשים נוצרים רק במסד הנתונים.

**פרטי כניסה בפרוד** – אותם כמו למעלה, **אבל** חייבים ליצור אותם במסד הנתונים של הפרוד:

1. **אפשרות א:** הרצת מיגרציות + seed על מסד הפרוד:
   ```bash
   NODE_ENV=production npm run migrate
   NODE_ENV=production npm run seed
   ```
   אחרי זה: **admin@mycafe.com** / **admin123**

2. **אפשרות ב:** הרצת הסקריפט להוספת משתמש (נגד מסד הפרוד, עם .env שמכוון ל-DB של הפרוד):
   ```bash
   node scripts/add-user-daminshaiel.js
   ```
   אחרי זה: **daminshaiel@coffe.com** / **Aa123456**

3. **אפשרות ג:** הרצת `mysql-workbench-setup.sql` (או החלק של ה-INSERT) על מסד הפרוד – נוצר **admin@mycafe.com** / **admin123**.

**סיכום – פרטי כניסה לפרוד (אחרי שיצרת אותם במסד):**
| אימייל | סיסמה |
|--------|--------|
| admin@mycafe.com | admin123 |
| daminshaiel@coffe.com | Aa123456 (אם הרצת את סקריפט add-user) |

## הרצה מקומית (ללא Docker)

### Backend
```bash
cd backend
npm install
# ודא שיש MySQL ו-Redis רצים
cp ../.env.example .env  # ערוך לפי הסביבה שלך
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## פריסה ב-Vercel (למניעת 404)

כדי שהאתר לא יחזיר 404 בנתיבים כמו `/admin` או `/login`:

1. ב-**Vercel Dashboard** → הפרויקט → **Settings** → **General**
2. ב-**Root Directory** לחץ **Edit** ובחר את התיקייה **`frontend`** (לא את שורש ה-repo)
3. שמור והפעל **Redeploy**

אם Root Directory לא מוגדר ל-`frontend`, Vercel בונה משורש הריפו ולא מוצא אפליקציה, ולכן מתקבל 404.

## מבנה הפרויקט

```
/
├── backend/
│   └── src/
│       ├── controllers/   # לוגיקת API
│       ├── models/        # מודלי Sequelize
│       ├── routes/        # הגדרת נתיבים
│       ├── middleware/    # Auth, Rate limiting, Error handling
│       └── utils/         # Logger, Seed
├── frontend/
│   └── src/
│       ├── pages/         # דפי האפליקציה
│       ├── components/    # קומפוננטות משותפות
│       ├── context/       # Auth Context
│       ├── i18n/          # קבצי תרגום
│       └── utils/         # API client
└── docker-compose.yml
```

## API Endpoints

| Method | Path | Auth | תיאור |
|--------|------|------|-------|
| `GET` | `/api/v1/menu/public/:slug` | ❌ | תפריט ציבורי |
| `POST` | `/api/v1/auth/login` | ❌ | כניסה |
| `GET` | `/api/v1/menu/qr` | ✅ | יצירת QR |
| `GET/POST/PUT/DELETE` | `/api/v1/menu/categories` | ✅ | ניהול קטגוריות |
| `GET/POST/PUT/DELETE` | `/api/v1/menu/products` | ✅ | ניהול מוצרים |
| `GET/POST/PUT/DELETE` | `/api/v1/inventory` | ✅ | ניהול מלאי |
| `POST` | `/api/v1/inventory/:id/transactions` | ✅ | תנועת מלאי |
| `GET/POST/PUT/DELETE` | `/api/v1/employees` | ✅ | ניהול עובדים |
| `GET/POST` | `/api/v1/employees/work-hours` | ✅ | שעות עבודה |
| `GET` | `/api/v1/employees/salary-summary` | ✅ | סיכום שכר |
| `GET/POST/PUT/DELETE` | `/api/v1/finance` | ✅ | ניהול כספים |
| `GET` | `/api/v1/finance/summary` | ✅ | סיכום כספי |

## תכונות עיקריות

- **תפריט דיגיטלי** - נגיש דרך QR Code, תומך עברית/אנגלית/רוסית + RTL
- **ניהול תפריט** - קטגוריות ומוצרים עם אלרגנים, מחירים, תמונות
- **QR Code** - יצירה אוטומטית עם צבע בית הקפה, אפשרות הורדה
- **ניהול מלאי** - כניסות/יציאות עם היסטוריה, התראות מלאי נמוך
- **ניהול עובדים** - שעות עבודה, חישוב שכר אוטומטי
- **ניהול כספים** - הכנסות/הוצאות, סיכום חודשי ורווח נקי
- **מחיקה רכה** - שחזור נתונים מחוקים
- **RBAC** - הרשאות Admin / Manager / Employee
- **Tenant Isolation** - בידוד נתונים לכל בית קפה
