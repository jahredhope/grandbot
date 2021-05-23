import nock from "nock";

import { app } from "../src/app";
import { Probot, ProbotOctokit } from "probot";

import payloadIssueOpened from "./fixtures/issues.opened.json";
import payloadLabelledNotPlanned from "./fixtures/issue.labeled.not-planned.json";
import payloadInstallation from "./fixtures/installation.json";

import fs from "fs";
import path from "path";

const privateKey = fs.readFileSync(
  path.join(__dirname, "fixtures/mock-cert.pem"),
  "utf-8"
);

describe("Grandbot Github App", () => {
  let probot: any;

  beforeEach(() => {
    nock.disableNetConnect();
    probot = new Probot({
      appId: 123,
      privateKey,
      // disable request throttling and retries for testing
      Octokit: ProbotOctokit.defaults({
        retry: { enabled: false },
        throttle: { enabled: false },
      }),
    });
    // Load our app into probot
    probot.load(app);
  });

  test("creates a comment and topic when an issue is opened", async () => {
    expect.assertions(3);
    const mock = nock("https://api.github.com");
    mock.post("/app/installations/2/access_tokens").reply(200, {
      token: "test",
      permissions: {
        issues: "write",
      },
    });
    mock.post("/app/installations/2/access_tokens").reply(200, {
      token: "test",
      permissions: {
        issues: "write",
      },
    });
    mock
      .post(
        "/repos/test-user-name/testing-things/issues/1/labels",
        (body: any) => {
          expect(body).toMatchObject({
            labels: expect.arrayContaining(["grandbot-automated"]),
          });
          return true;
        }
      )
      .reply(200, {});

    // Test that a comment is posted
    mock
      .post(
        "/repos/test-user-name/testing-things/issues/1/comments",
        (body: any) => {
          expect(body).toMatchObject({
            body: expect.stringContaining("Thanks for raising this issue"),
          });
          return true;
        }
      )
      .reply(200);

    // Receive a webhook event
    await probot.receive({ name: "issues", payload: payloadIssueOpened });
    expect(mock.pendingMocks()).toStrictEqual([]);
  });

  test("closes an issue when labelled not-planned", async () => {
    expect.assertions(3);
    const mock = nock("https://api.github.com");
    mock
      .post(
        "/repos/test-user-name/test-repo-name/issues/23/comments",
        (body: any) => {
          expect(body).toMatchObject({
            body: expect.stringContaining(
              "Unfortunately, the owner does not currently plan to action this issue."
            ),
          });
          return true;
        }
      )
      .reply(200);
    mock
      .patch("/repos/test-user-name/test-repo-name/issues/23", (body: any) => {
        expect(body).toMatchObject({
          state: "closed",
        });
        return true;
      })
      .reply(200);

    // Receive a webhook event
    await probot.receive({
      name: "issues",
      payload: payloadLabelledNotPlanned,
    });
    expect(mock.pendingMocks()).toStrictEqual([]);
  });

  test("adds topics to a repo when installed", async () => {
    expect.assertions(3);
    const mock = nock("https://api.github.com");
    mock.post("/app/installations/2/access_tokens").reply(200, {
      token: "test",
      permissions: {
        issues: "write",
      },
    });
    mock.post("/app/installations/2/access_tokens").reply(200, {
      token: "test",
      permissions: {
        issues: "write",
      },
    });
    mock
      .post("/repos/test-user-name/test-repo-name/labels", (body: any) => {
        expect(body).toMatchObject({
          name: "not-planned",
        });
        return true;
      })
      .reply(200);
    mock
      .post("/repos/test-user-name/test-repo-name/labels", (body: any) => {
        expect(body).toMatchObject({
          name: "grandbot-automated",
        });
        return true;
      })
      .reply(200);

    // Receive a webhook event
    await probot.receive({
      name: "installation",
      payload: payloadInstallation,
    });
    expect(mock.pendingMocks()).toStrictEqual([]);
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });
});
