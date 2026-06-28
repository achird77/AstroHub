import React, { useState, useEffect, useContext, createContext, useMemo, useRef } from "react";
import {
  Sparkles, Users, Plus, Settings, X, ChevronDown, Moon, Sun, Star,
  Heart, Compass, Calendar, Clock, MapPin, Trash2, Orbit, Flame,
  Mountain, Wind, Droplets, Check, ArrowLeftRight, Wand2, NotebookPen,
  Send, Copy, CalendarDays, TrendingUp,
} from "lucide-react";

/* ============================================================
   ASTRARIUM — A Celestial Astrology Dashboard
   Single-file React app. Styling: injected CSS tokens + Tailwind
   utilities for layout. Colors live in CSS variables so the
   bespoke celestial palette renders anywhere.
   ============================================================ */

// --- Theme / Global Styles -----------------------------------
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,500&family=Inter:wght@400;500;600&family=Spline+Sans+Mono:wght@400;500&display=swap');

      :root {
        --void: #07060f;
        --midnight: #0d0b1f;
        --panel: #15132b;
        --panel-2: #1c1838;
        --plum: #2a1f4d;
        --iris: #6d5bd0;
        --iris-soft: #9b8ce8;
        --gold: #d9b06a;
        --gold-bright: #f0cf8e;
        --starlight: #ece9ff;
        --lavender: #b7b2d8;
        --muted: #837ea8;
        --line: rgba(155,140,232,0.14);
        --fire: #e08a5c; --earth: #9bbf7e; --air: #87c4d6; --water: #7c92e0;
      }

      .astra-root {
        background:
          radial-gradient(1200px 600px at 70% -10%, rgba(109,91,208,0.18), transparent 60%),
          radial-gradient(900px 500px at 10% 110%, rgba(217,176,106,0.08), transparent 55%),
          linear-gradient(180deg, var(--midnight), var(--void));
        color: var(--starlight);
        font-family: 'Inter', system-ui, sans-serif;
        min-height: 100vh;
        position: relative;
        overflow-x: hidden;
      }
      .display { font-family: 'Cormorant Garamond', Georgia, serif; }
      .mono { font-family: 'Spline Sans Mono', ui-monospace, monospace; }
      .glyph { font-family: 'Cormorant Garamond', serif; line-height: 1; }

      .panel {
        background: linear-gradient(160deg, var(--panel), var(--midnight));
        border: 1px solid var(--line);
        border-radius: 22px;
        box-shadow: 0 24px 60px -30px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.03);
      }
      .panel-soft { background: var(--panel-2); border: 1px solid var(--line); border-radius: 16px; }
      .gold { color: var(--gold-bright); }
      .lav { color: var(--lavender); }
      .muted { color: var(--muted); }
      .hairline { border-color: var(--line); }

      .chip {
        border: 1px solid var(--line); border-radius: 999px;
        background: rgba(109,91,208,0.08); color: var(--lavender);
      }

      .btn-gold {
        background: linear-gradient(180deg, var(--gold-bright), var(--gold));
        color: #2a1c05; border: none; border-radius: 999px; font-weight: 600;
        box-shadow: 0 8px 24px -10px rgba(217,176,106,0.6);
      }
      .btn-gold:hover { filter: brightness(1.06); }
      .btn-ghost { border: 1px solid var(--line); border-radius: 999px; color: var(--starlight); background: transparent; }
      .btn-ghost:hover { background: rgba(155,140,232,0.08); }

      .field {
        background: var(--void); border: 1px solid var(--line); border-radius: 12px;
        color: var(--starlight); width: 100%;
      }
      .field:focus { outline: 2px solid var(--iris); outline-offset: 0; border-color: transparent; }
      .field::placeholder { color: var(--muted); }

      .tab-active { color: #2a1c05; background: linear-gradient(180deg, var(--gold-bright), var(--gold)); }
      .tab-idle { color: var(--lavender); }
      .tab-idle:hover { color: var(--starlight); }

      .ring-track { stroke: rgba(155,140,232,0.16); }
      .focus-ring:focus-visible { outline: 2px solid var(--gold-bright); outline-offset: 2px; border-radius: 12px; }

      /* starfield */
      .star { position: absolute; border-radius: 50%; background: #fff; opacity: .0; animation: twinkle 4s infinite ease-in-out; }
      @keyframes twinkle { 0%,100% { opacity: .15; } 50% { opacity: .9; } }
      @keyframes drift { from { transform: translateY(0); } to { transform: translateY(-40px); } }
      @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      .spin-slow { animation: spin-slow 120s linear infinite; transform-origin: center; }
      @keyframes fade-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      .fade-up { animation: fade-up .5s ease both; }

      ::-webkit-scrollbar { width: 10px; height: 10px; }
      ::-webkit-scrollbar-track { background: var(--void); }
      ::-webkit-scrollbar-thumb { background: var(--plum); border-radius: 999px; border: 2px solid var(--void); }

      @media (prefers-reduced-motion: reduce) {
        .star, .spin-slow, .fade-up { animation: none !important; }
        .flip-inner { transition: none !important; }
      }

      /* mobile ergonomics */
      html { scroll-behavior: smooth; }
      .astra-root { scroll-padding-top: 80px; }
      .field, .field option { font-size: 16px; }   /* prevents iOS focus-zoom */
      button, .field, a { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
      .tap { min-height: 44px; }                    /* comfortable touch target */
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

      /* tarot flip */
      .flip { perspective: 1000px; }
      .flip-inner { position: relative; width: 100%; height: 100%; transition: transform .7s cubic-bezier(.2,.8,.2,1); transform-style: preserve-3d; }
      .flip.is-flipped .flip-inner { transform: rotateY(180deg); }
      .flip-face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; border-radius: 18px; }
      .flip-back { transform: rotateY(180deg); }
    `}</style>
  );
}

// --- Mock Data: Zodiac -----------------------------------------
const ZODIAC = {
  aries:       { name: "Aries",       glyph: "♈", element: "Fire",  modality: "Cardinal", planet: "Mars",    range: "Mar 21 – Apr 19", traits: ["Bold", "Driven", "Spontaneous", "Competitive"], luckyNumbers: [1, 9, 19], colors: ["Scarlet", "Crimson"] },
  taurus:      { name: "Taurus",      glyph: "♉", element: "Earth", modality: "Fixed",    planet: "Venus",   range: "Apr 20 – May 20", traits: ["Grounded", "Loyal", "Sensual", "Patient"], luckyNumbers: [2, 6, 15], colors: ["Forest Green", "Rose"] },
  gemini:      { name: "Gemini",      glyph: "♊", element: "Air",   modality: "Mutable",  planet: "Mercury", range: "May 21 – Jun 20", traits: ["Curious", "Witty", "Adaptable", "Expressive"], luckyNumbers: [3, 5, 14], colors: ["Yellow", "Silver"] },
  cancer:      { name: "Cancer",      glyph: "♋", element: "Water", modality: "Cardinal", planet: "Moon",    range: "Jun 21 – Jul 22", traits: ["Nurturing", "Intuitive", "Protective", "Tender"], luckyNumbers: [2, 7, 11], colors: ["Pearl White", "Sea Blue"] },
  leo:         { name: "Leo",         glyph: "♌", element: "Fire",  modality: "Fixed",    planet: "Sun",     range: "Jul 23 – Aug 22", traits: ["Radiant", "Generous", "Proud", "Warm"], luckyNumbers: [1, 4, 19], colors: ["Gold", "Amber"] },
  virgo:       { name: "Virgo",       glyph: "♍", element: "Earth", modality: "Mutable",  planet: "Mercury", range: "Aug 23 – Sep 22", traits: ["Precise", "Analytical", "Helpful", "Diligent"], luckyNumbers: [5, 14, 23], colors: ["Sage", "Navy"] },
  libra:       { name: "Libra",       glyph: "♎", element: "Air",   modality: "Cardinal", planet: "Venus",   range: "Sep 23 – Oct 22", traits: ["Harmonious", "Charming", "Fair", "Aesthetic"], luckyNumbers: [6, 15, 24], colors: ["Blush Pink", "Sky Blue"] },
  scorpio:     { name: "Scorpio",     glyph: "♏", element: "Water", modality: "Fixed",    planet: "Pluto",   range: "Oct 23 – Nov 21", traits: ["Intense", "Magnetic", "Loyal", "Perceptive"], luckyNumbers: [8, 11, 18], colors: ["Maroon", "Black"] },
  sagittarius: { name: "Sagittarius", glyph: "♐", element: "Fire",  modality: "Mutable",  planet: "Jupiter", range: "Nov 22 – Dec 21", traits: ["Adventurous", "Honest", "Optimistic", "Free"], luckyNumbers: [3, 9, 21], colors: ["Royal Purple", "Turquoise"] },
  capricorn:   { name: "Capricorn",   glyph: "♑", element: "Earth", modality: "Cardinal", planet: "Saturn",  range: "Dec 22 – Jan 19", traits: ["Ambitious", "Disciplined", "Resilient", "Wise"], luckyNumbers: [4, 8, 22], colors: ["Charcoal", "Deep Brown"] },
  aquarius:    { name: "Aquarius",    glyph: "♒", element: "Air",   modality: "Fixed",    planet: "Uranus",  range: "Jan 20 – Feb 18", traits: ["Visionary", "Independent", "Inventive", "Humane"], luckyNumbers: [4, 7, 11], colors: ["Electric Blue", "Silver"] },
  pisces:      { name: "Pisces",      glyph: "♓", element: "Water", modality: "Mutable",  planet: "Neptune", range: "Feb 19 – Mar 20", traits: ["Dreamy", "Compassionate", "Artistic", "Empathic"], luckyNumbers: [3, 9, 12], colors: ["Seafoam", "Lavender"] },
};
const SIGN_KEYS = Object.keys(ZODIAC);

const ELEMENT_ICON = { Fire: Flame, Earth: Mountain, Air: Wind, Water: Droplets };
const ELEMENT_COLOR = { Fire: "var(--fire)", Earth: "var(--earth)", Air: "var(--air)", Water: "var(--water)" };

// Sun sign boundaries: [month(1-12), day] inclusive start
const SIGN_BOUNDS = [
  ["capricorn", 1, 1], ["aquarius", 1, 20], ["pisces", 2, 19], ["aries", 3, 21],
  ["taurus", 4, 20], ["gemini", 5, 21], ["cancer", 6, 21], ["leo", 7, 23],
  ["virgo", 8, 23], ["libra", 9, 23], ["scorpio", 10, 23], ["sagittarius", 11, 22],
  ["capricorn", 12, 22],
];
function sunSignFromDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d)) return null;
  const m = d.getMonth() + 1, day = d.getDate();
  let result = "capricorn";
  for (const [sign, bm, bd] of SIGN_BOUNDS) {
    if (m > bm || (m === bm && day >= bd)) result = sign;
  }
  return result;
}

// --- Mock "calculation" for Moon & Rising (entertainment only) -
function hashString(s) { let h = 0; for (let i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) >>> 0; } return h; }
function mockMoonSign(p) {
  if (!p?.birthDate) return null;
  const seed = hashString((p.birthDate || "") + (p.birthTime || "12:00") + ":moon");
  return SIGN_KEYS[seed % 12];
}
function mockRisingSign(p) {
  if (!p?.birthTime) return null;
  const seed = hashString((p.birthTime || "") + (p.birthLocation || "") + ":rising");
  return SIGN_KEYS[seed % 12];
}

// --- Seeded horoscope composer ---------------------------------
function mulberry(seed) { return function () { let t = (seed += 0x6d2b79f5); t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }

const FRAG = {
  open: [
    "The {planet} energy threading your chart asks for honesty today.",
    "A quiet shift is underway, {name} — {element} signs feel it first.",
    "Momentum gathers behind the scenes; trust what {planet} is rearranging.",
    "Something you set aside returns wearing a friendlier face.",
    "The sky favors clarity over speed for you right now.",
  ],
  love: [
    "In matters of the heart, name the feeling before it names you.",
    "Connection deepens when you let yourself be slightly less guarded.",
    "An old tension dissolves the moment you stop bracing for it.",
    "Affection arrives sideways — through a small, unglamorous kindness.",
    "Your {element} nature wants depth, not performance, in love today.",
  ],
  work: [
    "Career-wise, a careful plan beats a brilliant impulse this week.",
    "Someone is watching how you handle the small things — handle them well.",
    "Say the idea out loud; it's stronger spoken than rehearsed.",
    "Resist the urge to over-explain; your work argues for itself.",
    "A door you stopped knocking on is quietly unlatched.",
  ],
  energy: [
    "Protect your mornings; that's where your real power lives now.",
    "Rest is not a reward you earn — it's the engine. Refuel.",
    "Your intuition is unusually sharp; don't out-think it.",
    "Move your body before you move your mind today.",
    "The {element} in you craves change — give it a small, safe outlet.",
  ],
  close: [
    "Lucky direction: forward, but slower than your instinct insists.",
    "Keep the gold-thread of patience near; it pays out by week's end.",
    "Let curiosity, not certainty, choose your next step.",
    "A small yes today opens a larger one later.",
    "Stay soft. The universe is conspiring in your favor.",
  ],
};
const WEEK_OPEN = [
  "This week tilts toward consolidation — gather what's scattered.",
  "A theme of release runs through the next seven days for you.",
  "Expect the week to test patience and reward it in equal measure.",
  "Relationships take center stage; communication is your luckiest tool.",
];
const MONTH_OPEN = [
  "This lunar cycle invites you to rebuild a foundation, not just a roof.",
  "The month asks a single question: what are you ready to outgrow?",
  "A long arc bends toward you — reputation, recognition, or repair.",
  "Money and meaning negotiate terms; you get to set the table.",
];

function dayKey(offset = 0) { const d = new Date(); d.setDate(d.getDate() + offset); return d.toISOString().slice(0, 10); }
function periodLabelDate(offset) {
  const d = new Date(); d.setDate(d.getDate() + offset);
  return d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
}
function tmpl(str, sign, name) {
  const z = ZODIAC[sign];
  return str.replace("{planet}", z.planet).replace("{element}", z.element).replace("{name}", name || z.name);
}
function composeHoroscope(sign, period, offset, name) {
  const z = ZODIAC[sign];
  if (period === "daily") {
    const rng = mulberry(hashString(sign + dayKey(offset) + "daily"));
    const parts = [pick(rng, FRAG.open), pick(rng, FRAG.love), pick(rng, FRAG.work), pick(rng, FRAG.energy), pick(rng, FRAG.close)];
    return { body: parts.map((p) => tmpl(p, sign, name)).join(" "), mood: pick(mulberry(hashString(sign + dayKey(offset) + "mood")), ["Reflective", "Energized", "Tender", "Focused", "Playful", "Grounded"]), score: 60 + (hashString(sign + dayKey(offset)) % 40) };
  }
  if (period === "weekly") {
    const rng = mulberry(hashString(sign + "week" + new Date().getUTCDate()));
    return { body: [tmpl(pick(rng, WEEK_OPEN), sign, name), tmpl(pick(rng, FRAG.work), sign, name), tmpl(pick(rng, FRAG.love), sign, name), tmpl(pick(rng, FRAG.close), sign, name)].join(" "), mood: "Building", score: 65 + (hashString(sign + "wk") % 35) };
  }
  const rng = mulberry(hashString(sign + "month" + (new Date().getMonth())));
  return { body: [tmpl(pick(rng, MONTH_OPEN), sign, name), tmpl(pick(rng, FRAG.energy), sign, name), tmpl(pick(rng, FRAG.work), sign, name), tmpl(pick(rng, FRAG.close), sign, name)].join(" "), mood: "Expansive", score: 70 + (hashString(sign + "mo") % 30) };
}

// --- Compatibility engine --------------------------------------
const ELEMENT_FRIEND = {
  Fire: { Fire: 78, Earth: 50, Air: 90, Water: 48 },
  Earth: { Fire: 50, Earth: 80, Air: 52, Water: 88 },
  Air: { Fire: 90, Earth: 52, Air: 76, Water: 55 },
  Water: { Fire: 48, Earth: 88, Air: 55, Water: 82 },
};
function compatibility(a, b) {
  const za = ZODIAC[a], zb = ZODIAC[b];
  let score = ELEMENT_FRIEND[za.element][zb.element];
  const ai = SIGN_KEYS.indexOf(a), bi = SIGN_KEYS.indexOf(b);
  const dist = Math.min((ai - bi + 12) % 12, (bi - ai + 12) % 12);
  if (a === b) score = Math.min(95, score + 8);          // same sign
  if (dist === 6) score = Math.min(96, score + 10);       // opposites attract
  if (dist === 4 && za.element === zb.element) score = Math.min(97, score + 6); // trine
  if (za.modality === zb.modality && a !== b) score -= 6; // friction of sameness
  score = Math.max(35, Math.min(98, Math.round(score)));
  let romance, friendship;
  if (score >= 85) { romance = "A magnetic, slow-burning match — easy warmth and rare understanding."; friendship = "Effortless loyalty; you finish each other's sentences and arguments."; }
  else if (score >= 70) { romance = "Strong chemistry with room to grow — differences feel like spice, not strife."; friendship = "A dependable, generous bond that weathers distance well."; }
  else if (score >= 55) { romance = "Real attraction, but it asks for translation — learn each other's love language."; friendship = "Good company once you accept you process the world differently."; }
  else { romance = "Opposites that intrigue and exhaust in turn — workable with deliberate effort."; friendship = "Best in small, intentional doses; respect the friction."; }
  return { score, romance, friendship };
}

// --- Moon phase + transits (mock-ish) --------------------------
const PHASES = ["New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous", "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent"];
const PHASE_GLYPH = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"];
function moonPhase() {
  const ref = Date.UTC(2000, 0, 6, 18, 14); // known new moon
  const synodic = 29.53058867;
  const days = (Date.now() - ref) / 86400000;
  const age = ((days % synodic) + synodic) % synodic;
  const idx = Math.floor((age / synodic) * 8 + 0.5) % 8;
  const illum = Math.round((1 - Math.cos((age / synodic) * 2 * Math.PI)) / 2 * 100);
  return { name: PHASES[idx], glyph: PHASE_GLYPH[idx], illum, age: age.toFixed(1) };
}
const RETROGRADES = [
  { planet: "Mercury", status: "Direct", note: "Communication flows clear — sign the contract." },
  { planet: "Venus", status: "Direct", note: "Love and money move forward smoothly." },
  { planet: "Mars", status: "Retrograde", note: "Pull back on bold launches; refine instead." },
  { planet: "Saturn", status: "Retrograde", note: "Revisit commitments before renewing them." },
];

// Upcoming principal moon phases
const PRINCIPAL = [
  { name: "New Moon", glyph: "🌑", frac: 0 },
  { name: "First Quarter", glyph: "🌓", frac: 0.25 },
  { name: "Full Moon", glyph: "🌕", frac: 0.5 },
  { name: "Last Quarter", glyph: "🌗", frac: 0.75 },
];
function nextPhases(count = 4) {
  const synodic = 29.53058867;
  const ref = Date.UTC(2000, 0, 6, 18, 14);
  const age = ((((Date.now() - ref) / 86400000) % synodic) + synodic) % synodic;
  return PRINCIPAL.map((p) => {
    const target = p.frac * synodic;
    const days = (((target - age) % synodic) + synodic) % synodic;
    const date = new Date(Date.now() + days * 86400000);
    return { ...p, days: Math.round(days), date };
  }).sort((a, b) => a.days - b.days).slice(0, count);
}

// --- Tarot (Major Arcana subset) -------------------------------
const TAROT = [
  { name: "The Star", glyph: "✶", meaning: "Hope renewed. Heal quietly and trust the long arc." },
  { name: "The Moon", glyph: "☾", meaning: "Trust intuition over appearances; the path is foggy but real." },
  { name: "The Sun", glyph: "☀", meaning: "Clarity and warmth. Say yes to the joyful, obvious thing." },
  { name: "The Lovers", glyph: "❥", meaning: "A choice of the heart asks for alignment, not compromise." },
  { name: "The Magician", glyph: "✦", meaning: "You have every tool you need. Begin." },
  { name: "The High Priestess", glyph: "◐", meaning: "Listen inward. The answer is already forming in the dark." },
  { name: "The Empress", glyph: "♀", meaning: "Nurture what you've planted; abundance follows tending." },
  { name: "The Hermit", glyph: "✧", meaning: "Step back. Solitude is sharpening your real question." },
  { name: "Wheel of Fortune", glyph: "⊛", meaning: "Cycles turn in your favor. Ride the momentum lightly." },
  { name: "Strength", glyph: "∞", meaning: "Gentle persistence outlasts brute force today." },
  { name: "The Star-Crossed", glyph: "✷", meaning: "Two timelines meet. Be brave with the coincidence." },
  { name: "Temperance", glyph: "⚱", meaning: "Blend extremes. The middle road is the magic one." },
  { name: "The World", glyph: "◯", meaning: "A chapter completes. Celebrate before the next begins." },
  { name: "The Fool", glyph: "✺", meaning: "A fresh leap. Pack light and trust the ground to rise." },
  { name: "Justice", glyph: "⚖", meaning: "Balance is being restored. Choose fairness over being right." },
  { name: "The Tower", glyph: "⚡", meaning: "What's shaken loose needed to go. Rebuild on truth." },
];
function tarotOfDay(profileId) {
  const seed = hashString((profileId || "anon") + dayKey(0) + "tarot");
  return TAROT[seed % TAROT.length];
}

// --- Oracle (Ask the Stars) ------------------------------------
const ORACLE = {
  yes: ["The stars align — yes.", "Venus says go for it.", "Yes, and sooner than you think.", "The answer is a luminous yes."],
  no: ["Not now — the timing resists you.", "The sky counsels patience: not yet.", "A gentle no, for your own protection.", "Hold. This door isn't yours to open today."],
  maybe: ["The fog hasn't lifted — ask again at dusk.", "Mercury shrugs; the outcome is yours to shape.", "Possible, if you move with intention.", "The cosmos is undecided — so the choice is freely yours."],
};
function askOracle(question) {
  if (!question.trim()) return null;
  const seed = hashString(question.toLowerCase().trim() + dayKey(0) + "oracle");
  const bucket = ["yes", "no", "maybe"][seed % 3];
  return { verdict: bucket, text: ORACLE[bucket][Math.floor((seed / 3) % ORACLE[bucket].length)] };
}

// --- 7-day cosmic forecast -------------------------------------
function weeklyForecast(sign) {
  return Array.from({ length: 7 }, (_, i) => ({
    offset: i,
    label: new Date(Date.now() + i * 86400000).toLocaleDateString(undefined, { weekday: "short" }),
    score: composeHoroscope(sign, "daily", i, "").score,
  }));
}

// --- Journal storage (per profile) -----------------------------
function journalKey(pid) { return `astrarium.journal.${pid}`; }
function loadJournal(pid) {
  const raw = safeStorage.get(journalKey(pid));
  if (!raw) return [];
  try { const a = JSON.parse(raw); return Array.isArray(a) ? a : []; } catch { return []; }
}
function saveJournal(pid, entries) { safeStorage.set(journalKey(pid), JSON.stringify(entries)); }

// --- Safe storage (localStorage with in-memory fallback) -------
const memStore = {};
const safeStorage = {
  get(key) {
    try { const v = window.localStorage.getItem(key); return v != null ? v : memStore[key] ?? null; }
    catch { return memStore[key] ?? null; }
  },
  set(key, val) {
    memStore[key] = val;
    try { window.localStorage.setItem(key, val); } catch { /* sandboxed — memory only */ }
  },
};
const STORAGE_KEY = "astrarium.profiles.v1";

// --- Context ---------------------------------------------------
const AstroContext = createContext(null);
const useAstro = () => useContext(AstroContext);

function AstroProvider({ children }) {
  const seed = [
    { id: "seed-luna", name: "Luna", birthDate: "1996-07-14", birthTime: "03:20", birthLocation: "Lisbon, PT" },
    { id: "seed-orion", name: "Orion", birthDate: "1992-11-02", birthTime: "21:45", birthLocation: "Reykjavík, IS" },
  ];
  const [profiles, setProfiles] = useState(() => {
    const raw = safeStorage.get(STORAGE_KEY);
    if (raw) { try { const p = JSON.parse(raw); if (Array.isArray(p) && p.length) return p; } catch { /* ignore */ } }
    return seed;
  });
  const [activeId, setActiveId] = useState(() => {
    const raw = safeStorage.get(STORAGE_KEY);
    if (raw) { try { const p = JSON.parse(raw); if (Array.isArray(p) && p.length) return p[0].id; } catch { /* ignore */ } }
    return seed[0].id;
  });

  useEffect(() => { safeStorage.set(STORAGE_KEY, JSON.stringify(profiles)); }, [profiles]);

  const enrich = (p) => ({ ...p, sun: sunSignFromDate(p.birthDate), moon: mockMoonSign(p), rising: mockRisingSign(p) });
  const value = {
    profiles: profiles.map(enrich),
    activeProfile: enrich(profiles.find((p) => p.id === activeId) || profiles[0]),
    activeId, setActiveId,
    addProfile(p) { const id = "p-" + Date.now(); setProfiles((prev) => [...prev, { ...p, id }]); setActiveId(id); },
    removeProfile(id) {
      setProfiles((prev) => {
        const next = prev.filter((x) => x.id !== id);
        if (id === activeId && next.length) setActiveId(next[0].id);
        return next;
      });
    },
  };
  return <AstroContext.Provider value={value}>{children}</AstroContext.Provider>;
}

// --- Small UI atoms --------------------------------------------
function Starfield() {
  const stars = useMemo(() => Array.from({ length: 70 }, (_, i) => ({
    id: i, top: Math.random() * 100, left: Math.random() * 100,
    size: Math.random() * 2 + 1, delay: Math.random() * 4, dur: Math.random() * 3 + 3,
  })), []);
  return (
    <div className="pointer-events-none fixed inset-0" aria-hidden="true">
      {stars.map((s) => (
        <span key={s.id} className="star" style={{ top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s`, animationDuration: `${s.dur}s` }} />
      ))}
    </div>
  );
}

