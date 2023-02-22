FROM node:14

WORKDIR /usr/src/app/my-app

COPY package*.json ./

RUN yarn install

EXPOSE 3000

CMD ["yarn", "start"]