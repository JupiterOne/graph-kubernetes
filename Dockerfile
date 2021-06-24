FROM node:12-alpine

WORKDIR .

# node-gyp/python3 requirement
RUN apk add g++ make python

COPY package.json yarn.lock ./

RUN yarn install --production

COPY . .

CMD ["yarn", "collect"]