function ElementBadge({ element, withLabel = true, size = 14 }) {
  const Icon = ELEMENT_ICON[element] || Star;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 chip text-xs" style={{ color: ELEMENT_COLOR[element] }}>
      <Icon size={size} /> {withLabel && element}
    </span>
  );
}

function SignGlyph({ sign, size = 26, active }) {
  if (!sign) return null;
  return (
    <span className="glyph inline-flex items-center justify-center" style={{ fontSize: size, color: active ? "var(--gold-bright)" : "var(--iris-soft)" }}>
      {ZODIAC[sign].glyph}
    </span>
  );
}

// --- Profile Switcher ------------------------------------------
function ProfileSwitcher({ onCreate }) {
  const { profiles, activeProfile, setActiveId } = useAstro();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} className="focus-ring flex items-center gap-2.5 px-3 py-2 panel-soft">
        <span className="grid place-items-center rounded-full" style={{ width: 30, height: 30, background: "var(--plum)" }}>
          <SignGlyph sign={activeProfile?.sun} size={18} active />
        </span>
        <span className="text-left leading-tight">
          <span className="block text-sm font-medium">{activeProfile?.name}</span>
          <span className="block text-xs muted">{activeProfile?.sun ? ZODIAC[activeProfile.sun].name : "—"}</span>
        </span>
        <ChevronDown size={16} className="lav" />
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-2 w-64 p-2 panel fade-up">
          <p className="px-2 py-1 text-xs uppercase tracking-wider muted">Switch profile</p>
          <div className="max-h-64 overflow-auto">
            {profiles.map((p) => (
              <button key={p.id} onClick={() => { setActiveId(p.id); setOpen(false); }}
                className="focus-ring flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left hover:bg-white/5">
                <SignGlyph sign={p.sun} size={20} active={p.id === activeProfile.id} />
                <span className="flex-1">
                  <span className="block text-sm">{p.name}</span>
                  <span className="block text-xs muted">{p.sun ? ZODIAC[p.sun].name : "Unknown"}</span>
                </span>
                {p.id === activeProfile.id && <Check size={15} className="gold" />}
              </button>
            ))}
          </div>
          <button onClick={() => { setOpen(false); onCreate(); }} className="focus-ring mt-1 flex w-full items-center gap-2 rounded-xl px-2 py-2 text-sm gold hover:bg-white/5">
            <Plus size={16} /> New profile
          </button>
        </div>
      )}
    </div>
  );
}

