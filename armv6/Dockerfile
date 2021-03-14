FROM arm32v6/node:15.11-alpine3.13
MAINTAINER Vasyl Zakharchenko <vaszakharchenko@gmail.com>
LABEL author="Vasyl Zakharchenko"
LABEL email="vaszakharchenko@gmail.com"
LABEL name="smartthings-phevctl"
ENV DEBIAN_FRONTEND noninteractive
RUN apk update
RUN apk add curl
RUN apk add ca-certificates
RUN apk add build-essential
RUN apk add cmake
RUN apk add git

RUN update-ca-certificates --fresh
RUN npm i pm2 -g
# install phevctl
RUN mkdir /opt/phevctl
RUN cd /opt/phevctl && git clone https://github.com/papawattu/msg-core
RUN cd /opt/phevctl &&  git clone https://github.com/vzakharchenko/phevcore.git
RUN cd /opt/phevctl && git clone https://github.com/DaveGamble/cJSON.git
RUN cd /opt/phevctl && git clone https://github.com/vzakharchenko/phevctl
RUN cd /opt/phevctl/cJSON && mkdir build && cd build && cmake .. && make && make install
RUN cd /opt/phevctl/msg-core && mkdir build && cd build && cmake .. && make && make install
RUN cd /opt/phevctl/phevcore && mkdir build && cd build && cmake .. && make && make install
RUN cd /opt/phevctl/phevctl && mkdir -p build && cd build && cmake .. && make
RUN ln -sf /opt/phevctl/phevctl/build/phevctl /usr/bin/phevctl
# Bundle APP files
RUN npm i smartthings-phevctl@1.3.5 -g
# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn

COPY entrypoint.sh /opt/entrypoint.sh
RUN  chmod +x /opt/entrypoint.sh
EXPOSE 8080
EXPOSE 8099
ENTRYPOINT ["/opt/entrypoint.sh"]
#CMD [ "pm2-runtime", "start", "pm2.json" ]
