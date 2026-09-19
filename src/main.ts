import "./style.css";
import {
  daysUntil,
  loadEvent,
  loadOrganizers,
  loadPartners,
  loadSpeakers,
  type EventContent,
  type Organizer,
  type Partner,
  type Speaker,
} from "./content";

const base = import.meta.env.BASE_URL;

/**
 * Speaker photos are synced to repo-relative paths ("assets/speakers/x.png") so the site
 * carries no third-party dependency for faces. Absolute URLs are still tolerated, in case a
 * record is ever hand-written against the Sessionize CDN.
 */
const asset = (path: string): string => (/^https?:\/\//.test(path) ? path : `${base}${path}`);
const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

/** Whole days, hours and minutes until `iso`, or null once it has passed. */
function countdownParts(iso: string): { days: number; hours: number; minutes: number } | null {
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return null;
  const totalMinutes = Math.floor(ms / 60_000);
  return {
    days: Math.floor(totalMinutes / 1440),
    hours: Math.floor((totalMinutes % 1440) / 60),
    minutes: totalMinutes % 60,
  };
}

const pad = (n: number): string => String(n).padStart(2, "0");

/**
 * The countdown is aria-hidden and the hero already states the date in words: a timer that
 * re-announces itself every minute is noise for a screen reader, and it carries no information
 * the date line does not.
 */
function countdown(iso: string): string {
  const p = countdownParts(iso);
  if (!p) return "";
  const cell = (value: string, label: string) => `<div class="countdown-cell">
      <span class="countdown-value" data-countdown="${label}">${value}</span>
      <span class="countdown-label">${label}</span>
    </div>`;
  return `<div class="countdown mt-8" data-countdown-to="${esc(iso)}" aria-hidden="true">
    ${cell(String(p.days), "days")}${cell(pad(p.hours), "hours")}${cell(pad(p.minutes), "minutes")}
  </div>`;
}

function hero(e: EventContent): string {
  // Photo from DevFest Armenia 2025, GDG Yerevan's own archive. The scrim is not
  // decoration: hero text sits on it, so it carries the contrast. See DF-45.
  const photo = `${base}assets/photos/hero-audience.jpg`;
  return `
<header class="hero relative overflow-hidden"
        style="background-image:linear-gradient(180deg,rgba(30,30,30,.78),rgba(30,30,30,.94)),url('${photo}')">
  <img class="hero-badge" src="${base}assets/logos/google-for-developers.png" alt="Google for Developers">
  <img class="hero-art hero-art-a" src="${base}assets/art/element1.svg" alt="" aria-hidden="true">
  <img class="hero-art hero-art-b" src="${base}assets/art/se-1.svg" alt="" aria-hidden="true">
  <div class="wrap py-20 md:py-28 relative">
    <img class="hero-lockup" src="${base}assets/logos/devfest-armenia-lockup.svg" alt="" aria-hidden="true">
    <p class="mt-6 text-sm hero-muted">Google Developer Groups Yerevan presents</p>
    <h1 class="mt-3 text-5xl md:text-7xl font-bold tracking-tight">DevFest Armenia 2026</h1>
    <div class="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-lg">
      <span>${esc(e.dateLabel)}</span>
      <span class="hero-muted">${esc(e.venue.name)}, Yerevan</span>
    </div>
    ${countdown(e.startsAt)}
    <div class="mt-10 flex flex-wrap gap-4">
      <a class="btn btn-primary" href="${esc(e.cta.register)}" rel="noopener">Register to attend</a>
      <a class="btn btn-on-dark" href="${esc(e.cta.cfp)}" rel="noopener">Submit a talk</a>
    </div>
  </div>
  <div class="flex h-1.5">
    <div class="flex-1 rule-blue"></div><div class="flex-1 rule-red"></div>
    <div class="flex-1 rule-yellow"></div><div class="flex-1 rule-green"></div>
  </div>
</header>`;
}

/** GDG Yerevan and AUA ACSE at equal optical weight. See docs/BRAND.md. */
function collaboration(): string {
  return `
<section class="collab-strip" aria-label="Organizers">
  <div class="wrap pt-12 pb-8 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
    <div class="collab-group">
      <p class="collab-label">Organized by</p>
      <img class="collab-mark collab-mark--gdg" src="${base}assets/logos/gdg-yerevan.png"
           alt="GDG Yerevan" onerror="this.style.display='none'">
    </div>
    <span class="collab-x" aria-hidden="true">&times;</span>
    <div class="collab-group">
      <img class="collab-mark collab-mark--aua" src="${base}assets/logos/aua-acse-strip.png"
           alt="Akian College of Science and Engineering, American University of Armenia">
    </div>
  </div>
</section>`;
}

function callForSpeakers(e: EventContent): string {
  const left = daysUntil(e.cfp.closes);
  if (left < 0) return "";
  const formats = e.cfp.formats
    .map((f) => `<li>${esc(f.name)} — ${esc(f.length)}</li>`)
    .join("");
  const topics = e.cfp.topics
    .map(
      (t) =>
        `<li class="rounded-full px-3 py-1 text-sm" style="background:var(--df-pastel-blue);color:#1e1e1e">${esc(t)}</li>`,
    )
    .join("");
  return `
<section id="cfp" class="cfp-band py-20"
         style="background-image:linear-gradient(180deg,rgba(30,30,30,.90),rgba(30,30,30,.96)),url('${base}assets/photos/cfp-audience.jpg')">
  <div class="wrap grid gap-12 md:grid-cols-[1.1fr_1fr]">
    <div>
      <h2 class="text-3xl md:text-4xl font-bold">Call for speakers is open</h2>
      <p class="mt-4 prose-measure hero-muted">
        We are looking for practical experience, technical insight, lessons learned, deep
        dives and case studies that bring real value to the developer community. First-time
        speakers are welcome — what matters is the relevance of the topic.
      </p>
      <ul class="mt-6 space-y-1">${formats}</ul>
      <p class="mt-4 text-sm hero-muted prose-measure">${esc(e.cfp.note)}</p>
      <p class="mt-4 text-sm hero-muted prose-measure">
        Sessions should be educational rather than promotional. Commercial partnership with
        the event does not influence speaker selection.
      </p>
      <a class="btn btn-primary mt-8" href="${esc(e.cta.cfp)}" rel="noopener">Submit your session</a>
    </div>
    <div>
      <p class="text-6xl md:text-7xl font-bold" style="color:var(--df-red)">${left}</p>
      <p class="text-lg">days left to submit</p>
      <p class="mt-1 text-sm hero-muted">Closes 8 November, 23:59 (UTC+04:00)</p>
      <ul class="mt-8 flex flex-wrap gap-2">${topics}</ul>
    </div>
  </div>
</section>`;
}

function about(e: EventContent): string {
  const stats = e.about.stats
    .map(
      (s) => `<div>
        <p class="text-4xl font-bold">${esc(s.value)}</p>
        <p class="text-[var(--ink-muted)]">${esc(s.label)}</p>
      </div>`,
    )
    .join("");
  return `
<section id="about" class="py-20">
  <div class="wrap">
    <h2 class="text-3xl md:text-4xl font-bold">About the event</h2>
    <p class="mt-4 prose-measure text-lg text-[var(--ink-muted)]">${esc(e.about.lead)}</p>
    <p class="mt-8">
      <a class="btn btn-secondary" href="${esc(e.cta.lastYear)}" rel="noopener">
        See how DevFest Armenia 2025 went <span aria-hidden="true">→</span>
      </a>
    </p>
    <div class="mt-10 flex flex-wrap gap-12">${stats}</div>
  </div>
</section>`;
}

function speakers(list: Speaker[], e: EventContent): string {
  const cfpUrl = e.cta.cfp;
  // While the call is open the published list is a first cut, not the lineup. Saying so
  // avoids four names reading as the whole programme of a 20+ speaker, three-track event.
  const cfpOpen = daysUntil(e.cfp.closes) >= 0;
  const note =
    list.length > 0 && cfpOpen
      ? `<p class="mt-3 text-[var(--ink-muted)] prose-measure">${esc(e.speakers.noteWhileCfpOpen)}</p>`
      : "";
  // Only alongside a populated grid: the empty state carries its own call, and after the CFP
  // closes there is nothing to submit to. DF-27 checks this flips on 8 November.
  const cta =
    list.length > 0 && cfpOpen
      ? `<a class="btn btn-primary mt-10" href="${esc(cfpUrl)}" rel="noopener">Become a speaker</a>`
      : "";
  const body =
    list.length === 0
      ? `<div class="mt-8 rounded-2xl p-10 text-center" style="background:var(--surface-alt)">
           <p class="text-lg">Speakers are announced after the call closes on 8 November.</p>
           <a class="btn btn-primary mt-6" href="${esc(cfpUrl)}" rel="noopener">Submit a talk</a>
         </div>`
      : `<div class="mt-8 grid gap-6 ${list.length > 8 ? "sm:grid-cols-3 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3"}">
           ${list
             .map(
               (s) => `<article class="rounded-2xl p-5" style="background:var(--surface-alt)">
               <img class="h-20 w-20 rounded-full object-cover" src="${esc(asset(s.profilePicture))}" alt="" loading="lazy">
               <h3 class="mt-4 font-bold">${esc(s.fullName)}</h3>
               <p class="text-sm text-[var(--ink-muted)]">${esc(s.tagLine)}</p>
             </article>`,
             )
             .join("")}
         </div>`;
  return `
<section id="speakers" class="py-20">
  <div class="wrap">
    <h2 class="text-3xl md:text-4xl font-bold">Speakers</h2>
    ${note}
    ${body}
    ${cta}
  </div>
</section>`;
}

function agenda(): string {
  return `
<section id="agenda" class="py-20" style="background:var(--surface-alt)">
  <div class="wrap">
    <h2 class="text-3xl md:text-4xl font-bold">Agenda</h2>
    <div class="mt-8 rounded-2xl p-10 text-center" style="background:var(--surface)">
      <p class="text-lg">The agenda will be announced closer to the event.</p>
      <p class="mt-2 text-[var(--ink-muted)]">
        Three tracks plus workshops, across a single day.
      </p>
    </div>
  </div>
</section>`;
}

function organizers(list: Organizer[]): string {
  if (list.length === 0) return "";
  return `
<section id="team" class="py-20">
  <div class="wrap">
    <h2 class="text-3xl md:text-4xl font-bold">Meet the team</h2>
    <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      ${list
        .map(
          (o) => `<article class="rounded-2xl p-5" style="background:var(--surface-alt)">
            <img class="h-20 w-20 rounded-full object-cover" src="${esc(asset(o.photo))}" alt="" loading="lazy">
            <h3 class="mt-4 font-bold">${esc(o.name)}</h3>
            <p class="text-sm text-[var(--ink-muted)]">${esc(o.role)}</p>
          </article>`,
        )
        .join("")}
    </div>
  </div>
</section>`;
}

function partners(list: Partner[], contactUrl: string): string {
  // One flat list — there are no partner tiers. `role` describes the relationship where one
  // needs describing; it is not a rank and must never be sorted on.
  const body = list.length
    ? `<div class="mt-8 flex flex-wrap items-start gap-6">
         ${list
           .map(
             (p) => `<div class="text-center">
               <a class="partner-chip" href="${esc(p.url)}" rel="noopener">
                 <img class="partner-mark" src="${esc(asset(p.logo))}" alt="${esc(p.name)}">
               </a>
               ${p.role ? `<p class="mt-2 text-sm text-[var(--ink-muted)]">${esc(p.role)}</p>` : ""}
             </div>`,
           )
           .join("")}
       </div>`
    : `<p class="mt-6 prose-measure text-[var(--ink-muted)]">
         Partner announcements are coming soon. If your organization would like to support
         the Armenian developer community, we would like to hear from you.
       </p>`;
  return `
<section id="partners" class="py-20" style="background:var(--surface-alt)">
  <div class="wrap">
    <h2 class="text-3xl md:text-4xl font-bold">Partners</h2>
    ${body}
    <a class="btn btn-secondary mt-8" href="${esc(contactUrl)}">Become a partner</a>
  </div>
</section>`;
}

function venue(e: EventContent): string {
  return `
<section id="venue" class="py-20">
  <div class="wrap">
    <h2 class="text-3xl md:text-4xl font-bold">Venue</h2>
    <p class="mt-4 text-lg">${esc(e.venue.name)}</p>
    <p class="text-[var(--ink-muted)]">${esc(e.venue.detail)}</p>
    <p class="mt-2 text-[var(--ink-muted)]">${esc(e.venue.address)}</p>
    <a class="btn btn-secondary mt-6" href="${esc(e.venue.mapUrl)}" rel="noopener">Open in Maps</a>
    <div class="venue-map venue-map-placeholder">
      <p class="venue-map-note">
        The map is a Google embed. Nothing is requested from Google, and no cookies are set,
        until you load it.
      </p>
      <button class="btn btn-secondary mt-4" type="button"
              data-load-map="${esc(e.venue.mapEmbedUrl)}"
              data-map-title="Map of ${esc(e.venue.name)}, ${esc(e.venue.address)}">
        Load map
      </button>
    </div>
  </div>
</section>`;
}

function footer(e: EventContent): string {
  return `
<footer class="py-14" style="background:var(--df-surface-dark);color:var(--df-surface-light)">
  <div class="wrap">
    <p class="text-lg font-bold">DevFest Armenia 2026</p>
    <p class="mt-2 opacity-70">${esc(e.dateLabel)} · ${esc(e.venue.name)}, Yerevan</p>
    <p class="mt-6 opacity-70 prose-measure">
      GDG Yerevan has moved from Meetup to the official GDG Community platform. Follow us
      there for all events and announcements.
    </p>
    <a class="underline mt-3 inline-block" href="${esc(e.cta.chapter)}" rel="noopener">gdg.community.dev/gdg-yerevan</a>
  </div>
</footer>`;
}

/**
 * Swaps the placeholder for the real embed on click. The map stays behind a press so that no
 * request reaches Google — and no cookie is set — unless a visitor asks for it. That is what
 * keeps ADR-012's cookieless position true for the page as a whole, not just for analytics.
 */
/** Keeps the hero countdown honest without re-rendering the page. */
function wireCountdown(root: HTMLElement): void {
  const box = root.querySelector<HTMLElement>("[data-countdown-to]");
  const iso = box?.dataset.countdownTo;
  if (!box || !iso) return;
  const tick = () => {
    const p = countdownParts(iso);
    if (!p) {
      box.remove();
      window.clearInterval(timer);
      return;
    }
    const set = (k: string, v: string) => {
      const el = box.querySelector<HTMLElement>(`[data-countdown="${k}"]`);
      if (el && el.textContent !== v) el.textContent = v;
    };
    set("days", String(p.days));
    set("hours", pad(p.hours));
    set("minutes", pad(p.minutes));
  };
  const timer = window.setInterval(tick, 15_000);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) tick();
  });
}

