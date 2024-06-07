FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install  --omit=dev
COPY . /usr/src/app
EXPOSE $PORT

CMD ["npm", "start"]