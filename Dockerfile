FROM node:26-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --chown=node:node package*.json ./
RUN npm ci --omit=dev && mkdir -p node_modules/@eliware && ln -s /app node_modules/@eliware/mcp-server && npm cache clean --force
COPY --chown=node:node index.mjs index.d.ts example.mjs container.mjs README.md LICENSE ./
COPY --chown=node:node src ./src
COPY --chown=node:node tools ./tools
USER node
EXPOSE 1234 80 443
CMD ["node", "container.mjs"]
