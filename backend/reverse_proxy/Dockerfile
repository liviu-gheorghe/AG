FROM node:lts-alpine
COPY ./reverse_proxy.js /opt/reverse_proxy.js
EXPOSE 443
ENV LAB_HOST lab
RUN npm install ws

ENV DOCKERVERSION 18.09.9
ENV HOST_DAEMON_SOCKET_PATH /var/snap/docker/423/run/docker/containerd/containerd.sock
RUN apk add curl
RUN curl -fsSLOv https://download.docker.com/linux/static/stable/x86_64/docker-${DOCKERVERSION}.tgz
RUN tar -xvf docker-${DOCKERVERSION}.tgz
#COPY ${HOST_DAEMON_SOCKET_PATH} /var/run/docker.sock
CMD node /opt/reverse_proxy.js