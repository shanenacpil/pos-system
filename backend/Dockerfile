# Use Node.js LTS
FROM node:18

# Create app directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy rest of the app
COPY . .

# Expose port and start server
EXPOSE 3000
CMD ["npm", "start"]
