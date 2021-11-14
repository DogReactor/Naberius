FROM node:fermium
LABEL maintainer="moondropx"

WORKDIR /root
COPY dist dist
COPY static static
WORKDIR /root/dist
COPY package.json .
COPY yarn.lock .
COPY scripts scripts
RUN yarn install --production

ENTRYPOINT [ "node", "/root/dist/main.js" ]