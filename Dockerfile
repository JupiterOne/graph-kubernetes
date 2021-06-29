FROM node:14-alpine

ENV JUPITERONE_INTEGRATION_DIR=/opt/jupiterone/integration

# node-gyp/python3 requirement
RUN apk add g++ make python

COPY package.json yarn.lock ${JUPITERONE_INTEGRATION_DIR}/
COPY src/ ${JUPITERONE_INTEGRATION_DIR}/src
COPY scripts/ ${JUPITERONE_INTEGRATION_DIR}/scripts

WORKDIR  ${JUPITERONE_INTEGRATION_DIR}
RUN yarn install --production

CMD ["yarn", "collect"]
