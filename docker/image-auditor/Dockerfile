FROM node:12
MAINTAINER Simon Walther <simon.walther@heig-vd.ch>

COPY src /opt/app/

# Create app dir
WORKDIR /opt/app

RUN npm install

EXPOSE 2205

ENTRYPOINT ["node", "/opt/app/auditor.js"]
