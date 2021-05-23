/**
 * This file is to help manually access the underlying Octokit tool for testing purposes
 */

import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
import { config } from "dotenv";

config();

async function run() {
  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: process.env.APP_ID,
      privateKey: process.env.PRIVATE_KEY,
      // optional: this will make appOctokit authenticate as app (JWT)
      //           or installation (access token), depending on the request URL
      installationId: process.env.INSTALLATION_ID,
    },
  });

  // Add test code below
  // octokit.rest.
}

run()
  .then(() => console.log("Done"))
  .catch((e) => console.error(e));
