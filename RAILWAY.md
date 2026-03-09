# Railway – בדיקת לוגים ויציבות

## 502 – השרת לא עולה

אם `check-prod.js` מחזיר 502, האפליקציה לא עלתה. פקודת ההפעלה ב-Railway:

`node scripts/migrate.js && node scripts/seed-if-empty.js && npm start`

אם **מיגרציה** או **seed** נכשלים – השרת לא מגיע ל-`npm start` ולכן 502. פתח **View Logs** ב-Railway וחפש הודעות שגיאה.

## מה בודקים בלוגים אחרי Deploy

ב-**Railway Dashboard** → הפרויקט → **Deployments** → בחר את ה-deployment האחרון → **View Logs**.

### 1. סדר ההרצה (צריך להופיע לפי הסדר)

```
(מיגרציה רצה בשקט או עם הודעות sequelize)
[seed-if-empty] ...   (או "skipping seed" אם כבר יש קפה)
Database connected
Server running on port XXXX
```

- אם מופיע **"Failed to start server"** או **"Access denied"** – חיבור MySQL נכשל. בדוק משתני סביבה: **`MYSQL_URL`** (ב-Railway מומלץ לחבר MySQL plugin ואז המשתנה נוצר אוטומטית).
- אם מופיע **"[migrate] Failed"** – מיגרציה נכשלה (למשל אין `MYSQL_URL` או חיבור DB).

### 2. שהשרת לא מתרסק

אחרי **"Server running on port 5000"** לא אמורות להופיע הודעות שגיאה שמפסיקות את התהליך. אם יש **restart** או **crash** – בדוק את השגיאה שמופיעה לפני זה בלוג.

### 3. משתני סביבה חובה ב-Railway

| משתנה | תיאור |
|--------|--------|
| `MYSQL_URL` | connection string ל-MySQL (Railway מספק אם הוספת MySQL plugin) |
| `JWT_SECRET` | מפתח להחתמת tokens (מחרוזת אקראית) |
| `JWT_REFRESH_SECRET` | מפתח נפרד ל-refresh tokens |
| `FRONTEND_URL` | כתובת הפרונט (למשל `https://xxx.vercel.app`) ל-CORS |

### 4. התחברות אחרי שהשרת רץ

- **אימייל:** admin@mycafe.com (או daminshaiel@coffe.com אם הרצת add-user)
- **סיסמה:** admin123 (או Aa123456)

אם מקבלים 401 – המשתמש לא קיים במסד. וודא ש-`seed-if-empty` רץ (לוג `Seed completed`) או הרץ seed/סקריפט ידנית על מסד הפרוד.
