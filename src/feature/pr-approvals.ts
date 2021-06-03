import { Probot } from "probot";
import { isMatch } from "picomatch";

interface RepoConfig {
  admins?: Array<string>;
  ownership?: Array<{
    patterns?: Array<string>;
    teams?: Array<string>;
    shareWithAll?: boolean;
  }>;
}

export function usePRApprovals(app: Probot) {
  app.on(["pull_request", "pull_request_review"], async (context) => {
    const config = await context.config<RepoConfig>("grandbot-config.yaml");
    const issueDetails = context.issue();
    const pullRequestDetails = {
      owner: issueDetails.owner,
      repo: issueDetails.repo,
      pull_number: issueDetails.issue_number,
    };
    const res = await context.octokit.pulls.listFiles(pullRequestDetails);
    const changedFiles = res.data.map((r) => r.filename);

    const owners: any = changedFiles
      .map((file) =>
        config?.ownership
          ?.filter((ownership) => {
            return isMatch(file, ownership.patterns || "");
          })
          .map((ownership) => ownership.teams)
      )
      .flat(2);
    const reviews = (
      await context.octokit.pulls.listReviews(pullRequestDetails)
    ).data;
    console.log({ owners, changedFiles, reviews });
  });
}
