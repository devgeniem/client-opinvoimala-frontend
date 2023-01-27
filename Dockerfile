# Build
FROM node:18.8.0-alpine as build-deps
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install
COPY . ./

RUN yarn build
RUN yarn autoclean --force

# Production environment
FROM nginx:1.23.1-alpine
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
ADD nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
