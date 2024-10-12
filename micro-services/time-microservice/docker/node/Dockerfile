FROM node:20.17-slim AS builder
WORKDIR /home/node/app
ENV NODE_ENV=development

COPY ./package*.json ./
RUN npm install --ignore-scripts

COPY ./src ./src
COPY ./tsconfig.json .

RUN npm run build

# Setting the timezone for the logs
ENV TZ=Europe/Paris

EXPOSE 3000

# This avoids running the container as root
# Running the container as root is a security risk
# because root cannot install packages
USER node

CMD [ "npm", "run", "dev" ]
