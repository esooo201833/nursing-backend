# Use official Node.js image
FROM node:20

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json from back-end
COPY back-end/package*.json ./

# Install dependencies
RUN npm install

# Copy all back-end files
COPY back-end .

# Expose the port (Railway will use process.env.PORT)
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
