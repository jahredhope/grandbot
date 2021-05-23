import { Probot } from "probot";
import { useNotPlanned } from "./feature/not-planned";
import { useOnOpen } from "./feature/on-open";
import { useRepoLabels } from "./feature/repo-labels";

export function app(app: Probot) {
  useNotPlanned(app);
  useOnOpen(app);
  useRepoLabels(app);
}
