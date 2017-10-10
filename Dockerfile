FROM node:alpine
EXPOSE 8080
ENV NOgDE_ENV=production
# copy app to src
COPY . /src
WORKDIR /src
CMD [ "node", "/src/bin/app.bundle.js" ]

