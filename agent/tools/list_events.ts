import { defineTool } from "eve/tools";
import { z } from "zod";
import { EVENTS, eventMetrics } from "../lib/data";

const SORTABLE = [
  "leads",
  "closedWonUsd",
  "totalPipelineUsd",
  "openPipelineUsd",
  "pipelinePerDollar",
  "openPipelinePerDollar",
  "closedWonRoi",
  "costPerLeadUsd",
  "closeRatePct",
  "attended",
  "budgetUsd",
  "date",
] as const;

export default defineTool({
  description:
    "List every Lowtech event with its computed metrics: attendance, budget, leads, closed-won revenue, " +
    "total and open pipeline, pipeline per $1 of budget, closed-won ROI, cost per lead and close rate. " +
    "Use it to rank or compare events (most leads, most revenue, best value for money). Sorted by the chosen metric, highest first " +
    "(costPerLeadUsd sorts lowest first).",
  inputSchema: z.object({
    sortBy: z.enum(SORTABLE).default("date").describe("Metric to rank events by."),
  }),
  execute({ sortBy }) {
    const rows = EVENTS.map(eventMetrics);
    rows.sort((a, b) => {
      if (sortBy === "date") return a.date.localeCompare(b.date);
      const av = (a[sortBy] ?? -Infinity) as number;
      const bv = (b[sortBy] ?? -Infinity) as number;
      return sortBy === "costPerLeadUsd" ? av - bv : bv - av;
    });
    return { sortedBy: sortBy, events: rows };
  },
});
