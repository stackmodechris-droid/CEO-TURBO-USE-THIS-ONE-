// 3-step quote intake for /services/home-office-setup: pick the job, city + timing, then contact details.
// Mobile-first (big tap targets, one question per screen). Posts to /api/lead as type "office-setup" and fires
// the same generate_lead event as every other lead; the success screen offers the call straight away.
import { useId, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, Check, Loader2, Phone } from "lucide-react";
import { SITE } from "@/config/site";
import { ALL_SETUP_CITIES } from "@/content/service-areas";
import { sendLead } from "@/lib/lead-outbox";
import { attribution, newEventId, track, visitorId } from "@/lib/track";
import { cn } from "@/lib/utils";

const JOB_SETS: Record<string, { label: string; sub: string; value: number }[]> = {
  "pos-system-setup": [
    { label: "Single POS terminal", sub: "1 register, reader, printer · $149", value: 149 },
    { label: "Standard 2-3 stations", sub: "Registers, kitchen printer, delivery tablets · $249", value: 249 },
    { label: "Complete restaurant/retail", sub: "Up to 5 stations, KDS, switch, cabling · $399", value: 399 },
  ],
  "office-transformation": [
    { label: "Basic office build-out", sub: "1-2 workstations · from $1,599", value: 1599 },
    { label: "Standard office build-out", sub: "3-5 workstations · from $2,299", value: 2299 },
    { label: "Complete office build-out", sub: "6+ workstations · from $3,199", value: 3199 },
  ],
  "dj-studio-setup": [
    { label: "DJ or studio desk", sub: "Gear, monitors, cables · from $149", value: 149 },
    { label: "Full room or booth", sub: "Monitors, interface, calibration · from $259", value: 259 },
  ],
};
const JOBS_DEFAULT = [
  { label: "Computer setup", sub: "Basic · from $99", value: 99 },
  { label: "Full home office", sub: "Desk + tech · from $129", value: 129 },
  { label: "Complete home office", sub: "Mounting, cables, Wi-Fi · $169", value: 169 },
  { label: "School / computer lab", sub: "Up to 5 stations · from $329", value: 329 },
];
const WHEN = ["ASAP", "This week", "Within 2 weeks", "Just planning"] as const;

