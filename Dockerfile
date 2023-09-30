# Use a imagem oficial do Node.js 16.x como base
FROM node:16-alpine

WORKDIR /

COPY package*.json ./
COPY tsconfig.build.json ./ 
COPY tsconfig.json ./
COPY nest-cli.json ./ 

RUN npm install -g @nestjs/cli
RUN npm install --production
RUN npm run build

COPY .env ./

COPY . .


ENV AWS_ACCESS_KEY_ID=AKIAXQV23IIZJ54ODDXI
ENV AWS_SECRET_ACCESS_KEY=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
ENV AWS_REGION=sa-east-1

CMD ["npm", "start"]