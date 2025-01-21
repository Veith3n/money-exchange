FROM node:23-alpine

# update apk and install curl
RUN apk update \
  && apk add --no-cache curl \
  && rm -rf /var/cache/apk/* /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

HEALTHCHECK --interval=5s --timeout=3s \
  CMD curl --fail "http://localhost:$APP_PORT/health/" || exit 1

CMD ["npm", "run", "start:dev"]

