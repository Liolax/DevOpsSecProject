FROM node:16.14.2
WORKDIR /app

# Debugging: Check if package.json exists
COPY package*.json ./
RUN ls -al /app

RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
