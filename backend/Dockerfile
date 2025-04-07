FROM node:16.14.2
WORKDIR /app

# Copy package files and debug if needed
COPY package*.json ./
RUN ls -al /app

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Expose the port (default: 5000)
EXPOSE 5000

# Start the Express server
CMD ["node", "server.js"]
