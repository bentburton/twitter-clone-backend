FROM node:14.16.0

EXPOSE 3000

COPY package.json yarn.lock tsconfig.json .env app/
COPY src app/src/

WORKDIR /app

RUN ls

RUN yarn

RUN yarn build

RUN rm -rf src

CMD ["node", "dist/index.js"]