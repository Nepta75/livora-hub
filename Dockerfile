ARG NODE_VERSION=20

FROM node:${NODE_VERSION} AS dependencies

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

FROM node:${NODE_VERSION} AS builder

ARG ENV=production

WORKDIR /usr/src/app

COPY --from=dependencies /usr/src/app/node_modules ./node_modules

COPY . .

COPY .env.${ENV} .env
RUN yarn build

FROM node:${NODE_VERSION}-slim AS production

RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

ARG ENV=production

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/.env ./.env

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "./node_modules/.bin/next", "start"]
