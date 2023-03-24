###################
# BUILD FOR LOCAL DEVELOPMENT
###################
FROM --platform=linux/amd64 node:18-alpine As development
# RUN npm install -g yarn

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=node:node package*.json ./
COPY --chown=node:node yarn.lock ./

RUN yarn install --frozen-lockfile
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY --chown=node:node . .

# Use the node user from the image (instead of the root user)
USER node

###################
# BUILD FOR PRODUCTION
###################
FROM --platform=linux/amd64 node:18-alpine As build
# RUN npm install -g yarn

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=node:node package*.json ./
COPY --chown=node:node yarn.lock ./

# In order to run `npm run build` we need access to the Nest CLI.
# The Nest CLI is a dev dependency,
# In the previous development stage we ran `yarn install` which installed all dependencies.
# So we can copy over the node_modules directory from the development image into this build image.
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

# Bundle app source
COPY --chown=node:node . .

# Creates a "dist" folder with the production build
RUN yarn run build

ENV NODE_ENV production

# Running `yarn install` removes the existing node_modules directory and passing in --only=production ensures that only the production dependencies are installed. This ensures that the node_modules directory is as optimized as possible
# RUN npm ci --only=production && npm cache clean --force
RUN yarn install --production --frozen-lockfile

USER node

###################
# PRODUCTION
###################

FROM --platform=linux/amd64 node:18-alpine As production

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/pm2.config.js ./pm2.config.js

RUN npm install pm2 -g

# Start the server using the production build
# CMD [ "node", "dist/main.js" ]
CMD [ "pm2-runtime", "pm2.config.js", "--env", "production" ]