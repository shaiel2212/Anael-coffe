FROM node:20-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm install --omit=dev

COPY backend/ .

EXPOSE 8080

CMD ["sh", "-c", "npm run migrate && node scripts/seed-if-empty.js && npm start"]
