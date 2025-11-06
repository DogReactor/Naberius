FROM node:20
LABEL maintainer="moondropx"

WORKDIR /root
COPY dist dist
COPY static static
WORKDIR /root/dist
COPY package.json .
COPY package-lock.json .
COPY scripts scripts
RUN npm install --omit=dev --legacy-peer-deps

ENTRYPOINT [ "node", "/root/dist/main.js" ]