export function OfficeIntake({ id = "quote", service = "home-office-setup" }: { id?: string; service?: string }) {
  const JOBS = JOB_SETS[service] ?? JOBS_DEFAULT;
  const uid = useId();
  const opened = useRef(Date.now());
  const [step, setStep] = useState(0);
  const [job, setJob] = useState("");
  const [city, setCity] = useState("");
  const [when, setWhen] = useState("");
  const [f, setF] = useState({ name: "", phone: "", email: "", company_site: "" });
  const [err, setErr] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const value = JOBS.find((j) => j.label === job)?.value ?? JOBS[0].value;
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (f.name.trim().length < 2) return setErr("Enter your name.");
    if (f.phone.replace(/\D/g, "").length < 10) return setErr("Enter a 10-digit phone number.");
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(f.email.trim())) return setErr("Enter a valid email so we can send your quote.");
    setErr("");
    setState("sending");
    const eventId = newEventId("lead");
    const note = `Service: ${service} | Job: ${job} | City: ${city} | When: ${when}`;
    const ev = { lead_source: "office-setup-intake", value, currency: "USD", content_name: "Office setup quote" };
    const user = { email: f.email, phone: f.phone, name: f.name, externalId: visitorId() };
    const ok = await sendLead({ ...f, type: "office-setup", service, business: job, note, eventId, value, visitorId: visitorId(), attribution: attribution(), elapsedMs: Date.now() - opened.current, page: window.location.pathname });
    track("generate_lead", ev, { eventId, user });
    setState(ok ? "done" : "error");
  };

  if (state === "done" || state === "error") {
    return (
      <div id={id} className="panel p-6 text-center" role="status">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-400/15">
          <Check className="h-7 w-7 text-emerald-300" aria-hidden />
        </span>
        <h3 className="mt-4 text-2xl font-bold">{state === "done" ? "Got it. We'll text you." : "Saved. Call to confirm."}</h3>
        <p className="mt-2 text-muted-foreground">
          {job} in {city}. {state === "done" ? "Want it faster? Call now and we'll lock in a time." : "We couldn't reach our server, but your request is saved on this device. Calling is the fastest way."}
        </p>
        <a href={SITE.phone.href} data-call-location="home-office-intake-done" className="btn-ignite mt-5 inline-flex items-center gap-2">
          <Phone className="h-4 w-4" />
          Call {SITE.phone.display}
        </a>
      </div>
    );
  }

  const pill = (active: boolean) => cn("min-h-12 rounded-xl border px-4 py-3 text-left text-sm font-medium transition", active ? "border-turbo bg-turbo/15 text-foreground" : "border-border bg-card/40 hover:border-turbo/60");

  return (
    <form id={id} onSubmit={submit} noValidate className="panel scroll-mt-24 p-5 sm:p-6" aria-label="Get a setup quote">
      <div className="flex items-center justify-between">
        <p className="font-display text-sm font-bold text-turbo">Free quote · step {step + 1} of 3</p>
        {step > 0 && (
          <button type="button" onClick={() => setStep(step - 1)} className="inline-flex min-h-10 items-center gap-1 text-xs text-muted-foreground" aria-label="Back">
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </button>
        )}
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded bg-border" aria-hidden>
        <div className="h-full bg-turbo transition-all duration-300" style={{ width: `${((step + 1) / 3) * 100}%` }} />
      </div>

      {step === 0 && (
        <fieldset className="mt-5">
          <legend className="text-lg font-semibold">What do you need set up?</legend>
          <div className="mt-3 grid gap-2.5">
            {JOBS.map((j) => (
              <button key={j.label} type="button" className={pill(job === j.label)} onClick={() => { setJob(j.label); setStep(1); }}>
                <span className="block">{j.label}</span>
                <span className="block text-xs font-normal text-muted-foreground">{j.sub}</span>
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {step === 1 && (
        <div className="mt-5">
          <label htmlFor={`${uid}-city`} className="text-lg font-semibold">Where are you?</label>
          <select id={`${uid}-city`} className="field mt-3" value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">Select your city…</option>
            {[...ALL_SETUP_CITIES].sort().map((c) => (
              <option key={c}>{c}</option>
            ))}
            <option>Other (within 2 hours of Duluth)</option>
          </select>
          <p className="mt-5 text-lg font-semibold">How soon?</p>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            {WHEN.map((w) => (
              <button key={w} type="button" className={pill(when === w)} onClick={() => setWhen(w)}>
                {w}
              </button>
            ))}
          </div>
          <button type="button" className="btn-ignite mt-5 w-full !py-4" onClick={() => (city && when ? setStep(2) : setErr("Pick your city and timing."))}>
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="mt-5">
          <p className="text-lg font-semibold">Where do we send your quote?</p>
          <div className="mt-3 space-y-3">
            <input data-clarity-mask="true" aria-label="Your name" placeholder="Your name" autoComplete="name" className="field" value={f.name} onChange={set("name")} maxLength={100} />
            <input data-clarity-mask="true" aria-label="Phone" placeholder="Phone" type="tel" inputMode="tel" autoComplete="tel" className="field" value={f.phone} onChange={set("phone")} maxLength={30} />
            <input data-clarity-mask="true" aria-label="Email" placeholder="Email" type="email" inputMode="email" autoComplete="email" className="field" value={f.email} onChange={set("email")} maxLength={200} />
          </div>
          <label className="hidden" aria-hidden>
            Company site
            <input tabIndex={-1} autoComplete="off" value={f.company_site} onChange={set("company_site")} />
          </label>
          <button type="submit" disabled={state === "sending"} className="btn-ignite btn-shine mt-5 flex w-full items-center justify-center gap-2 !py-4">
            {state === "sending" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            Get my free quote
          </button>
          <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">Flat price confirmed before we start. No spam; we only contact you about this job.</p>
        </div>
      )}
      {err && (
        <p className="mt-3 text-sm font-medium text-[#ff8080]" role="alert">
          {err}
        </p>
      )}
    </form>
  );
}
