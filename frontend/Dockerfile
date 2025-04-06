FROM node:16.14.2 AS build
WORKDIR /app

# Copy package files and check their contents
COPY package*.json ./
RUN ls -al /app
RUN cat /app/package.json

RUN npm install

# Copy the rest of the application files and verify
COPY . .
RUN ls -al /app

# Build the React app
RUN npm run build

# Serve the built files with Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
