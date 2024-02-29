FROM node:lts-slim

ENV TZ Australia/Sydney
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ /etc/timezone
WORKDIR /usr/src/app

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

RUN npm init -y && npm i puppeteer

COPY package*.json ./
RUN npm install puppeteer --unsafe-perm=true --allow-root
RUN npm install
COPY . .

CMD ["google-chrome-stable", "&&", "npm", "run", "start"]