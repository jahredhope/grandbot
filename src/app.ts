import { Probot } from "probot";
import { useNotPlanned } from "./feature/not-planned";
import { useOnOpen } from "./feature/on-open";
import { useRepoLabels } from "./feature/repo-labels";
import { usePRApprovals } from "./feature/pr-approvals";

export function app(app: Probot) {
  useNotPlanned(app);
  useOnOpen(app);
  useRepoLabels(app);
  usePRApprovals(app);
}
