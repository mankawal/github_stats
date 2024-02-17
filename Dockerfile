FROM node:alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
ENV PATH /app/node_modules/.bin:$PATH
