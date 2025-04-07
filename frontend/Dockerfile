# Build Stage: Build the React app
FROM node:16.14.2 AS build
WORKDIR /app

# Copy package files and examine their contents
COPY package*.json ./
RUN ls -al /app
RUN cat /app/package.json

# Install dependencies
RUN npm install

# Copy the entire application source code
COPY . .
RUN ls -al /app

# Build the React application
RUN npm run build

# Serve Stage: Use Nginx to serve the built files
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
