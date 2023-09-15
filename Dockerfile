FROM node:16-slim
WORKDIR /app
#Copy only package.json
COPY package*.json ./
RUN npm install
#Copy all resources
COPY . ./
RUN npm run build

EXPOSE 8881

CMD ["npm", "start"]
