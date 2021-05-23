import { Probot, ProbotOctokit } from "probot";
import { greetingBodyText, automateLabel } from "../config";

function addGreetingComment(
  octokit: InstanceType<typeof ProbotOctokit>,
  issueDetails: { owner: string; repo: string }
) {
  return octokit.issues.createComment({
    ...issueDetails,
    body: greetingBodyText,
  });
}

function addAutomationLabel(
  octokit: InstanceType<typeof ProbotOctokit>,
  issueDetails: { owner: string; repo: string }
) {
  return octokit.issues.addLabels({
    ...issueDetails,
    labels: [automateLabel],
  });
}

export function useOnOpen(app: Probot) {
  app.on("issues.opened", async (context) => {
    const issueDetails = context.issue();
    await Promise.all([
      addAutomationLabel(context.octokit, issueDetails),
      addGreetingComment(context.octokit, issueDetails),
    ]);
  });
}
