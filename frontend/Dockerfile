FROM node:16.14.2 AS build
WORKDIR /app

# Copy only package files first
COPY package*.json ./
RUN npm install

# Copy remaining application files
COPY . .
RUN npm run build

# Debugging: Verify package.json content
RUN cat /app/package.json
RUN ls -al /app

# Serve the build output with Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

