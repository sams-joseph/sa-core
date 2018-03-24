FROM node:9-alpine

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

ENV NPM_CONFIG_LOGLEVEL warn

RUN apk update && apk add bash && apk add curl && apk add git

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install

COPY . /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

CMD ["bash"]
