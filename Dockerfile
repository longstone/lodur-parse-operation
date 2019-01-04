FROM node:alpine
EXPOSE 8080
# copy app to src
ADD . /script
WORKDIR /script
ENV NODE_ENV=developement
RUN npm install && npm run-script build && rm -rf node_modules
ENV NODE_ENV=production
RUN npm install
ENTRYPOINT npm run-script start

