FROM node:22

WORKDIR /app

COPY *.json ./

RUN npm ci

COPY . .

EXPOSE 8080
CMD [ "npm", "run", "start:dev"]