// --- Create Profile Modal --------------------------------------
function CreateProfileModal({ open, onClose }) {
  const { addProfile } = useAstro();
  const [form, setForm] = useState({ name: "", birthDate: "", birthTime: "", birthLocation: "" });
  const [preview, setPreview] = useState(null);
  useEffect(() => { if (form.birthDate) setPreview(sunSignFromDate(form.birthDate)); else setPreview(null); }, [form.birthDate]);
  if (!open) return null;
  const valid = form.name.trim() && form.birthDate;
  const submit = () => { if (!valid) return; addProfile(form); setForm({ name: "", birthDate: "", birthTime: "", birthLocation: "" }); onClose(); };
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4" style={{ background: "rgba(7,6,15,0.72)", backdropFilter: "blur(4px)" }}>
      <div className="panel w-full max-w-md p-6 fade-up">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="display text-2xl" style={{ fontWeight: 600 }}>Cast a new chart</h2>
          <button onClick={onClose} className="focus-ring rounded-full p-1.5 hover:bg-white/5"><X size={18} /></button>
        </div>
        <div className="space-y-3">
          <Labeled icon={Users} label="Name">
            <input className="field px-3 py-2.5" placeholder="Who are we charting?" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Labeled>
          <div className="grid grid-cols-2 gap-3">
            <Labeled icon={Calendar} label="Birth date">
              <input type="date" className="field px-3 py-2.5" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} />
            </Labeled>
            <Labeled icon={Clock} label="Birth time">
              <input type="time" className="field px-3 py-2.5" value={form.birthTime} onChange={(e) => setForm({ ...form, birthTime: e.target.value })} />
            </Labeled>
          </div>
          <Labeled icon={MapPin} label="Birth location">
            <input className="field px-3 py-2.5" placeholder="City, Country" value={form.birthLocation} onChange={(e) => setForm({ ...form, birthLocation: e.target.value })} />
          </Labeled>
        </div>
        {preview && (
          <div className="mt-4 flex items-center gap-3 panel-soft p-3">
            <SignGlyph sign={preview} size={28} active />
            <div className="text-sm">
              <span className="block">Sun in <span className="gold">{ZODIAC[preview].name}</span></span>
              <span className="block text-xs muted">Moon &amp; Rising estimated from time + place</span>
            </div>
          </div>
        )}
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="btn-ghost px-4 py-2 text-sm">Cancel</button>
          <button onClick={submit} disabled={!valid} className="btn-gold px-5 py-2 text-sm" style={{ opacity: valid ? 1 : 0.5, cursor: valid ? "pointer" : "not-allowed" }}>Save chart</button>
        </div>
      </div>
    </div>
  );
}
function Labeled({ icon: Icon, label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-xs uppercase tracking-wider muted"><Icon size={13} /> {label}</span>
      {children}
    </label>
  );
}

