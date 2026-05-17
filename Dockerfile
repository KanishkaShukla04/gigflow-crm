FROM node:18

WORKDIR /app

COPY . .

RUN cd server && npm install
RUN cd client && npm install

EXPOSE 5000

CMD ["npm", "start"]