import { defineTool } from "eve/tools";
import { z } from "zod";
import { EVENTS, eventMetrics, overallConversion } from "../lib/data";

export default defineTool({
  description:
    "Lead-to-close conversion across all Lowtech events: overall close rate, win rate on decided deals, value close rate, " +
    "plus the same rates per event. Use for questions about what share of event leads close.",
  inputSchema: z.object({}),
  execute() {
    return {
      overall: overallConversion(),
      byEvent: EVENTS.map(eventMetrics).map((m) => ({
        event: m.event,
        leads: m.leads,
        wonDeals: m.wonDeals,
        lostDeals: m.lostDeals,
        openDeals: m.openDeals,
        closeRatePct: m.closeRatePct,
        winRateOnDecidedPct: m.winRateOnDecidedPct,
      })),
    };
  },
});
