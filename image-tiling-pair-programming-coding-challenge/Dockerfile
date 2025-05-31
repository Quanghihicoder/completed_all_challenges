FROM node:20
WORKDIR /lib
ADD package.json yarn.lock /lib/

COPY . .
RUN yarn install