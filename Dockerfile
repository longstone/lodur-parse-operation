FROM alpine:3.1

RUN apk add --update nodejs && rm -rf /var/cache/apk/*

# copy app to src
COPY . /src
WORKDIR /src

# Install app dependencies

RUN cd /src; npm install

CMD [ "npm", "start" ]
