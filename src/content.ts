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

export type Partner = {
  name: string;
  logo: string;
  url: string;
};

export type PartnerTier = {
  id: string;
  label: string;
  partners: Partner[];
};

export type EventContent = {
  name: string;
  date: string;
  dateLabel: string;
  venue: {
    name: string;
    detail: string;
    address: string;
    mapUrl: string;
    photo: string | null;
  };
  cta: { register: string; cfp: string; chapter: string; lastYear: string };
  cfp: {
    opens: string;
    closes: string;
    formats: { name: string; length: string }[];
    topics: string[];
    note: string;
  };
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
  load<{ tiers: PartnerTier[]; contactUrl: string }>("partners.json");

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

/** Days remaining until the CFP closes. Negative once it has closed. */
export function daysUntil(iso: string): number {
  const ms = new Date(iso).getTime() - Date.now();
  return Math.ceil(ms / 86_400_000);
}
