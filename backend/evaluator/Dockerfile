FROM alpine:latest
RUN apk add --update \
nodejs \
python3 \
gcc \
openjdk8 \
openjdk8-jre \
make \
g++

ENV JAVA_HOME=/usr/lib/jvm/java-1.8-openjdk
ENV PATH="$JAVA_HOME/bin:${PATH}"

COPY /workers /workers
COPY server.js /server.js
EXPOSE 8080
RUN addgroup -S aggrp && adduser -S -D agusr -G aggrp
USER agusr
WORKDIR /home/agusr
CMD ["node","/server.js"]