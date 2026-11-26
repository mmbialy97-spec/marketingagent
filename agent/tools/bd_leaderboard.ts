import { defineTool } from "eve/tools";
import { z } from "zod";
import { bdMetrics } from "../lib/data";

export default defineTool({
  description:
    "Rank Lowtech's BDs (account owners) by event-sourced leads, closed-won deals and revenue, open pipeline and close rate. " +
    "Includes the accounts each BD owns.",
  inputSchema: z.object({
    sortBy: z
      .enum(["leads", "wonDeals", "closedWonUsd", "openPipelineUsd", "totalPipelineUsd", "closeRatePct"])
      .default("leads"),
  }),
  execute({ sortBy }) {
    const rows = bdMetrics().sort((a, b) => ((b[sortBy] ?? -1) as number) - ((a[sortBy] ?? -1) as number));
    return { sortedBy: sortBy, bds: rows };
  },
});
