# Applied Machines x Lowtech: Events Analyst (eve + Slack)

A Slack agent that answers questions about Lowtech's events, leads, BDs and conversion. Built on eve, deployed on Vercel.

## What's inside

```
agent/
  agent.ts               model (Claude Sonnet 5.5 via AI Gateway, no API key needed)
  instructions.md        persona, answer style, metric definitions
  lib/data.ts            the Lowtech sample dataset + all the maths
  tools/
    list_events.ts       rank events by leads, revenue, pipeline per $, ROI, cost per lead
    get_event_leads.ts   lead-level detail for one event ("Seoul", "London Dec")
    bd_leaderboard.ts    Rad / Arif / Laurence by leads, wins, revenue
    conversion_stats.ts  close rate overall and per event
  skills/event_recap.md  "how are our events doing?" scorecard
  channels/slack.ts      Slack via Vercel Connect
  channels/eve.ts        HTTP API for the eve TUI
evals/prompts/           the 5 demo prompts with expected answers
```

## Deploy (about 10 minutes)

Needs Node 24+ and the Vercel CLI (`npm i -g vercel`), logged in to your Vercel account.

```bash
npm install
npx eve link                 # create or pick the Vercel project
npx eve dev                  # optional: chat with it locally in the terminal first
npx eve add channel/slack    # creates the Slack app via Vercel Connect, install it to your demo workspace
npx eve deploy               # ship to production
```

`eve add channel/slack` keeps the existing `agent/channels/slack.ts`. If it asks to overwrite, either choice works.

Then in Slack: invite the bot to a channel (`/invite @your-bot`) and @mention it.

## Demo script

1. Which event have we done that had the most number of leads?
2. Which event is tied to the most money that actually came into the business?
3. Which event was the most value for money in terms of potential deals?
4. Which BD has gotten the most leads at the events?
5. What percentage of leads at our events end up closing?
6. Bonus: "Give me a recap of how our events are doing and what we should run again."

## Run the evals

```bash
npx eve eval
```

## Change the data

Edit `agent/lib/data.ts` and redeploy. All metrics recompute from it.
