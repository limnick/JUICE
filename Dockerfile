FROM alpine:latest

RUN apk --no-cache add openssh-client git nodejs && \
    npm install -g grunt-cli

RUN mkdir /game

WORKDIR /game

# RUN npm install -g grunt-contrib-uglify --save-dev

ADD Gruntfile.js /game
ADD package.json /game

RUN npm install

# RUN npm install grunt-contrib-uglify --save-dev