function wireMapButton(root: HTMLElement): void {
  const button = root.querySelector<HTMLButtonElement>("[data-load-map]");
  if (!button) return;
  button.addEventListener("click", () => {
    const slot = button.parentElement;
    if (!slot) return;
    const frame = document.createElement("iframe");
    frame.className = "venue-map";
    frame.src = button.dataset.loadMap ?? "";
    frame.title = button.dataset.mapTitle ?? "Map";
    frame.referrerPolicy = "no-referrer-when-downgrade";
    slot.replaceWith(frame);
    frame.focus();
  });
}

async function render() {
  const root = document.querySelector<HTMLDivElement>("#app")!;
  try {
    const [event, partnerData, speakerList, organizerList] = await Promise.all([
      loadEvent(),
      loadPartners(),
      loadSpeakers(),
      loadOrganizers(),
    ]);
    root.innerHTML = [
      `<a class="skip-link" href="#main">Skip to content</a>`,
      hero(event),
      collaboration(),
      `<main id="main" tabindex="-1">`,
      callForSpeakers(event),
      about(event),
      speakers(speakerList, event),
      agenda(),
      organizers(organizerList),
      partners(partnerData.partners, partnerData.contactUrl),
      venue(event),
      `</main>`,
      footer(event),
    ].join("");
    wireMapButton(root);
    wireCountdown(root);
  } catch (err) {
    root.innerHTML = `<div class="wrap py-20">
      <h1 class="text-2xl font-bold">Content failed to load</h1>
      <p class="mt-2 text-[var(--ink-muted)]">Check that public/content/*.json is valid: ${esc(String(err))}</p>
    </div>`;
  }
}

render();
