FROM node

RUN npm i node-pty
RUN npm i ws
COPY pseudo_tty.js /opt/
EXPOSE 443
CMD node /opt/pseudo_tty.js
