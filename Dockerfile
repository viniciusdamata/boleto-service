FROM node:16-alpine as deps

WORKDIR /usr/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

FROM node:16-alpine as runner

WORKDIR /usr/app

COPY . ./
COPY --from=deps /usr/app/node_modules ./node_modules

EXPOSE 3000

CMD npm run start:prod