// --- Zodiac Wheel (signature element) --------------------------
function ZodiacWheel({ activeSign, size = 220 }) {
  const r = size / 2;
  const inner = r - 34;
  return (
    <div style={{ width: "100%", maxWidth: size }}>
    <svg width="100%" viewBox={`0 0 ${size} ${size}`} style={{ height: "auto", display: "block" }}>
      <defs>
        <radialGradient id="wheelGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(217,176,106,0.18)" />
          <stop offset="70%" stopColor="rgba(109,91,208,0.05)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx={r} cy={r} r={r - 2} fill="url(#wheelGlow)" />
      <g className="spin-slow" style={{ transformOrigin: `${r}px ${r}px` }}>
        <circle cx={r} cy={r} r={inner} fill="none" className="ring-track" strokeWidth="1" />
        <circle cx={r} cy={r} r={inner - 16} fill="none" stroke="rgba(217,176,106,0.25)" strokeWidth="1" strokeDasharray="2 6" />
        {SIGN_KEYS.map((s, i) => {
          const ang = (i / 12) * 2 * Math.PI - Math.PI / 2;
          const x = r + Math.cos(ang) * (inner - 8);
          const y = r + Math.sin(ang) * (inner - 8);
          const active = s === activeSign;
          return (
            <text key={s} x={x} y={y} textAnchor="middle" dominantBaseline="central"
              style={{ fontFamily: "Cormorant Garamond, serif", fontSize: active ? 22 : 16, fill: active ? "var(--gold-bright)" : "var(--iris-soft)", opacity: active ? 1 : 0.55 }}>
              {ZODIAC[s].glyph}
            </text>
          );
        })}
      </g>
      {activeSign && (
        <text x={r} y={r} textAnchor="middle" dominantBaseline="central"
          style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 56, fill: "var(--gold-bright)" }}>
          {ZODIAC[activeSign].glyph}
        </text>
      )}
    </svg>
    </div>
  );
}

