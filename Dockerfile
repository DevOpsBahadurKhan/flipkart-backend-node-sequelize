FROM node:16.20.2

MAINTAINER info.bahadur6350@gmail.com

# Copy package.json and package-lock.json
COPY package*.json ./

RUN npm install

CMD ["npm", "start"]
