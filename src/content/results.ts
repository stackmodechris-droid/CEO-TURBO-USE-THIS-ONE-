// Real Meta Ads Manager numbers, read from the dashboards in /Images/Ad Results (Jul–Aug 2026).
// Keep these exactly as reported — they are cited across the site and in guides.

export type AdResult = {
  key: string;
  client: string;
  clientSlug?: string;
  campaign: string;
  metric: "Leads" | "Profile & page visits" | "Checkouts started";
  count: number;
  costPer: number;
  spent: number;
  /** Meta's own peer benchmark line, only where it was shown on the dashboard. */
  peer?: string;
  image: string;
};

export const AD_RESULTS: AdResult[] = [
  {
    key: "ryan-pool",
    client: "Ryan Pool Enagic",
    clientSlug: "ryan-pool",
    campaign: "Kangen water system — lead form",
    metric: "Leads",
    count: 29,
    costPer: 4.89,
    spent: 141.7,
    peer: "35% lower cost per lead than similar ad sets (peer median $7.26)",
    image: "/img/results/ryan-pool.webp",
  },
  {
    key: "stackmode-repair",
    client: "Stackmode computer repair",
    campaign: "Computer repair — lead form (set 2)",
    metric: "Leads",
    count: 12,
    costPer: 4.31,
    spent: 51.77,
    peer: "66% lower cost per lead than similar ad sets (peer median $12.75)",
    image: "/img/results/stackmode-repair.webp",
  },
  {
    key: "mor-handy-carpet",
    client: "Mor Handy",
    clientSlug: "mor-handy",
    campaign: "Carpet cleaning — lead form",
    metric: "Leads",
    count: 13,
    costPer: 5.36,
    spent: 69.72,
    image: "/img/results/mor-handy-carpet.webp",
  },
  {
    key: "appliance-king",
    client: "Appliance King",
    clientSlug: "appliance-king",
    campaign: "Appliance repair — lead form",
    metric: "Leads",
    count: 55,
    costPer: 6.51,
    spent: 357.9,
    image: "/img/results/appliance-king.webp",
  },
  {
    key: "stackmode-set-1",
    client: "Stackmode",
    campaign: "Lead form (set 1)",
    metric: "Leads",
    count: 16,
    costPer: 7.48,
    spent: 119.64,
    image: "/img/results/stackmode-set-1.webp",
  },
  {
    key: "stackmode-set-3",
    client: "Stackmode",
    campaign: "Lead form (set 3)",
    metric: "Leads",
    count: 8,
    costPer: 10.5,
    spent: 84.01,
    peer: "22% lower cost per lead than similar ad sets (peer median $12.75)",
    image: "/img/results/stackmode-set-3.webp",
  },
  {
    key: "mor-handy-electrical",
    client: "Mor Handy",
    clientSlug: "mor-handy",
    campaign: "Outlet & socket replacement — lead form",
    metric: "Leads",
    count: 14,
    costPer: 19.91,
    spent: 278.69,
    image: "/img/results/mor-handy-electrical.webp",
  },
  {
    key: "bigzo",
    client: "BIGZO",
    clientSlug: "bigzo",
    campaign: "Artist profile growth",
    metric: "Profile & page visits",
    count: 165,
    costPer: 0.32,
    spent: 53.59,
    peer: "62% lower cost per visit than similar ad sets (peer median $0.85)",
    image: "/img/results/bigzo.webp",
  },
  {
    key: "xilly",
    client: "Xilly.net",
    campaign: "PC optimization — website checkout",
    metric: "Checkouts started",
    count: 18,
    costPer: 15.47,
    spent: 278.53,
    image: "/img/results/xilly.webp",
  },
];

const leadRows = AD_RESULTS.filter((r) => r.metric === "Leads");

export const AD_TOTALS = {
  leads: leadRows.reduce((n, r) => n + r.count, 0),
  leadSpend: leadRows.reduce((n, r) => n + r.spent, 0),
  get avgCpl() {
    return this.leadSpend / this.leads;
  },
  lowestCpl: Math.min(...leadRows.map((r) => r.costPer)),
  campaigns: leadRows.length,
};

/** Search Console, stackmode.net, 12-month view (Aug 2025 – Aug 2026). */
export const GSC = {
  property: "stackmode.net",
  clicks: 83,
  impressions: "3.34K",
  ctr: "2.5%",
  position: "25.4",
  image: "/img/results/gsc-stackmode.webp",
};

export const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

/** Appliance King Facebook page insights, 2026 view (activity starts in July when the ads launched). */
export const APPLIANCE_KING_PAGE = {
  views: "59.4K",
  viewers: "26.6K",
  interactions: "151",
  linkClicks: "778",
  visits: "1.4K",
  follows: "186",
  image: "/img/results/appliance-king-page.webp",
};

/** Featured proof. The revenue line is the owner's own statement, not a dashboard number. */
export const FEATURED_RESULT = {
  clientSlug: "appliance-king",
  client: "Appliance King",
  headline: "A few hundred dollars of ads turned into thousands in revenue.",
  note: "Per the business owner. The lead numbers below come straight from Meta Ads Manager.",
  did: [
    "Built the Meta lead-form ad and the lead form",
    "Optimized their Facebook & social profile",
    "Optimized their Google Business Profile",
  ],
};
