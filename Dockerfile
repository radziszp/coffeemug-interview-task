FROM node:18

WORKDIR /app

COPY *.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 8080
CMD [ "yarn", "run", "start:dev"]