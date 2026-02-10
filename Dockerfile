# استخدم صورة Node الرسمية
FROM node:20

# عين فولدر العمل
WORKDIR /app

# انسخ package.json و package-lock.json من back-end
COPY back-end/package*.json ./

# ثبت dependencies
RUN npm install

# انسخ كل ملفات back-end
COPY back-end .

# افتح البورت اللي السيرفر بيشتغل عليه
EXPOSE 3000

# شغّل السيرفر
CMD ["node", "server.js"]
