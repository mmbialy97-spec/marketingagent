import { connectSlackCredentials } from "@vercel/connect/eve";
import { slackChannel } from "eve/channels/slack";

// Answers @mentions in channels it has joined, and DMs.
// Uses the Vercel Connect Slack app "makreting-lotech" in the Applied Machines workspace.
export default slackChannel({
  credentials: connectSlackCredentials(process.env.SLACK_CONNECTOR ?? "slack/makreting-lotech"),
});
