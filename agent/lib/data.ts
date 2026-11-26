// Lowtech sample event data (fake, for demo purposes).
// Source: sample dataset shared by Lowtech. Edit this file to change what the agent knows.

export type LeadStatus =
  | "closed_won"
  | "closed_lost"
  | "negotiating"
  | "kyb"
  | "no_action";

export type ProductLine = "Data" | "Market Making" | "OTC";

export interface Lead {
  company: string;
  product: ProductLine;
  /** Contract value in USD. null = not defined in source data. */
  valueUsd: number | null;
  /** BD who owns the account. */
  owner: "Rad" | "Arif" | "Laurence";
  status: LeadStatus;
  statusNote: string;
}

export interface Event {
  id: string;
  name: string;
  city: string;
  /** ISO date. */
  date: string;
  attended: number;
  budgetUsd: number;
  /** Lead count as stated in the source summary (may differ from leads listed). */
  statedLeadCount: number;
  leads: Lead[];
  dataNotes: string[];
}

export const EVENTS: Event[] = [
  {
    id: "london-local-2026-08",
    name: "London LOCAL",
    city: "London",
    date: "2026-08-15",
    attended: 320,
    budgetUsd: 13_500,
    statedLeadCount: 4,
    dataNotes: [
      "Source summary says 4 leads, but 5 leads are listed. Figures use the 5 listed leads.",
      "Coinbase Market Making has no contract value, so it is left out of value totals.",
    ],
    leads: [
      { company: "Coinbase", product: "Data", valueUsd: 200_000, owner: "Rad", status: "negotiating", statusNote: "Negotiations pending" },
      { company: "Polygon", product: "OTC", valueUsd: 50_000, owner: "Arif", status: "closed_won", statusNote: "Closed won" },
      { company: "Coinbase", product: "Market Making", valueUsd: null, owner: "Arif", status: "closed_lost", statusNote: "Closed lost, contract value not defined" },
      { company: "Monad", product: "Market Making", valueUsd: 140_000, owner: "Laurence", status: "kyb", statusNote: "KYB underway (as of the last data update)" },
      { company: "Infinifi", product: "Data", valueUsd: 95_000, owner: "Rad", status: "closed_lost", statusNote: "Closed lost" },
    ],
  },
  {
    id: "lo-limit-holdem-2026-08",
    name: "LO:Limit Holdem",
    city: "Unknown",
    date: "2026-08-23",
    attended: 12,
    budgetUsd: 2_000,
    statedLeadCount: 2,
    dataNotes: ["Small invite-only format: 12 attendees."],
    leads: [
      { company: "Dooa", product: "Market Making", valueUsd: 200_000, owner: "Laurence", status: "closed_lost", statusNote: "Closed lost" },
      { company: "XStocks", product: "Data", valueUsd: 120_000, owner: "Laurence", status: "closed_won", statusNote: "Closed won" },
    ],
  },
  {
    id: "seoul-local-2026-10",
    name: "Seoul LOCAL",
    city: "Seoul",
    date: "2026-10-29",
    attended: 410,
    budgetUsd: 19_000,
    statedLeadCount: 2,
    dataNotes: ["ProphetX has had no follow-up since the event."],
    leads: [
      { company: "Polymarket", product: "Data", valueUsd: 65_000, owner: "Laurence", status: "closed_won", statusNote: "Closed won" },
      { company: "ProphetX", product: "Market Making", valueUsd: 114_000, owner: "Laurence", status: "no_action", statusNote: "No action taken since event" },
    ],
  },
  {
    id: "london-local-2026-12",
    name: "London LOCAL",
    city: "London",
    date: "2026-12-09",
    attended: 210,
    budgetUsd: 10_000,
    statedLeadCount: 3,
    dataNotes: [],
    leads: [
      { company: "Kraken", product: "Data", valueUsd: 300_000, owner: "Rad", status: "closed_won", statusNote: "Closed won" },
      { company: "Chainlink", product: "Data", valueUsd: 700_000, owner: "Rad", status: "closed_won", statusNote: "Closed won" },
      { company: "Variational", product: "Market Making", valueUsd: 240_000, owner: "Arif", status: "negotiating", statusNote: "Negotiations pending" },
    ],
  },
];

