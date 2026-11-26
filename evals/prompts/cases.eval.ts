import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

// The five demo prompts from Lowtech, with the answer each should land on.
const cases = [
  {
    id: "most-leads",
    prompt: "Which event have we done that had the most number of leads?",
    tool: "list_events",
    expect: "London LOCAL",
    judge: "Names London LOCAL (15 Aug 2026) as the event with the most leads (5).",
  },
  {
    id: "most-revenue",
    prompt: "Which event is tied to the most money that actually came into the business?",
    tool: "list_events",
    expect: "Chainlink",
    judge: "Names London LOCAL (9 Dec 2026) with $1M closed won (Kraken $300k + Chainlink $700k).",
  },
  {
    id: "value-for-money",
    prompt: "Which event was the most value for money in terms of potential deals?",
    tool: "list_events",
    expect: "Holdem",
    judge:
      "Names LO:Limit Holdem as best pipeline per dollar (about $160 per $1 on a $2k budget), and notes London LOCAL (9 Dec 2026) close behind at about $124 per $1.",
  },
  {
    id: "top-bd",
    prompt: "Which BD has gotten the most leads at the events?",
    tool: "bd_leaderboard",
    expect: "Laurence",
    judge: "Names Laurence with 5 leads, ahead of Rad (4) and Arif (3).",
  },
  {
    id: "close-rate",
    prompt: "What percentage of leads at our events end up closing?",
    tool: "conversion_stats",
    expect: "42",
    judge: "Says about 42% (5 of 12 leads closed won), and may add 62.5% win rate on decided deals.",
  },
];

export default cases.map((c) =>
  defineEval({
    description: c.id,
    async test(t) {
      const turn = await t.send(c.prompt);
      t.succeeded();
      t.calledTool(c.tool);
      t.check(turn.reply, includes(c.expect));
      t.judge(c.judge, { on: turn.reply }).atLeast(0.7);
    },
  }),
);
