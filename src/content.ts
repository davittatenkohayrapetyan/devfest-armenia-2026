/**
 * Content loading.
 *
 * Speaker shape deliberately mirrors the Sessionize API response
 * (https://sessionize.com/api/v2/{embedId}/view/Speakers) so that switching from the
 * local file to the live API in October is a change to loadSpeakers() alone — the card
 * component and its CSS do not move. See docs/DECISIONS.md ADR-004.
 */

export type SpeakerLink = {
  title: string;
  url: string;
  linkType: string;
};

export type Speaker = {
  id: string;
  fullName: string;
  tagLine: string;
  bio: string;
  profilePicture: string;
  links: SpeakerLink[];
  sessions?: { id: string; name: string }[];
};

/**
 * One entry of public/content/sessions.json, written by `npm run sync:speakers`. Field names
 * follow Sessionize's /view/All sessions; for talks, `title`, `format` and `description` come
 * from the locked public text in scripts/session-text.lock.json, never the raw submission.
 * Service sessions (registration, opening, panel, closing, afterparty) come from the schedule
 * grid and are published as the organisers wrote them.
 */
export type Session = {
  id: string;
  title: string;
  description: string;
  format: "Talk" | "Workshop" | "Service";
  /** Service sessions only: a link that stood in for a description, e.g. the afterparty's map. */
  url: string | null;
  /** Venue local time with no offset, e.g. "2026-11-21T10:00:00". Null until scheduled. */
  startsAt: string | null;
  endsAt: string | null;
  roomId: number | null;
  room: string | null;
  roomSort: number | null;
  isServiceSession: boolean;
  isPlenumSession: boolean;
  /** Speaker ids, matching `Speaker.id` in speakers.json. */
  speakers: string[];
};

export type Organizer = {
  name: string;
  /** Their role on this event, e.g. "Co-Organizer". */
  role: string;
  /** Optional day-job title, e.g. "BS in DS Program Chair, ACSE, AUA". Rendered when set. */
  title?: string;
  photo: string;
  links?: SpeakerLink[];
};

export type Partner = {
  name: string;
  logo: string;
  /** Empty when a partner has given no link — the mark then renders unlinked. */
  url: string;
  /** Optional descriptor, e.g. "Media partner". Not a rank — there are no partner tiers. */
  role?: string;
};

export type SocialLink = {
  /** Network name — also selects the icon, so it must be "Instagram" or "LinkedIn". */
  name: string;
  handle: string;
  url: string;
};

export type EventContent = {
  name: string;
  date: string;
  dateLabel: string;
  /** Exact start instant, with offset. The countdown runs to this, not to `date`. */
  startsAt: string;
  venue: {
    name: string;
    detail: string;
    address: string;
    mapUrl: string;
    mapEmbedUrl: string;
  };
  cta: { register: string; cfp: string; chapter: string; lastYear: string };
  cfp: {
    opens: string;
    closes: string;
    formats: { name: string; length: string }[];
    topics: string[];
    note: string;
  };
  speakers: { noteWhileCfpOpen: string };
  /** GDG Yerevan's own channels, rendered as follow buttons in the footer. */
  social: SocialLink[];
  about: {
    lead: string;
    stats: { value: string; label: string }[];
  };
};

const base = import.meta.env.BASE_URL;

async function load<T>(file: string): Promise<T> {
  const res = await fetch(`${base}content/${file}`);
  if (!res.ok) throw new Error(`Could not load content/${file}: ${res.status}`);
  return res.json() as Promise<T>;
}

export const loadEvent = () => load<EventContent>("event.json");

export const loadPartners = () =>
  load<{ partners: Partner[]; contactUrl: string }>("partners.json");

/**
 * Reads the local file today.
 *
 * October swap — replace the body with:
 *
 *   const id = import.meta.env.VITE_SESSIONIZE_EMBED_ID;
 *   const res = await fetch(`https://sessionize.com/api/v2/${id}/view/Speakers`);
 *   if (!res.ok) return load<Speaker[]>("speakers.json");   // snapshot fallback
 *   return res.json();
 *
 * Nothing downstream changes. Tracked as DF-23.
 */
export const loadSpeakers = () => load<Speaker[]>("speakers.json");

export const loadSessions = () => load<Session[]>("sessions.json");

/** A moderator or panelist on an organisers' session. */
export type SessionPerson = {
  name: string;
  role: "Moderator" | "Panelist";
  title: string;
  /** Path under public/, or "" — the page then shows initials until a portrait is added. */
  photo: string;
};

/**
 * public/content/session-people.json, keyed by Sessionize session id. Hand-maintained: Sessionize
 * carries no speakers for service sessions, so a panel's people live here, not in the sync.
 * `summary`, when set, replaces the session's description on the page.
 */
export type SessionCast = { summary?: string; people: SessionPerson[] };

export const loadSessionPeople = () =>
  load<Record<string, SessionCast | string>>("session-people.json").then(
    (raw) =>
      new Map(
        Object.entries(raw).filter((e): e is [string, SessionCast] => typeof e[1] === "object"),
      ),
  );

export const loadOrganizers =() => load<Organizer[]>("organizers.json");

/** Days remaining until the CFP closes. Negative once it has closed. */
export function daysUntil(iso: string): number {
  const ms = new Date(iso).getTime() - Date.now();
  return Math.ceil(ms / 86_400_000);
}
