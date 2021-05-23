#
# ----- Builder Image -----
#
FROM node:14-alpine as builder
WORKDIR /code

# Copy files required for installing dependencies
COPY ./package.json ./package-lock.json ./

# Install all dependencies and code to allow building
RUN npm install --frozen-lockfile
COPY . .

# Build assets required for production and save for later
RUN npm run build

# Strip non-production dependencies
RUN npm prune --production

#
# ----- Release Image -----
#
FROM node:14-alpine AS release
WORKDIR /code

# Copy over previously install production modules
COPY --from=builder /code/node_modules /code/node_modules
# Copy over built assets
COPY --from=builder /code/dist /code/dist

# Production commands
ENV NODE_ENV="production"
EXPOSE 3000/tcp
CMD [ "node", "/code/dist/index.js" ]