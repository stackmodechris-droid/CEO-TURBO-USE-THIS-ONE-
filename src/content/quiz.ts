// Brand Boost quiz: the tap-to-answer questions in front of the booking calendar.
// Answers go to the "Call Quiz Leads" sheet tab (api/lead.js), ride along on the Cal.com booking
// (hidden fields + metadata → api/cal-webhook.js) and pick the "#1 money move" shown before booking.

export type Audience = "local" | "artist" | "store" | "other";
export type GoalKey = "calls" | "reviews" | "visibility" | "website" | "sales" | "fans" | "shows";
export type Budget = "under-500" | "500-2000" | "2000-5000" | "5000-plus" | "unsure";
export type Timeline = "asap" | "30-days" | "months" | "exploring";

export type Answers = {
  audience?: Audience;
  goal?: GoalKey;
  blockers: string[];
  budget?: Budget;
  timeline?: Timeline;
  business: string;
  website: string;
  name: string;
  email: string;
  phone: string;
  smsOptIn: boolean;
};

export const EMPTY_ANSWERS: Answers = { blockers: [], business: "", website: "", name: "", email: "", phone: "", smsOptIn: false };

export type IconKey = "wrench" | "mic" | "bag" | "building" | "phone" | "star" | "search" | "globe" | "cart" | "users" | "ticket" | "clock" | "zap" | "calendar" | "compass" | "wallet";

export const AUDIENCES: { id: Audience; label: string; sub: string; icon: IconKey; word: string }[] = [
  { id: "local", label: "Local service business", sub: "Plumber, barber, cleaner, contractor…", icon: "wrench", word: "customers" },
  { id: "artist", label: "Artist or creator", sub: "Singer, rapper, producer, DJ…", icon: "mic", word: "listeners" },
  { id: "store", label: "Online store", sub: "Shopify or any e-commerce shop", icon: "bag", word: "sales" },
  { id: "other", label: "Another kind of business", sub: "Coach, restaurant, agency, studio…", icon: "building", word: "customers" },
];

const G = (key: GoalKey, label: string, icon: IconKey) => ({ key, label, icon });

export const GOALS: Record<Audience, { key: GoalKey; label: string; icon: IconKey }[]> = {
  local: [G("calls", "More calls & bookings", "phone"), G("reviews", "More 5-star Google reviews", "star"), G("visibility", "Show up on Google Maps & ChatGPT", "search"), G("website", "A website that wins customers", "globe")],
  artist: [G("fans", "More listeners & streams", "users"), G("visibility", "Be the top result when people Google me", "search"), G("shows", "More bookings & shows", "ticket"), G("website", "An artist website that sells", "globe")],
  store: [G("sales", "More sales", "cart"), G("visibility", "Show up on Google Shopping & ChatGPT", "search"), G("reviews", "More reviews & trust", "star"), G("website", "A store that converts better", "globe")],
  other: [G("calls", "More customers & leads", "phone"), G("reviews", "More reviews & trust", "star"), G("visibility", "Show up on Google & ChatGPT", "search"), G("website", "A website that converts", "globe")],
};

export const BLOCKERS: Record<Audience, string[]> = {
  local: ["No website, or an old one", "Hard to find on Google", "Ads cost too much or don't work", "Not enough reviews", "No time for marketing", "Not sure what's wrong"],
  artist: ["No artist website", "Low streams or engagement", "Ads cost too much or don't work", "Hard to find on Google", "No time for marketing", "Not sure what's wrong"],
  store: ["Traffic but few sales", "Hard to find on Google", "Ads cost too much or don't work", "Not enough reviews", "No time for marketing", "Not sure what's wrong"],
  other: ["No website, or an old one", "Hard to find on Google", "Ads cost too much or don't work", "Not enough reviews", "No time for marketing", "Not sure what's wrong"],
};

/**
 * `value` is what a lead at this budget is worth to the business, sent with the Lead event so
 * Meta, Google Ads and Microsoft can bid for the leads that turn into clients. A booked call is
 * worth CALL_MULTIPLIER × that. Change these numbers once you know your real close rates.
 */
export const BUDGETS: { id: Budget; label: string; value: number }[] = [
  { id: "under-500", label: "Under $500", value: 10 },
  { id: "500-2000", label: "$500 to $2,000", value: 50 },
  { id: "2000-5000", label: "$2,000 to $5,000", value: 150 },
  { id: "5000-plus", label: "$5,000+", value: 300 },
  { id: "unsure", label: "Not sure yet", value: 10 },
];
export const CALL_MULTIPLIER = 3;

