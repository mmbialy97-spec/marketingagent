import { defineTool } from "eve/tools";
import { z } from "zod";
import { EVENTS, eventLabel, eventMetrics } from "../lib/data";

export default defineTool({
  description:
    "Get the individual leads from one event: company, product line, contract value, owning BD and deal status. " +
    "Match on event id, name, city or date (for example 'Seoul', 'London December', '2026-08-15').",
  inputSchema: z.object({
    event: z.string().min(1).describe("Event id, name, city, month or date."),
  }),
  execute({ event }) {
    const q = event.toLowerCase();
    const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    const matches = EVENTS.filter((e) => {
      const hay = `${e.id} ${e.name} ${e.city} ${e.date} ${months[Number(e.date.slice(5, 7)) - 1]}`.toLowerCase();
      return q.split(/\s+/).filter(Boolean).every((word) => {
        const asMonth = months.find((m) => word.startsWith(m));
        return hay.includes(asMonth ?? word);
      });
    });
    if (matches.length === 0) {
      return { error: "No event matched.", availableEvents: EVENTS.map(eventLabel) };
    }
    return matches.map((e) => ({ ...eventMetrics(e), leadDetails: e.leads }));
  },
});
