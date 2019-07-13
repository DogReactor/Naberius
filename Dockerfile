FROM node
LABEL maintainer="moondropx"

WORKDIR /root
COPY dist dist
WORKDIR /root/dist
COPY package.json .
COPY package-lock.json .
COPY scripts scripts
RUN npm install --production

ENTRYPOINT [ "node", "/root/dist/index.js" ]