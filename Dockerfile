# Use Node LTS
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json tsconfig.json ./

# Install dependencies (including dev for tsc)
RUN npm install

# Copy the source code
COPY . .

# Build TypeScript
RUN npx tsc

# Expose port
EXPOSE 8080

# Start the server
CMD ["node", "dist/index.js"]
