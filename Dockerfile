FROM node:alpine
EXPOSE 8080
ENV NODE_ENV=production
# copy app to src
ADD . /script
WORKDIR /script
RUN npm install
RUN npm run-script build
RUN npm run-script start

