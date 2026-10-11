import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Check, Laptop, Lock, MessageSquareQuote, Play, Smartphone, X } from "lucide-react";
import { Breadcrumbs, FAQList } from "@/components/blocks/Basics";
import { BookButton } from "@/components/cta/Actions";
import { ReviewLinkTool } from "@/components/shop/ReviewLinkTool";
import { CardFace, NfcRings } from "@/components/visuals/ReviewVisuals";
import { NFC_APP } from "@/config/site";
import { RULES, SETUP_FAQS, SETUP_PATH, SHOP_PATH } from "@/content/review-cards";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "link", title: "Get your Google review link" },
  { id: "app", title: `Download ${NFC_APP.name}` },
  { id: "write", title: "Write the link to your card" },
  { id: "test", title: "Test the tap" },
  { id: "lock", title: "Lock it (optional)" },
  { id: "place", title: "Place it and start asking" },
];
const STORE = "ct_setup_v1";

export default function ReviewCardSetup() {
  const [done, setDone] = useState<string[]>([]);
  const [tab, setTab] = useState<"computer" | "phone">("computer");

  useEffect(() => {
    try {
      setDone(JSON.parse(localStorage.getItem(STORE) || "[]"));
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = (id: string) =>
    setDone((d) => {
      const next = d.includes(id) ? d.filter((x) => x !== id) : [...d, id];
      try {
        localStorage.setItem(STORE, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });

  const required = STEPS.filter((s) => s.id !== "lock");
  const progress = Math.round((required.filter((s) => done.includes(s.id)).length / required.length) * 100);

  return (
    <>
      <section className="relative overflow-clip pt-28 sm:pt-32">
        <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 glow-turbo" aria-hidden />
        <div className="container-x relative">
          <Breadcrumbs items={[{ name: "Google review cards", path: SHOP_PATH }, { name: "Setup guide", path: SETUP_PATH }]} />
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="hero-rise">
              <p className="chip">Your card arrived — nice.</p>
              <h1 className="mt-5 text-4xl font-bold leading-[1.02] sm:text-6xl">
                Set up your Google review card <span className="text-turbo-grad">in 5 minutes.</span>
              </h1>
              <p className="lede">Find your review link, write it to the card with a free app, test it, and put it where customers pay. Every step is below — tick them off as you go.</p>
              <p className="mt-5 flex flex-wrap gap-2 text-sm text-muted-foreground">
                <span className="chip">
                  <Smartphone className="h-3.5 w-3.5" aria-hidden /> Your phone
                </span>
                <span className="chip">The card</span>
                <span className="chip">Your Google login</span>
              </p>
            </div>
            <div className="panel p-5 sm:p-6">
              <div className="flex items-center justify-between text-sm">
                <p className="font-semibold">Your progress</p>
                <p className="tabular-nums text-muted-foreground">{progress}%</p>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-turbo to-[#6cc6ff] transition-[width] duration-700" style={{ width: `${progress}%` }} />
              </div>
              <ol className="mt-5 space-y-1">
                {STEPS.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm hover:bg-white/[0.03]">
                      <span className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors", done.includes(s.id) ? "bg-emerald-400 text-black" : "bg-white/5 text-muted-foreground")}>{done.includes(s.id) ? <Check className="h-3.5 w-3.5" aria-hidden /> : i + 1}</span>
                      <span className={cn(done.includes(s.id) && "text-muted-foreground line-through decoration-white/20")}>{s.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <div className="container-x mt-16 max-w-[900px] space-y-6 pb-8">
        <Step n={1} id="link" title={STEPS[0].title} done={done.includes("link")} onToggle={toggle}>
          <p>Your review link opens Google's “rate and review” form for your business. Google gives it to every verified Business Profile — it looks like <code className="rounded bg-white/5 px-1.5 py-0.5 text-[13px] text-foreground">g.page/r/…/review</code>.</p>
          <div role="tablist" aria-label="Where are you?" className="mt-5 inline-grid grid-cols-2 gap-1 rounded-2xl bg-white/[0.04] p-1">
            {(
              [
                ["computer", "On a computer", Laptop],
                ["phone", "On my phone", Smartphone],
              ] as const
            ).map(([k, l, Icon]) => (
              <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={cn("flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all", tab === k ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground")}>
                <Icon className="h-4 w-4" aria-hidden /> {l}
              </button>
            ))}
          </div>
          {tab === "computer" ? (
            <ol className="steps mt-4" role="tabpanel">
              <li>Go to google.com and sign in with the Google account that manages your Business Profile.</li>
              <li>Search your exact business name (or just search “my business”).</li>
              <li>
                In your profile panel, click <b>Ask for reviews</b>. On some accounts it's <b>Read reviews</b> → <b>Get more reviews</b>.
              </li>
              <li>
                Click <b>Copy link</b> and paste it into the checker below.
              </li>
            </ol>
          ) : (
            <ol className="steps mt-4" role="tabpanel">
              <li>Open the Google Maps app, signed in to the account that manages your business.</li>
              <li>
                Tap your profile picture → <b>Your Business Profile</b> (or the <b>Business</b> tab) and pick your business.
              </li>
              <li>
                Tap <b>Ask for reviews</b> — sometimes under <b>Promote</b> or <b>Customers → Reviews</b>.
              </li>
              <li>
                Tap <b>Copy link</b> and paste it into the checker below.
              </li>
            </ol>
          )}
          <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--ignite-hot))]" aria-hidden />
            Google moves these buttons around now and then. No profile or not verified yet?{" "}
            <BookButton variant="link" note="Setup — needs Google Business Profile" prefill="I need help claiming/verifying my Google Business Profile for my review card." className="!inline">
              We'll help you set it up
            </BookButton>
          </p>
          <div className="mt-6">
            <ReviewLinkTool />
          </div>
        </Step>

        <Step n={2} id="app" title={STEPS[1].title} done={done.includes("app")} onToggle={toggle}>
          <p>
            {NFC_APP.name} (by wakdev) writes your link to the card's chip. It's free — you don't need the Pro version. You only use it once; your customers never need it.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href={NFC_APP.ios} target="_blank" rel="noopener noreferrer" className="store-btn">
              <Smartphone className="h-6 w-6" aria-hidden />
              <span>
                <span className="block text-[10px] leading-none text-muted-foreground">Download on the</span>
                <span className="block text-base font-semibold leading-tight">App Store</span>
              </span>
            </a>
            <a href={NFC_APP.android} target="_blank" rel="noopener noreferrer" className="store-btn">
              <Play className="h-6 w-6" aria-hidden />
              <span>
                <span className="block text-[10px] leading-none text-muted-foreground">Get it on</span>
                <span className="block text-base font-semibold leading-tight">Google Play</span>
              </span>
            </a>
          </div>
        </Step>

        <Step n={3} id="write" title={STEPS[2].title} done={done.includes("write")} onToggle={toggle}>
          <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <ol className="steps">
              <li>
                Open {NFC_APP.name} and tap <b>Write</b>.
              </li>
              <li>
                Tap <b>Add a record</b> → <b>URL / URI</b>.
              </li>
              <li>Paste your review link. If the app already shows “https://” in front of the box, paste the version without it.</li>
              <li>
                Tap <b>OK</b>, then <b>Write / 1 record</b>.
              </li>
              <li>
                Hold the card flat against your phone — <b>iPhone:</b> the top edge near the camera. <b>Android:</b> the middle of the back. Keep still until you see <b>Write complete</b>.
              </li>
            </ol>
            <div className="relative mx-auto aspect-square w-full max-w-[260px]" aria-hidden>
              <CardFace className="absolute bottom-0 left-[6%] w-[46%] -rotate-6 drop-shadow-[0_24px_30px_rgba(0,0,0,0.6)]" />
              <div className="animate-float absolute right-0 top-0 aspect-[9/19] w-[38%] rounded-[22%/10.5%] bg-[#0d1117] p-[4%] shadow-[inset_0_0_0_2px_rgba(255,255,255,0.15),0_30px_40px_-10px_rgba(0,0,0,0.8)]">
                <div className="grid h-full place-items-center rounded-[17%/8%] bg-gradient-to-b from-[#123] to-[#0b1220] text-center text-[10px] font-semibold text-emerald-300">
                  <span>
                    <Check className="mx-auto mb-1 h-5 w-5" />
                    Write complete
                  </span>
                </div>
              </div>
              <NfcRings className="left-[30%] top-[42%] h-[30%] w-[30%]" />
            </div>
          </div>
        </Step>

        <Step n={4} id="test" title={STEPS[3].title} done={done.includes("test")} onToggle={toggle}>
          <ol className="steps">
            <li>Close {NFC_APP.name} and unlock your phone.</li>
            <li>Tap the card. On iPhone a banner pops up at the top — tap it. Android opens the link right away.</li>
            <li>Your review form should open with stars ready to tap. Don't post a review of your own business — just check it opens.</li>
            <li>Try a second phone if you can (a staff member's), ideally one iPhone and one Android.</li>
          </ol>
          <p className="mt-4 text-sm text-muted-foreground">Want a QR code too, for receipts or older phones? Download the QR from the finder in step 1 and print it on a sticker, sign or receipt.</p>
        </Step>

        <Step n={5} id="lock" title={STEPS[4].title} done={done.includes("lock")} onToggle={toggle}>
          <p>
            Locking stops anyone else from rewriting your card. In {NFC_APP.name}: <b>Other</b> → <b>Lock tag</b> → hold the card to your phone.
          </p>
          <p className="mt-3 flex items-start gap-2 rounded-xl bg-[hsl(var(--ignite)/0.08)] p-3 text-sm text-[hsl(var(--ignite-hot))]">
            <Lock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> Locking is permanent — you can never change the link again. Only lock after you've tested it. Skip this if your card stays behind the counter.
          </p>
        </Step>

        <Step n={6} id="place" title={STEPS[5].title} done={done.includes("place")} onToggle={toggle}>
          <p>Put the card where the job ends: next to the register, on the check folder, at each chair or station, or in your hand when you finish a job. Peel the backing and press firmly for 30 seconds. Avoid metal surfaces — they block NFC.</p>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {[
              "Thanks for coming in! Would you mind leaving us a quick Google review? Just tap your phone right here.",
              "Before I head out — could you tap this? It opens our Google review page. Takes ten seconds and really helps us.",
            ].map((q) => (
              <blockquote key={q} className="panel flex gap-3 p-4 text-[15px] leading-relaxed">
                <MessageSquareQuote className="mt-0.5 h-5 w-5 shrink-0 text-turbo" aria-hidden />“{q}”
              </blockquote>
            ))}
          </div>
          <p className="mt-6 font-semibold">Keep it within Google's rules</p>
          <ul className="mt-3 grid gap-2">
            {RULES.map((r) => (
              <li key={r.text} className="flex items-start gap-2.5 text-sm">
                {r.ok ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-label="Do" /> : <X className="mt-0.5 h-4 w-4 shrink-0 text-[#ff6b6b]" aria-label="Don't" />}
                {r.text}
              </li>
            ))}
          </ul>
        </Step>
      </div>

      <FAQList faqs={SETUP_FAQS} title="Troubleshooting" />

      <section className="section pt-0">
        <div className="container-x">
          <div className="cta-glow grid gap-6 rounded-3xl p-7 sm:p-10 lg:grid-cols-[1.4fr_auto] lg:items-center">
            <div>
              <h2 className="h-section">Stuck, or want it done for you?</h2>
              <p className="lede">Book a free call and we'll walk you through it — or set up your whole Google Business Profile so those new reviews turn into calls.</p>
            </div>
            <div className="flex flex-col gap-3">
              <BookButton note="Setup guide — help" prefill="I need help setting up my Google review card.">
                Book a free setup call
              </BookButton>
              <Link to={SHOP_PATH} className="btn-chrome">
                Order more cards
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Step({ n, id, title, done, onToggle, children }: { n: number; id: string; title: string; done: boolean; onToggle: (id: string) => void; children: ReactNode }) {
  return (
    <section id={id} className={cn("panel scroll-mt-24 p-5 transition-shadow duration-500 sm:p-8", done && "shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(52,211,153,0.35)]")} aria-labelledby={`${id}-h`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-2xl font-display text-lg font-bold transition-colors", done ? "bg-emerald-400 text-black" : "bg-turbo/10 text-turbo ring-1 ring-turbo/30")}>{done ? <Check className="h-5 w-5" aria-hidden /> : n}</span>
          <h2 id={`${id}-h`} className="text-2xl font-bold sm:text-3xl">
            {title}
          </h2>
        </div>
        <button type="button" onClick={() => onToggle(id)} aria-pressed={done} className={cn("choice shrink-0 !px-3 !py-2 !text-xs", done && "choice-on")}>
          {done ? "Done" : "Mark done"}
        </button>
      </div>
      <div className="mt-5 leading-relaxed text-foreground/85">{children}</div>
    </section>
  );
}
