FROM node:alpine
EXPOSE 8080
ENV NODE_ENV=production
# copy app to src
COPY . /src
WORKDIR /src
CMD [ "node", "/src/bin/app.bundle.js" ]

