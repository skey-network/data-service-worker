FROM node:15.1.0-alpine

WORKDIR /app

COPY package.json .

RUN apk add git

RUN npm install

ADD . .

RUN npm run build

CMD [ "node", "dist/src/main" ]
