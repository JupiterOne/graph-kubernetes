FROM node:14-bullseye-slim

ARG j1_dev_enabled=false

ENV JUPITERONE_DEV_ENABLED=$j1_dev_enabled
ENV JUPITERONE_INTEGRATION_DIR=/opt/jupiterone/integration

RUN apt-get update
RUN apt-get -y install wget systemctl g++ make python

RUN wget https://github.com/open-telemetry/opentelemetry-collector/releases/download/v0.33.0/otel-collector_0.33.0_amd64.deb
RUN dpkg -i otel-collector_0.33.0_amd64.deb

COPY package.json yarn.lock LICENSE ${JUPITERONE_INTEGRATION_DIR}/
COPY src/ ${JUPITERONE_INTEGRATION_DIR}/src
COPY scripts/ ${JUPITERONE_INTEGRATION_DIR}/scripts

WORKDIR  ${JUPITERONE_INTEGRATION_DIR}
RUN yarn install --production

CMD ["yarn", "collect"]