export const TIMELINES: { id: Timeline; label: string; icon: IconKey }[] = [
  { id: "asap", label: "ASAP — this week", icon: "zap" },
  { id: "30-days", label: "Within 30 days", icon: "calendar" },
  { id: "months", label: "In the next few months", icon: "clock" },
  { id: "exploring", label: "Just exploring", icon: "compass" },
];

/** The tap steps before contact details; the progress bar counts these plus business + contact. */
export const QUIZ_STEPS = ["audience", "goal", "blockers", "budget", "timeline", "business", "contact"] as const;
export type QuizStep = (typeof QUIZ_STEPS)[number] | "result";

export const leadValue = (b?: Budget) => BUDGETS.find((x) => x.id === b)?.value ?? 10;
export const labelOf = {
  audience: (a?: Audience) => AUDIENCES.find((x) => x.id === a)?.label ?? "",
  goal: (a?: Audience, g?: GoalKey) => (a && GOALS[a].find((x) => x.key === g)?.label) || "",
  budget: (b?: Budget) => BUDGETS.find((x) => x.id === b)?.label ?? "",
  timeline: (t?: Timeline) => TIMELINES.find((x) => x.id === t)?.label ?? "",
};

/**
 * Cal.com booking-form options (hidden fields on the event type). Kept identical to the labels
 * above so a prefilled select value is always a valid option.
 */
export const CAL_GOAL_OPTIONS = ["More calls and bookings", "Show up on Google and AI answers", "Sell more products", "Something else"];
const CAL_GOAL: Record<GoalKey, string> = {
  calls: "More calls and bookings",
  shows: "More calls and bookings",
  visibility: "Show up on Google and AI answers",
  sales: "Sell more products",
  reviews: "Something else",
  website: "Something else",
  fans: "Something else",
};
export const calGoal = (g?: GoalKey) => (g ? CAL_GOAL[g] : undefined);
export const calBudget = (b?: Budget) => (b && b !== "unsure" ? labelOf.budget(b) : undefined);

export type Move = { title: string; body: string; points: string[]; offer?: "cards" | "audit" };

/** The single most valuable next step for these answers — shown before the calendar. */
export function moneyMove(a: Answers): Move {
  const has = (s: string) => a.blockers.includes(s);
  const word = AUDIENCES.find((x) => x.id === a.audience)?.word ?? "customers";
  const small = a.budget === "under-500" || a.timeline === "exploring";
  let m: Move;
  switch (a.goal) {
    case "reviews":
      m = {
        title: "Get 5-star reviews on autopilot",
        body: "More reviews means more trust and a higher spot on Google Maps. We set up the ask so happy customers leave a review before they walk out.",
        points: ["A Google profile tune-up so reviews turn into calls", "A tap-to-review card at the counter — one tap opens your review form", "A simple follow-up text for customers who forget"],
        offer: "cards",
      };
      break;
    case "visibility":
      m = {
        title: "Get named by Google and ChatGPT",
        body: `People now ask Google and AI assistants who to pick. We make sure the answer is you, so more ${word} find you without paying for every click.`,
        points: ["Fix what stops Google from ranking you", "Answer-ready pages that AI assistants quote", "A Google profile and listings that agree everywhere"],
        offer: "audit",
      };
      break;
    case "website":
      m = {
        title: "A site built to turn visitors into " + word,
        body: "Most sites look fine and still leak customers. We show you where yours loses people and what a page that converts looks like.",
        points: ["A clear offer above the fold", "One-tap call, booking or buy buttons", "Fast on phones and set up to rank"],
      };
      break;
    case "sales":
      m = {
        title: "Make every visitor worth more",
        body: "More traffic only helps if it buys. We fix the product page and checkout first, then send ads to a store that converts.",
        points: ["Product pages that answer objections", "Reviews and trust where people decide", "Ads aimed at buyers, not browsers"],
      };
      break;
    case "fans":
    case "shows":
      m = {
        title: a.goal === "shows" ? "Become the artist promoters book" : "Turn listeners into a fanbase",
        body: "Streams come and go. Fans who find you on Google, follow you and join your list stay — and they buy tickets and merch.",
        points: ["Own your name on Google", "A release page that grows your list", "Ads that bring real listeners, not bots"],
        offer: "audit",
      };
      break;
    default:
      m = {
        title: "Turn searches into phone calls",
        body: `People are searching for what you do right now. We make sure they find you first and have a reason to call — then add ads that bring ${word} on demand.`,
        points: ["A Google profile that wins the map pack", "A call-first page that turns visitors into leads", "Lead ads with a real follow-up so no lead goes cold"],
      };
  }
  if (has("Ads cost too much or don't work")) m.points = [...m.points.slice(0, 2), "Why your ads cost too much — and the fix for the offer, page and follow-up"];
  if (small && !m.offer) m.offer = a.audience === "local" || a.audience === "store" ? "cards" : "audit";
  return m;
}
