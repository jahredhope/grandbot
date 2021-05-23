import { Probot, ProbotOctokit } from "probot";
import { notPlannedLabel, automateLabel, notPlannedBodyText } from "../config";

function addNotPlannedComment(
  octokit: InstanceType<typeof ProbotOctokit>,
  issueDetails: { owner: string; repo: string }
) {
  return octokit.issues.createComment({
    ...issueDetails,
    body: notPlannedBodyText,
  });
}

function closeIssue(
  octokit: InstanceType<typeof ProbotOctokit>,
  issueDetails: { owner: string; repo: string }
) {
  return octokit.issues.update({
    ...issueDetails,
    state: "closed",
  });
}

export function useNotPlanned(app: Probot) {
  app.on("issues.labeled", async (context) => {
    if (
      context.payload.label?.name === notPlannedLabel &&
      context.payload.issue.labels.some((l) => l.name === automateLabel)
    ) {
      const issueDetails = context.issue();
      await Promise.all([
        addNotPlannedComment(context.octokit, issueDetails),
        closeIssue(context.octokit, issueDetails),
      ]);
    }
  });
}
