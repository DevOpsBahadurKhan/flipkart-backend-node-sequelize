FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

# Install PM2 globally
RUN npm install -g pm2

RUN npm install  --omit=dev

COPY . /usr/src/app

EXPOSE $PORT

# Start your application with PM2
CMD ["pm2-runtime", "index.js"]