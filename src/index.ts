import { Server, Probot } from "probot";
import { app } from "./app";
import { config } from "dotenv";

async function startServer() {
  const server = new Server({
    Probot: Probot.defaults({
      appId: process.env.APP_ID,
      privateKey: process.env.PRIVATE_KEY,
      secret: process.env.WEBHOOK_SECRET,
    }),
  });

  await server.load(app);

  server.start();
}

config();
startServer();
