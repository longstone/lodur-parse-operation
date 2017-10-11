FROM node:alpine
EXPOSE 8080
# copy app to src
ADD . /script
WORKDIR /script
RUN npm install
RUN npm run-script build
ENV NODE_ENV=production
RUN npm prune
RUN npm run-script start

