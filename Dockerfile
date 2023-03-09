FROM node:16.14.0
# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /usr/src/app

# Running the app
RUN npm install pm2 -g

CMD ["pm2-runtime", "start", "npm", "--", "start" ]