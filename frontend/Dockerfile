FROM node:16.14.2 AS build
WORKDIR /app

# Debugging: Ensure package.json is copied
COPY package*.json ./
RUN ls -al /app

RUN npm install
COPY . .

# Debugging: Ensure all files, including React source files, are present
RUN ls -al /app

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
