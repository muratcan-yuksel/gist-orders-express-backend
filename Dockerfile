FROM node:19-alpine

COPY . /app/

WORKDIR /app

RUN npm install

ENV MONGO_URI=mongodb+srv://murat:Mcan1992@cluster0.56hf1.mongodb.net/gist-orders-backend?retryWrites=true&w=majority
ENV TOKEN_SECRET=1dsf12dsf21fdsafdsa53fds
ENV REFRESH_SECRET=456as3a2f4fdd3a2asd4f

EXPOSE 3000

CMD ["node", "index.js"]