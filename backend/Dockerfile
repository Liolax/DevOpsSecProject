FROM node:16.14.2
WORKDIR /app

# Use a caching mechanism for node_modules
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

EXPOSE 5000
CMD ["node", "server.js"]
