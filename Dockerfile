# get node version 10
FROM node:12.18.4-buster-slim

# Create app directory
WORKDIR /usr/src/app

# Get app dependencies
COPY package*.json ./

# building app
RUN npm ci --only=production

# Bundle app source
COPY . .

# start up the bot
CMD [ "npm", "start" ]