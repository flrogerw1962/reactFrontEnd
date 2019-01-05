FROM nodesource/trusty:6.2.0

# cache package.json, npm-shrinkwrap.json and modules to speed up builds
ADD package.json package.json
# ADD npm-shrinkwrap.json npm-shrinkwrap.json
# RUN echo "==> NODE_ENV="$NODE_ENV
RUN npm install --dev

# Add your source files
ADD . .

RUN npm run build:stg

EXPOSE 5001
CMD ["npm", "run", "start-stg"]
