FROM node:16.14.2 AS build
WORKDIR /app

# Debugging: Verify package.json and context files
COPY package*.json ./
RUN ls -al /app

RUN npm install

# Debugging: Exclude build folder
COPY . .
RUN ls -al /app

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
