import "./style.css";
import {
  daysUntil,
  loadEvent,
  loadPartners,
  loadSpeakers,
  type EventContent,
  type PartnerTier,
  type Speaker,
} from "./content";

const base = import.meta.env.BASE_URL;
const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

function hero(e: EventContent): string {
  // Photo from DevFest Armenia 2025, GDG Yerevan's own archive. The scrim is not
  // decoration: hero text sits on it, so it carries the contrast. See DF-45.
  const photo = `${base}assets/photos/hero-audience.jpg`;
  return `
<header class="hero relative overflow-hidden"
        style="background-image:linear-gradient(180deg,rgba(30,30,30,.78),rgba(30,30,30,.94)),url('${photo}')">
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
  <div class="wrap py-8 flex flex-col md:flex-row items-center gap-6 md:gap-12">
    <p class="text-sm text-[#5f6368] shrink-0">Organized by</p>
    <div class="flex flex-wrap items-center justify-center gap-8 md:gap-14">
      <img class="collab-mark" src="${base}assets/logos/gdg-yerevan.png"
           alt="GDG Yerevan" onerror="this.style.display='none'">
      <img class="collab-mark" src="${base}assets/logos/aua-acse-navy.png"
           alt="Akian College of Science and Engineering, American University of Armenia">
    </div>
    <p class="text-sm text-[#5f6368] md:ml-auto text-center md:text-right">
      In collaboration with the Zaven P. &amp; Sonia Akian<br class="hidden md:block">
      College of Science &amp; Engineering at AUA
    </p>
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
      <p class="mt-1 text-sm hero-muted">Closes 14 October, 23:59 (UTC+04:00)</p>
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
    <div class="mt-10 flex flex-wrap gap-12">${stats}</div>
  </div>
</section>`;
}

function speakers(list: Speaker[], cfpUrl: string): string {
  const body =
    list.length === 0
      ? `<div class="mt-8 rounded-2xl p-10 text-center" style="background:var(--surface-alt)">
           <p class="text-lg">Speakers are announced after the call closes on 14 October.</p>
           <a class="btn btn-primary mt-6" href="${esc(cfpUrl)}" rel="noopener">Submit a talk</a>
         </div>`
      : `<div class="mt-8 grid gap-6 ${list.length > 8 ? "sm:grid-cols-3 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3"}">
           ${list
             .map(
               (s) => `<article class="rounded-2xl p-5" style="background:var(--surface-alt)">
               <img class="h-20 w-20 rounded-full object-cover" src="${esc(s.profilePicture)}" alt="" loading="lazy">
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
    ${body}
  </div>
</section>`;
}

function partners(tiers: PartnerTier[], contactUrl: string): string {
  const any = tiers.some((t) => t.partners.length > 0);
  const body = any
    ? tiers
        .filter((t) => t.partners.length)
        .map(
          (t) => `<div class="mt-8">
            <p class="text-sm text-[var(--ink-muted)]">${esc(t.label)}</p>
            <div class="mt-3 flex flex-wrap items-center gap-8">
              ${t.partners.map((p) => `<a href="${esc(p.url)}" rel="noopener"><img class="h-10 w-auto" src="${esc(p.logo)}" alt="${esc(p.name)}"></a>`).join("")}
            </div>
          </div>`,
        )
        .join("")
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
  const photo = e.venue.photo
    ? `<img class="mt-8 w-full rounded-2xl" src="${esc(e.venue.photo)}" alt="${esc(e.venue.name)}" loading="lazy">`
    : `<!-- DF-12: licensed ACSE building photo pending, see docs/BOARD.md -->`;
  return `
<section id="venue" class="py-20">
  <div class="wrap">
    <h2 class="text-3xl md:text-4xl font-bold">Venue</h2>
    <p class="mt-4 text-lg">${esc(e.venue.name)}</p>
    <p class="text-[var(--ink-muted)]">${esc(e.venue.detail)}</p>
    <p class="mt-2 text-[var(--ink-muted)]">${esc(e.venue.address)}</p>
    <a class="btn btn-secondary mt-6" href="${esc(e.venue.mapUrl)}" rel="noopener">Open in Maps</a>
    ${photo}
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

async function render() {
  const root = document.querySelector<HTMLDivElement>("#app")!;
  try {
    const [event, partnerData, speakerList] = await Promise.all([
      loadEvent(),
      loadPartners(),
      loadSpeakers(),
    ]);
    root.innerHTML = [
      hero(event),
      collaboration(),
      callForSpeakers(event),
      about(event),
      speakers(speakerList, event.cta.cfp),
      partners(partnerData.tiers, partnerData.contactUrl),
      venue(event),
      footer(event),
    ].join("");
  } catch (err) {
    root.innerHTML = `<div class="wrap py-20">
      <h1 class="text-2xl font-bold">Content failed to load</h1>
      <p class="mt-2 text-[var(--ink-muted)]">Check that public/content/*.json is valid: ${esc(String(err))}</p>
    </div>`;
  }
}

render();
