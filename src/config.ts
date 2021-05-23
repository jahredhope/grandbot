export const notPlannedLabel = "not-planned";
export const automateLabel = "grandbot-automated";

export const grandbotLabels = [
  {
    name: notPlannedLabel,
    description:
      "This issue may or may not be valid but is not currently planned to be actioned.",
    color: "D60205",
  },
  {
    name: "grandbot-automated",
    description: "This issue is being automated by grandbot.",
    color: "C5DED5",
  },
];

export const greetingBodyText =
  "Thanks for raising this issue.\n\nIf you want me to leave this issue alone just remove the label I've just added.\n\nThis issue has been added to the [owner's board](https://todo.example.com) please reach out to them if this issue is urgent.";
export const notPlannedBodyText =
  "Unfortunately, the owner does not currently plan to action this issue.\n\nEven though it has been closed the issue may still be valuable for future reference so we still appreciate your time in raising it.\n\nShould you feel this issue should not be closed please leave a comment with addition information and re-open the issue.";
