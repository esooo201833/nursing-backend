FROM node:20

WORKDIR  /app

COPY  back-end/package*.json ./RUN npm install

EXPOSE 5000
CMD ["node", "server.js"]
