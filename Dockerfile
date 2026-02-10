# Node.js official image
FROM node:20

# Working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY back-end/package*.json ./

# Install dependencies
RUN npm install

# Copy back-end files
COPY back-end .

# Expose port (Railway will use process.env.PORT)
EXPOSE 3000

# Start server
CMD ["node", "server.js"]
