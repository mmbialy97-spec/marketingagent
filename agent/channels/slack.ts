import { connectSlackCredentials } from "@vercel/connect/eve";
import { slackChannel } from "eve/channels/slack";

// Answers @mentions in channels it has joined, and DMs.
// `eve add channel/slack` creates the Slack app via Vercel Connect and sets SLACK_CONNECTOR.
export default slackChannel({
  credentials: connectSlackCredentials(process.env.SLACK_CONNECTOR ?? "slack/applied-machines-lowtech"),
});
