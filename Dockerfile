FROM node:latest

MAINTAINER Minh-Quan TRAN "account@itscaro.me"

COPY start.sh /start.sh
COPY . /src
COPY config.dist.json /src/config.json

RUN cd /src && npm install

EXPOSE 8099

ENTRYPOINT [ "sh", "-c", "/start.sh"]
