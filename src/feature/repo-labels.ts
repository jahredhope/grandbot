import { ProbotOctokit, Probot } from "probot";
import { grandbotLabels } from "../config";

function addRepoLabels(
  octokit: InstanceType<typeof ProbotOctokit>,
  repos: Array<{ full_name: string }>
) {
  return Promise.all(
    repos.map((repository) => {
      const [owner, repo] = repository.full_name.split("/");
      return Promise.all(
        grandbotLabels.map((l) =>
          octokit.issues.createLabel({ ...l, owner, repo })
        )
      );
    })
  );
}

export function useRepoLabels(app: Probot) {
  app.on("repository.created", async (context) => {
    await addRepoLabels(context.octokit, [context.payload.repository]);
  });
  app.on("installation", async (context) => {
    await addRepoLabels(context.octokit, context.payload.repositories);
  });
  app.on("installation_repositories.added", async (context) => {
    await addRepoLabels(context.octokit, context.payload.repositories_added);
  });
}
