# איך לבדוק שזה עובד בפרוד (אחרי העלאה ל-Git)

מקומי יכול לעבוד ובפרוד לא – כי סביבה אחרת (משתנים, DB, CORS). הנה איך לוודא שפרוד תקין.

---

## 1. בדיקה מהירה מהטרמינל (נגד השרת האמיתי)

אחרי ש-Railway סיימה deploy, הרץ מהמחשב שלך (מתיקיית הפרויקט):

```bash
cd backend
node scripts/check-prod.js https://הכתובת-של-הבקאנד-ב-Railway
```

**איפה מוצאים את הכתובת?**  
Railway → הפרויקט → **Settings** → **Networking** → **Public URL** (למשל `https://xxx.railway.app`).

**דוגמה:**
```bash
node scripts/check-prod.js https://anael-coffe-backend.railway.app
```

הסקריפט בודק:
- `GET /api/v1/health` – השרת עונה
- `POST /api/v1/auth/login` עם admin@mycafe.com / admin123 – התחברות עובדת

אם מופיע `[OK]` בשניהם – הבקאנד בפרוד עובד. אם יש `[FAIL]` או `[WARN]` – יש בעיה (משתנים, DB, seed).

---

## 2. בדיקה בדפדפן (פרונט + בקאנד)

1. **פרונט (Vercel):** גלוש לכתובת האתר (למשל `https://xxx.vercel.app`).
2. **דף התחברות:** הזן **admin@mycafe.com** / **admin123**.
3. אם נכנסת ל-**פאנל ניהול** – גם הפרונט וגם הבקאנד בפרוד עובדים.

אם מקבל 401 או "Invalid credentials" – או שהמשתמש לא קיים במסד של הפרוד (צריך seed), או ש-`VITE_API_URL` בפרונט לא מצביע לכתובת הנכונה של הבקאנד ב-Railway.

---

## 3. הרצה מקומית במצב "דמוי פרוד" (אופציונלי)

כדי להרגיש כמו בפרוד בלי לפרוס:

**בקאנד:**
```bash
cd backend
# וודא ש-.env מכיל את אותם משתנים כמו בפרוד (או העתק מ-Railway)
set NODE_ENV=production
npm start
```
(ב-PowerShell: `$env:NODE_ENV="production"; npm start`)

**פרונט:**  
בנה והרץ preview (מחובר לבקאנד המקומי עם proxy או עם `VITE_API_URL` ל-localhost):

```bash
cd frontend
npm run build
npm run preview
```

אז תפתח `http://localhost:4173` (או הכתובת ש-preview מציג) ותנסה להתחבר – כמו בפרוד, רק נגד localhost.

---

## 4. סיכום – אחרי כל העלאה ל-Git

1. להריץ:  
   `node scripts/check-prod.js https://YOUR-RAILWAY-URL`
2. לפתוח את האתר ב-Vercel ולנסות התחברות.
3. אם שני הבדיקות עוברות – הפרוד תקין.