export const isWon = (l: Lead) => l.status === "closed_won";
export const isLost = (l: Lead) => l.status === "closed_lost";
export const isOpen = (l: Lead) => !isWon(l) && !isLost(l);
const sum = (leads: Lead[]) => leads.reduce((t, l) => t + (l.valueUsd ?? 0), 0);
const round = (n: number, dp = 1) => Math.round(n * 10 ** dp) / 10 ** dp;
const pct = (num: number, den: number) => (den === 0 ? null : round((num / den) * 100));

export function eventLabel(e: Event) {
  return `${e.name} (${e.date})`;
}

export function eventMetrics(e: Event) {
  const won = e.leads.filter(isWon);
  const lost = e.leads.filter(isLost);
  const open = e.leads.filter(isOpen);
  const pipelineUsd = sum(e.leads);
  const wonUsd = sum(won);
  const openUsd = sum(open);
  return {
    id: e.id,
    event: eventLabel(e),
    date: e.date,
    attended: e.attended,
    budgetUsd: e.budgetUsd,
    leads: e.leads.length,
    statedLeadCount: e.statedLeadCount,
    wonDeals: won.length,
    lostDeals: lost.length,
    openDeals: open.length,
    totalPipelineUsd: pipelineUsd,
    closedWonUsd: wonUsd,
    lostUsd: sum(lost),
    openPipelineUsd: openUsd,
    costPerLeadUsd: e.leads.length ? round(e.budgetUsd / e.leads.length, 0) : null,
    pipelinePerDollar: round(pipelineUsd / e.budgetUsd),
    openPipelinePerDollar: round(openUsd / e.budgetUsd),
    closedWonRoi: round(wonUsd / e.budgetUsd),
    leadsPer100Attendees: round((e.leads.length / e.attended) * 100),
    closeRatePct: pct(won.length, e.leads.length),
    winRateOnDecidedPct: pct(won.length, won.length + lost.length),
    dataNotes: e.dataNotes,
  };
}

export function allLeads() {
  return EVENTS.flatMap((e) => e.leads.map((l) => ({ ...l, event: eventLabel(e), eventId: e.id })));
}

export function bdMetrics() {
  const owners = [...new Set(allLeads().map((l) => l.owner))];
  return owners.map((owner) => {
    const leads = allLeads().filter((l) => l.owner === owner);
    const won = leads.filter(isWon);
    const lost = leads.filter(isLost);
    const open = leads.filter(isOpen);
    return {
      bd: owner,
      leads: leads.length,
      wonDeals: won.length,
      lostDeals: lost.length,
      openDeals: open.length,
      totalPipelineUsd: sum(leads),
      closedWonUsd: sum(won),
      openPipelineUsd: sum(open),
      closeRatePct: pct(won.length, leads.length),
      winRateOnDecidedPct: pct(won.length, won.length + lost.length),
      eventsWithLeads: [...new Set(leads.map((l) => l.event))],
      accounts: leads.map((l) => `${l.company} ${l.product} (${l.statusNote})`),
    };
  });
}

export function overallConversion() {
  const leads = allLeads();
  const won = leads.filter(isWon);
  const lost = leads.filter(isLost);
  const open = leads.filter(isOpen);
  return {
    totalLeads: leads.length,
    wonDeals: won.length,
    lostDeals: lost.length,
    openDeals: open.length,
    closeRatePct: pct(won.length, leads.length),
    winRateOnDecidedPct: pct(won.length, won.length + lost.length),
    closedWonUsd: sum(won),
    totalPipelineUsd: sum(leads),
    valueCloseRatePct: pct(sum(won), sum(leads)),
    totalBudgetUsd: EVENTS.reduce((t, e) => t + e.budgetUsd, 0),
    definitions: {
      closeRatePct: "Closed-won leads divided by all leads.",
      winRateOnDecidedPct: "Closed-won divided by leads that are won or lost (ignores open deals).",
      valueCloseRatePct: "Closed-won contract value divided by total known lead value.",
    },
  };
}
