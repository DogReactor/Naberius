FROM node
LABEL maintainer="moondropx"

WORKDIR /root
COPY dist dist
COPY static static
WORKDIR /root/dist
COPY package.json .
COPY package-lock.json .
COPY scripts scripts
RUN npm install --production

ENTRYPOINT [ "node", "/root/dist/index.js" ]