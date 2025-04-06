FROM node:16.14.2 AS build
WORKDIR /app

# Debugging: Copy and verify package.json and package-lock.json
COPY package*.json ./
RUN ls -al /app

RUN npm install

# Debugging: Verify all files are copied into the container
COPY . .
RUN ls -al /app

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