// --- Welcome Header --------------------------------------------
function WelcomeHeader() {
  const { activeProfile: p } = useAstro();
  const big3 = [["Sun", p.sun, Sun], ["Moon", p.moon, Moon], ["Rising", p.rising, Sparkles]];
  const hour = new Date().getHours();
  const greet = hour < 5 ? "The stars are still out" : hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return (
    <section className="panel relative overflow-hidden p-6 sm:p-8 fade-up">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="order-2 sm:order-1">
          <p className="mb-1 text-xs uppercase tracking-[0.2em] muted">{greet}</p>
          <h1 className="display leading-none" style={{ fontSize: "clamp(2.2rem, 6vw, 3.4rem)", fontWeight: 600 }}>
            {p.name}
          </h1>
          <p className="mt-2 max-w-md text-sm lav">
            {p.sun ? `The cosmos charts you as a ${ZODIAC[p.sun].name}, ruled by ${ZODIAC[p.sun].planet}.` : "Add a birth date to reveal your chart."}
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {big3.map(([label, sign, Icon]) => (
              <div key={label} className="flex items-center gap-2 panel-soft px-3 py-2">
                <Icon size={15} className="gold" />
                <span className="text-xs uppercase tracking-wider muted">{label}</span>
                <span className="flex items-center gap-1 text-sm font-medium">
                  <SignGlyph sign={sign} size={18} /> {sign ? ZODIAC[sign].name : "—"}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="order-1 shrink-0 sm:order-2" style={{ width: "min(220px, 56vw)" }}>
          <ZodiacWheel activeSign={p.sun} />
        </div>
      </div>
    </section>
  );
}

// --- Horoscope Module ------------------------------------------
function HoroscopeModule() {
  const { activeProfile: p } = useAstro();
  const [period, setPeriod] = useState("daily");
  const [offset, setOffset] = useState(0); // -1 yesterday, 0 today, 1 tomorrow
  const [copied, setCopied] = useState(false);
  const sun = p.sun;
  const forecast = useMemo(() => (sun ? weeklyForecast(sun) : []), [sun]);
  if (!sun) return null;
  const data = composeHoroscope(sun, period, offset, p.name);
  const maxScore = Math.max(...forecast.map((f) => f.score));
  const periods = [["daily", "Daily"], ["weekly", "Weekly"], ["monthly", "Monthly"]];
  const days = [[-1, "Yesterday"], [0, "Today"], [1, "Tomorrow"]];
  const copyReading = async () => {
    const text = `${ZODIAC[p.sun].name} — ${period === "daily" ? periodLabelDate(offset) : period}\n\n${data.body}\n\n— via Astrarium`;
    try { await navigator.clipboard.writeText(text); } catch { /* clipboard blocked */ }
    setCopied(true); setTimeout(() => setCopied(false), 1800);
  };
  return (
    <section id="horoscope" className="panel p-5 sm:p-6 fade-up">
      <div className="mb-4 flex items-center gap-2">
        <Compass size={18} className="gold" />
        <h2 className="display text-2xl" style={{ fontWeight: 600 }}>Horoscope</h2>
        <span className="ml-auto flex items-center gap-1.5 text-sm"><SignGlyph sign={p.sun} size={18} active /> {ZODIAC[p.sun].name}</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1 panel-soft p-1">
          {periods.map(([k, label]) => (
            <button key={k} onClick={() => setPeriod(k)} className={`focus-ring tap rounded-full px-4 py-1.5 text-sm transition ${period === k ? "tab-active" : "tab-idle"}`}>{label}</button>
          ))}
        </div>
        {period === "daily" && (
          <div className="flex gap-1 panel-soft p-1">
            {days.map(([k, label]) => (
              <button key={k} onClick={() => setOffset(k)} className={`focus-ring tap rounded-full px-3 py-1.5 text-xs transition ${offset === k ? "tab-active" : "tab-idle"}`}>{label}</button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5">
        {period === "daily" && <p className="mb-3 text-xs uppercase tracking-wider muted">{periodLabelDate(offset)}</p>}
        <p className="display leading-relaxed" style={{ fontSize: "1.32rem", color: "var(--starlight)" }}>{data.body}</p>
        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          <span className="chip px-3 py-1.5 text-xs">Mood · <span className="gold">{data.mood}</span></span>
          <span className="chip px-3 py-1.5 text-xs">Cosmic score · <span className="gold">{data.score}</span></span>
          <span className="chip px-3 py-1.5 text-xs">Lucky no. · <span className="gold">{ZODIAC[p.sun].luckyNumbers.join(" · ")}</span></span>
          <button onClick={copyReading} className="btn-ghost focus-ring ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs">
            {copied ? <><Check size={13} className="gold" /> Copied</> : <><Copy size={13} /> Share</>}
          </button>
        </div>
      </div>

      <div className="mt-5 panel-soft p-4">
        <p className="mb-3 flex items-center gap-1.5 text-xs uppercase tracking-wider muted"><TrendingUp size={13} className="gold" /> 7-day cosmic forecast</p>
        <div className="flex items-end justify-between gap-1.5" style={{ height: 76 }}>
          {forecast.map((f) => (
            <button key={f.offset} onClick={() => { setPeriod("daily"); setOffset(f.offset <= 1 ? f.offset : 0); }}
              className="focus-ring group flex flex-1 flex-col items-center justify-end gap-1.5" style={{ height: "100%" }} title={`${f.label}: ${f.score}`}>
              <span className="mono text-[10px] muted">{f.score}</span>
              <span className="w-full rounded-t-md transition-all" style={{
                height: `${(f.score / maxScore) * 100}%`,
                background: f.offset === offset && period === "daily"
                  ? "linear-gradient(180deg, var(--gold-bright), var(--gold))"
                  : "linear-gradient(180deg, var(--iris), var(--plum))",
              }} />
              <span className="text-[10px] muted">{f.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Zodiac Deep Dive ------------------------------------------
function ZodiacDeepDive() {
  const { activeProfile: p } = useAstro();
  if (!p.sun) return null;
  const z = ZODIAC[p.sun];
  return (
    <section id="signs" className="panel p-5 sm:p-6 fade-up">
      <div className="mb-4 flex items-center gap-2">
        <Orbit size={18} className="gold" />
        <h2 className="display text-2xl" style={{ fontWeight: 600 }}>Deep dive</h2>
      </div>
      <div className="flex items-center gap-4">
        <span className="glyph grid place-items-center rounded-2xl" style={{ width: 64, height: 64, background: "var(--plum)", fontSize: 38, color: "var(--gold-bright)" }}>{z.glyph}</span>
        <div>
          <h3 className="display text-2xl" style={{ fontWeight: 600 }}>{z.name}</h3>
          <p className="text-xs muted">{z.range}</p>
          <div className="mt-1.5 flex gap-2"><ElementBadge element={z.element} /><span className="chip px-2.5 py-1 text-xs">{z.modality}</span></div>
        </div>
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Ruling planet" value={z.planet} />
        <Stat label="Element" value={z.element} />
        <Stat label="Modality" value={z.modality} />
        <Stat label="Lucky numbers" value={z.luckyNumbers.join(", ")} />
        <Stat label="Lucky colors" value={z.colors.join(", ")} />
        <Stat label="Polarity" value={["Fire", "Air"].includes(z.element) ? "Yang · Active" : "Yin · Receptive"} />
      </dl>
      <div className="mt-4">
        <p className="mb-2 text-xs uppercase tracking-wider muted">Core traits</p>
        <div className="flex flex-wrap gap-2">{z.traits.map((t) => <span key={t} className="chip px-3 py-1.5 text-xs">{t}</span>)}</div>
      </div>
    </section>
  );
}
function Stat({ label, value }) {
  return (
    <div className="panel-soft p-3">
      <p className="text-xs uppercase tracking-wider muted">{label}</p>
      <p className="mt-0.5 text-sm font-medium" style={{ color: "var(--starlight)" }}>{value}</p>
    </div>
  );
}

// --- Compatibility Matrix --------------------------------------
function CompatibilityMatrix() {
  const { activeProfile: p, profiles } = useAstro();
  const [mode, setMode] = useState("sign"); // sign | profile
  const [otherSign, setOtherSign] = useState("leo");
  const [otherProfileId, setOtherProfileId] = useState(profiles.find((x) => x.id !== p.id)?.id || p.id);
  if (!p.sun) return null;

  const targetSign = mode === "sign" ? otherSign : (profiles.find((x) => x.id === otherProfileId)?.sun || p.sun);
  const targetName = mode === "sign" ? ZODIAC[otherSign].name : (profiles.find((x) => x.id === otherProfileId)?.name || "");
  const result = compatibility(p.sun, targetSign);

  return (
    <section id="match" className="panel p-5 sm:p-6 fade-up">
      <div className="mb-4 flex items-center gap-2">
        <Heart size={18} className="gold" />
        <h2 className="display text-2xl" style={{ fontWeight: 600 }}>Compatibility</h2>
      </div>

      <div className="mb-4 flex gap-1 panel-soft p-1" style={{ width: "fit-content" }}>
        {[["sign", "By sign"], ["profile", "By profile"]].map(([k, label]) => (
          <button key={k} onClick={() => setMode(k)} className={`focus-ring tap rounded-full px-4 py-1.5 text-sm ${mode === k ? "tab-active" : "tab-idle"}`}>{label}</button>
        ))}
      </div>

      {mode === "sign" ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
          {SIGN_KEYS.map((s) => (
            <button key={s} onClick={() => setOtherSign(s)} className={`focus-ring tap flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-xs transition ${otherSign === s ? "tab-active" : "panel-soft tab-idle"}`}>
              <span className="glyph" style={{ fontSize: 20 }}>{ZODIAC[s].glyph}</span>{ZODIAC[s].name}
            </button>
          ))}
        </div>
      ) : (
        <select className="field px-3 py-2.5" value={otherProfileId} onChange={(e) => setOtherProfileId(e.target.value)}>
          {profiles.map((x) => <option key={x.id} value={x.id} style={{ background: "var(--void)" }}>{x.name} — {x.sun ? ZODIAC[x.sun].name : "?"}</option>)}
        </select>
      )}

      <div className="mt-5 panel-soft p-5">
        <div className="flex items-center justify-center gap-3">
          <span className="glyph" style={{ fontSize: 30, color: "var(--gold-bright)" }}>{ZODIAC[p.sun].glyph}</span>
          <ArrowLeftRight size={18} className="muted" />
          <span className="glyph" style={{ fontSize: 30, color: "var(--iris-soft)" }}>{ZODIAC[targetSign].glyph}</span>
        </div>
        <p className="mt-2 text-center text-sm lav">{ZODIAC[p.sun].name} <span className="muted">&amp;</span> {targetName}</p>

        <div className="mx-auto mt-4 flex items-center justify-center">
          <ScoreRing score={result.score} />
        </div>

        <div className="mt-4 space-y-2.5">
          <div className="flex items-start gap-2"><Heart size={15} className="gold mt-0.5 shrink-0" /><p className="text-sm lav"><span className="gold">Romance.</span> {result.romance}</p></div>
          <div className="flex items-start gap-2"><Users size={15} className="gold mt-0.5 shrink-0" /><p className="text-sm lav"><span className="gold">Friendship.</span> {result.friendship}</p></div>
        </div>
      </div>
    </section>
  );
}
function ScoreRing({ score }) {
  const size = 120, stroke = 9, r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" className="ring-track" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--gold-bright)" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (score / 100) * c} style={{ transition: "stroke-dashoffset .6s ease" }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <span className="display gold" style={{ fontSize: 32, fontWeight: 600 }}>{score}</span>
          <span className="block text-xs muted">match</span>
        </div>
      </div>
    </div>
  );
}

// --- Transits Widget -------------------------------------------
function TransitsWidget() {
  const phase = useMemo(moonPhase, []);
  const upcoming = useMemo(() => nextPhases(4), []);
  return (
    <section id="sky" className="panel p-5 sm:p-6 fade-up">
      <div className="mb-4 flex items-center gap-2">
        <Moon size={18} className="gold" />
        <h2 className="display text-2xl" style={{ fontWeight: 600 }}>Current sky</h2>
      </div>
      <div className="panel-soft flex items-center gap-4 p-4">
        <span style={{ fontSize: 42 }} aria-hidden="true">{phase.glyph}</span>
        <div>
          <p className="text-xs uppercase tracking-wider muted">Moon phase</p>
          <p className="text-lg font-medium">{phase.name}</p>
          <p className="text-xs muted mono">{phase.illum}% illuminated · {phase.age} days old</p>
        </div>
      </div>

      <p className="mt-4 mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider muted"><CalendarDays size={13} className="gold" /> Upcoming phases</p>
      <div className="grid grid-cols-2 gap-2">
        {upcoming.map((u) => (
          <div key={u.name} className="panel-soft flex items-center gap-2.5 p-2.5">
            <span style={{ fontSize: 24 }} aria-hidden="true">{u.glyph}</span>
            <div className="leading-tight">
              <p className="text-xs font-medium">{u.name}</p>
              <p className="text-[11px] muted">{u.days === 0 ? "Today" : u.days === 1 ? "Tomorrow" : `in ${u.days} days`}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 mb-2 text-xs uppercase tracking-wider muted">Planetary status</p>
      <div className="space-y-2">
        {RETROGRADES.map((r) => {
          const retro = r.status === "Retrograde";
          return (
            <div key={r.planet} className="panel-soft flex items-center gap-3 p-3">
              <span className="grid place-items-center rounded-full" style={{ width: 32, height: 32, background: retro ? "rgba(224,138,92,0.15)" : "rgba(155,191,126,0.12)" }}>
                <Orbit size={16} style={{ color: retro ? "var(--fire)" : "var(--earth)" }} />
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium">{r.planet} <span className="mono text-xs" style={{ color: retro ? "var(--fire)" : "var(--earth)" }}>· {retro ? "℞ Retrograde" : "Direct"}</span></p>
                <p className="text-xs muted">{r.note}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// --- Tarot Card of the Day -------------------------------------
function TarotCard() {
  const { activeProfile: p } = useAstro();
  const card = useMemo(() => tarotOfDay(p.id), [p.id]);
  const [flipped, setFlipped] = useState(false);
  useEffect(() => { setFlipped(false); }, [p.id]); // reset when switching profiles
  return (
    <section id="tarot" className="panel p-5 sm:p-6 fade-up">
      <div className="mb-4 flex items-center gap-2">
        <Wand2 size={18} className="gold" />
        <h2 className="display text-2xl" style={{ fontWeight: 600 }}>Card of the day</h2>
      </div>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-stretch">
        <button onClick={() => setFlipped((f) => !f)} className={`flip focus-ring ${flipped ? "is-flipped" : ""}`}
          style={{ width: 150, height: 230, flexShrink: 0 }} aria-label="Flip tarot card">
          <div className="flip-inner">
            {/* back (shown first) */}
            <div className="flip-face grid place-items-center" style={{ background: "linear-gradient(160deg, var(--plum), var(--midnight))", border: "1px solid var(--line)" }}>
              <div className="text-center">
                <span className="glyph block" style={{ fontSize: 40, color: "var(--gold-bright)" }}>✷</span>
                <span className="mt-2 block text-[11px] uppercase tracking-[0.2em] muted">tap to reveal</span>
              </div>
            </div>
            {/* front */}
            <div className="flip-face flip-back flex flex-col items-center justify-center p-3 text-center" style={{ background: "linear-gradient(160deg, #211a3e, var(--midnight))", border: "1px solid rgba(217,176,106,0.35)" }}>
              <span className="glyph" style={{ fontSize: 52, color: "var(--gold-bright)" }}>{card.glyph}</span>
              <span className="display mt-2 text-lg" style={{ fontWeight: 600 }}>{card.name}</span>
            </div>
          </div>
        </button>
        <div className="flex-1 self-center">
          {flipped ? (
            <div className="fade-up">
              <p className="display text-xl gold" style={{ fontWeight: 600 }}>{card.name}</p>
              <p className="mt-2 text-sm lav leading-relaxed">{card.meaning}</p>
              <p className="mt-3 text-xs muted">Drawn for {p.name} · refreshes at midnight</p>
            </div>
          ) : (
            <p className="text-sm muted">A single card is drawn for {p.name} each day. Tap the card to see what the deck offers.</p>
          )}
        </div>
      </div>
    </section>
  );
}

// --- Ask the Stars (oracle) ------------------------------------
function AskTheStars() {
  const [q, setQ] = useState("");
  const [answer, setAnswer] = useState(null);
  const ask = () => setAnswer(askOracle(q));
  const verdictColor = { yes: "var(--earth)", no: "var(--fire)", maybe: "var(--air)" };
  return (
    <section id="oracle" className="panel p-5 sm:p-6 fade-up">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles size={18} className="gold" />
        <h2 className="display text-2xl" style={{ fontWeight: 600 }}>Ask the stars</h2>
      </div>
      <p className="mb-3 text-sm muted">Pose a yes/no question to the cosmos.</p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input className="field tap px-3 py-2.5" placeholder="Should I send the message?" value={q}
          onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ask()} />
        <button onClick={ask} disabled={!q.trim()} className="btn-gold focus-ring tap flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm"
          style={{ opacity: q.trim() ? 1 : 0.5, cursor: q.trim() ? "pointer" : "not-allowed" }}>
          <Send size={15} /> Ask
        </button>
      </div>
      {answer && (
        <div className="mt-4 panel-soft p-4 text-center fade-up">
          <p className="text-xs uppercase tracking-[0.25em]" style={{ color: verdictColor[answer.verdict] }}>{answer.verdict}</p>
          <p className="display mt-1.5 text-xl leading-snug">{answer.text}</p>
        </div>
      )}
    </section>
  );
}

// --- Cosmic Journal (persisted per profile) --------------------
const MOODS = [
  { e: "🌞", label: "Radiant" }, { e: "🌙", label: "Calm" }, { e: "⭐", label: "Hopeful" },
  { e: "🌧", label: "Heavy" }, { e: "🔥", label: "Driven" }, { e: "🌊", label: "Tender" },
];
function CosmicJournal() {
  const { activeProfile: p } = useAstro();
  const [entries, setEntries] = useState([]);
  const [mood, setMood] = useState(MOODS[0].e);
  const [note, setNote] = useState("");
  useEffect(() => { setEntries(loadJournal(p.id)); setNote(""); setMood(MOODS[0].e); }, [p.id]);
  const persist = (next) => { setEntries(next); saveJournal(p.id, next); };
  const add = () => {
    if (!note.trim()) return;
    const entry = { id: Date.now(), date: new Date().toISOString().slice(0, 10), mood, note: note.trim(), sign: p.sun };
    persist([entry, ...entries]);
    setNote("");
  };
  const remove = (id) => persist(entries.filter((e) => e.id !== id));
  return (
    <section id="journal" className="panel p-5 sm:p-6 fade-up">
      <div className="mb-4 flex items-center gap-2">
        <NotebookPen size={18} className="gold" />
        <h2 className="display text-2xl" style={{ fontWeight: 600 }}>Cosmic journal</h2>
        <span className="ml-auto text-xs muted">{entries.length} {entries.length === 1 ? "entry" : "entries"}</span>
      </div>

      <div className="mb-2 flex flex-wrap gap-1.5">
        {MOODS.map((m) => (
          <button key={m.e} onClick={() => setMood(m.e)} title={m.label}
            className={`focus-ring rounded-full px-2.5 py-1.5 text-sm transition ${mood === m.e ? "tab-active" : "panel-soft"}`}>
            <span style={{ fontSize: 16 }}>{m.e}</span> <span className="text-xs">{m.label}</span>
          </button>
        ))}
      </div>
      <textarea className="field px-3 py-2.5" rows={2} placeholder="What did the day hold?" value={note}
        onChange={(e) => setNote(e.target.value)} style={{ resize: "vertical" }} />
      <div className="mt-2 flex justify-end">
        <button onClick={add} disabled={!note.trim()} className="btn-gold focus-ring tap flex items-center gap-1.5 px-4 py-2 text-sm"
          style={{ opacity: note.trim() ? 1 : 0.5, cursor: note.trim() ? "pointer" : "not-allowed" }}>
          <Plus size={15} /> Log entry
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {entries.length === 0 ? (
          <p className="rounded-xl py-6 text-center text-sm muted" style={{ border: "1px dashed var(--line)" }}>
            No entries yet. Note how the stars treated {p.name} today.
          </p>
        ) : entries.map((e) => (
          <div key={e.id} className="panel-soft flex items-start gap-3 p-3 fade-up">
            <span style={{ fontSize: 22 }} aria-hidden="true">{e.mood}</span>
            <div className="flex-1">
              <p className="text-sm leading-relaxed">{e.note}</p>
              <p className="mt-1 text-xs muted">{e.date}{e.sign && ` · ${ZODIAC[e.sign].name}`}</p>
            </div>
            <button onClick={() => remove(e.id)} className="focus-ring rounded-full p-1.5 hover:bg-white/5" title="Delete entry">
              <Trash2 size={14} className="muted" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- Manage Profiles strip -------------------------------------
function ManageProfiles() {
  const { profiles, removeProfile, activeId } = useAstro();
  return (
    <section className="panel p-5 sm:p-6 fade-up">
      <div className="mb-4 flex items-center gap-2">
        <Settings size={18} className="gold" />
        <h2 className="display text-2xl" style={{ fontWeight: 600 }}>Your charts</h2>
      </div>
      <div className="space-y-2">
        {profiles.map((p) => (
          <div key={p.id} className="panel-soft flex items-center gap-3 p-3">
            <SignGlyph sign={p.sun} size={22} active={p.id === activeId} />
            <div className="flex-1">
              <p className="text-sm font-medium">{p.name} {p.id === activeId && <span className="gold text-xs">· active</span>}</p>
              <p className="text-xs muted">{p.sun ? ZODIAC[p.sun].name : "Unknown"} · born {p.birthDate || "—"} {p.birthLocation && `· ${p.birthLocation}`}</p>
            </div>
            <button onClick={() => removeProfile(p.id)} disabled={profiles.length <= 1}
              className="focus-ring rounded-full p-2 hover:bg-white/5" style={{ opacity: profiles.length <= 1 ? 0.3 : 1, cursor: profiles.length <= 1 ? "not-allowed" : "pointer" }} title="Remove chart">
              <Trash2 size={15} className="muted" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- Top Bar ---------------------------------------------------
function TopBar({ onCreate }) {
  return (
    <header className="sticky top-0 z-40 mb-6" style={{ background: "linear-gradient(180deg, rgba(7,6,15,0.92), rgba(7,6,15,0.4))", backdropFilter: "blur(10px)" }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="grid place-items-center rounded-xl" style={{ width: 38, height: 38, background: "var(--plum)" }}>
            <Sparkles size={20} className="gold" />
          </span>
          <div>
            <p className="display text-xl leading-none" style={{ fontWeight: 600, letterSpacing: "0.04em" }}>ASTRARIUM</p>
            <p className="text-[10px] uppercase tracking-[0.3em] muted">celestial dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onCreate} className="btn-gold focus-ring hidden items-center gap-1.5 px-4 py-2 text-sm sm:flex"><Plus size={16} /> New chart</button>
          <button onClick={onCreate} aria-label="New chart" className="btn-gold focus-ring grid place-items-center sm:hidden" style={{ width: 38, height: 38 }}><Plus size={18} /></button>
          <ProfileSwitcher onCreate={onCreate} />
        </div>
      </div>
    </header>
  );
}

// --- Mobile quick-nav -----------------------------------------
const NAV = [
  ["horoscope", "Horoscope"], ["tarot", "Tarot"], ["match", "Match"],
  ["oracle", "Oracle"], ["journal", "Journal"], ["sky", "Sky"], ["signs", "Signs"],
];
function QuickNav() {
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  return (
    <nav className="no-scrollbar -mx-4 mb-2 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden" aria-label="Jump to section">
      {NAV.map(([id, label]) => (
        <button key={id} onClick={() => go(id)} className="chip focus-ring shrink-0 px-3.5 py-2 text-xs">{label}</button>
      ))}
    </nav>
  );
}

// --- App Shell -------------------------------------------------
function Dashboard() {
  const [modal, setModal] = useState(false);
  return (
    <div className="astra-root">
      <GlobalStyles />
      <Starfield />
      <TopBar onCreate={() => setModal(true)} />
      <main className="relative mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <WelcomeHeader />
        <div className="mt-4">
          <QuickNav />
        </div>
        <div className="mt-2 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <HoroscopeModule />
            <TarotCard />
            <CompatibilityMatrix />
            <AskTheStars />
            <ZodiacDeepDive />
          </div>
          <div className="space-y-6">
            <TransitsWidget />
            <CosmicJournal />
            <ManageProfiles />
          </div>
        </div>
        <footer className="mt-10 text-center text-xs muted">
          For wonder, not divination · Moon &amp; Rising are playful estimates
        </footer>
      </main>
      <CreateProfileModal open={modal} onClose={() => setModal(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AstroProvider>
      <Dashboard />
    </AstroProvider>
  );
}
