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

      @keyframes shake { 0%,100% { transform: translate(0,0) rotate(0); } 20% { transform: translate(-6px,3px) rotate(-4deg); } 40% { transform: translate(6px,-3px) rotate(4deg); } 60% { transform: translate(-5px,2px) rotate(-3deg); } 80% { transform: translate(5px,-2px) rotate(3deg); } }
      .shaking { animation: shake .55s ease; }
      @keyframes orb-float { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-8px) scale(1.02); } }
      .orb-float { animation: orb-float 6s ease-in-out infinite; }
      @keyframes glow-pulse { 0%,100% { box-shadow: 0 0 0 1px rgba(224,90,90,.5), 0 0 24px -4px rgba(224,90,90,.45); } 50% { box-shadow: 0 0 0 1px rgba(224,90,90,.8), 0 0 38px 0 rgba(224,90,90,.6); } }
      .retro-glow { animation: glow-pulse 3s ease-in-out infinite; border-color: rgba(224,90,90,.5) !important; }
      @keyframes overlay-spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
      .overlay-spin { animation: overlay-spin 2.4s linear infinite; transform-origin: center; }
      @keyframes shoot { 0% { transform: translate(0,0); opacity: 0; } 8% { opacity: 1; } 100% { transform: translate(-260px,160px); opacity: 0; } }
      .shoot { animation: shoot 3.2s linear infinite; }
      @media (prefers-reduced-motion: reduce) {
        .shaking, .orb-float, .retro-glow, .overlay-spin, .shoot { animation: none !important; }
      }
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
  const m = moonData();
  return { name: m.name, glyph: m.glyph, illum: m.illum, age: m.age };
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

// --- Generic per-profile list storage (todos) ------------------
function listKey(kind, pid) { return `astrarium.${kind}.${pid}`; }
function loadList(kind, pid) {
  const raw = safeStorage.get(listKey(kind, pid));
  if (!raw) return [];
  try { const a = JSON.parse(raw); return Array.isArray(a) ? a : []; } catch { return []; }
}
function saveList(kind, pid, items) { safeStorage.set(listKey(kind, pid), JSON.stringify(items)); }

// --- Numerology ------------------------------------------------
const NUM_MEANING = {
  1: "The Leader — independent, pioneering, bold.",
  2: "The Diplomat — sensitive, cooperative, intuitive.",
  3: "The Creative — expressive, joyful, magnetic.",
  4: "The Builder — grounded, disciplined, steady.",
  5: "The Adventurer — free, curious, ever-changing.",
  6: "The Nurturer — caring, responsible, harmonious.",
  7: "The Seeker — analytical, spiritual, introspective.",
  8: "The Powerhouse — ambitious, capable, abundant.",
  9: "The Humanitarian — compassionate, wise, giving.",
  11: "Master 11 — The Visionary, an illuminated intuitive.",
  22: "Master 22 — The Master Builder of grand dreams.",
  33: "Master 33 — The Master Teacher of love and healing.",
};
const MASTERS = new Set([11, 22, 33]);
function reduceNumber(n) { while (n > 9 && !MASTERS.has(n)) n = String(n).split("").reduce((a, c) => a + +c, 0); return n; }
function digitsSum(s) { return String(s).split("").reduce((a, c) => a + (/\d/.test(c) ? +c : 0), 0); }
const LETTER_VAL = {};
"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach((ch, i) => { LETTER_VAL[ch] = (i % 9) + 1; });
function lifePath(birthDate) { if (!birthDate) return null; return reduceNumber(digitsSum(birthDate.replace(/-/g, ""))); }
function nameNumber(name) { if (!name) return null; const s = [...name.toUpperCase()].reduce((a, c) => a + (LETTER_VAL[c] || 0), 0); return s ? reduceNumber(s) : null; }
function personalYear(birthDate) {
  if (!birthDate) return null;
  const d = new Date(birthDate + "T00:00:00");
  return reduceNumber(digitsSum((d.getMonth() + 1) + "" + d.getDate()) + digitsSum("" + new Date().getFullYear()));
}

// --- Lunar calendar --------------------------------------------
function moonData(ts = Date.now()) {
  const ref = Date.UTC(2000, 0, 6, 18, 14);
  const synodic = 29.53058867;
  const days = (ts - ref) / 86400000;
  const age = ((days % synodic) + synodic) % synodic;
  const idx = Math.floor((age / synodic) * 8 + 0.5) % 8;
  const illum = Math.round((1 - Math.cos((age / synodic) * 2 * Math.PI)) / 2 * 100);
  return { idx, name: PHASES[idx], glyph: PHASE_GLYPH[idx], illum, age: age.toFixed(1) };
}
function buildMonth(view = new Date()) {
  const year = view.getFullYear(), month = view.getMonth();
  const first = new Date(year, month, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayKey = new Date().toDateString();
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d, 12, 0);
    const m = moonData(date.getTime());
    const principal = [0, 2, 4, 6].includes(m.idx);
    cells.push({ d, glyph: m.glyph, idx: m.idx, principal, isToday: date.toDateString() === todayKey, name: m.name });
  }
  return cells;
}
function moonNote(phaseName, moonSign) {
  const full = phaseName === "Full Moon";
  const waxing = phaseName.includes("Waxing") || phaseName === "First Quarter" || phaseName === "New Moon";
  const base = full ? "emotions run high — release and celebrate" : waxing ? "a window to build and set intentions" : "time to wind down, reflect, and let go";
  if (!moonSign) return base.charAt(0).toUpperCase() + base.slice(1) + ".";
  const z = ZODIAC[moonSign];
  return `With your Moon in ${z.name}, it's ${base}. Your ${z.element.toLowerCase()} feelings ${full ? "peak" : "shift"} now.`;
}

// --- Magic 8-ball ----------------------------------------------
const EIGHTBALL = [
  { t: "It is certain.", k: "yes" }, { t: "Without a doubt.", k: "yes" }, { t: "Yes — definitely.", k: "yes" },
  { t: "You may rely on it.", k: "yes" }, { t: "As I see it, yes.", k: "yes" }, { t: "Most likely.", k: "yes" },
  { t: "Outlook good.", k: "yes" }, { t: "Signs point to yes.", k: "yes" },
  { t: "Reply hazy — try again.", k: "maybe" }, { t: "Ask again later.", k: "maybe" },
  { t: "Better not tell you now.", k: "maybe" }, { t: "Cannot predict now.", k: "maybe" },
  { t: "Concentrate and ask again.", k: "maybe" },
  { t: "Don't count on it.", k: "no" }, { t: "My reply is no.", k: "no" }, { t: "My sources say no.", k: "no" },
  { t: "Outlook not so good.", k: "no" }, { t: "Very doubtful.", k: "no" },
];

// --- Aura of the day -------------------------------------------
function auraOfDay(sign, mood) {
  const seed = hashString((sign || "x") + dayKey(0) + (mood || ""));
  const h1 = seed % 360;
  const h2 = (h1 + 40 + (seed % 80)) % 360;
  const from = `hsl(${h1} 80% 62%)`, via = `hsl(${(h1 + h2) / 2} 75% 55%)`, to = `hsl(${h2} 70% 42%)`;
  const labels = ["Luminous", "Velvet", "Electric", "Oceanic", "Ember", "Twilight", "Aurora", "Mystic"];
  return { from, via, to, label: labels[seed % labels.length] };
}

// --- Planetary days (cosmic to-do) -----------------------------
const PLANET_DAY = [
  { planet: "Sun", theme: "Vitality & self", glyph: "☉", suggest: "Do one thing purely for joy or recognition." },
  { planet: "Moon", theme: "Care & rest", glyph: "☽", suggest: "Tend your home, family, or inner world." },
  { planet: "Mars", theme: "Action & drive", glyph: "♂", suggest: "Tackle the hard task or move your body." },
  { planet: "Mercury", theme: "Mind & messages", glyph: "☿", suggest: "Send the email, study, or organize." },
  { planet: "Jupiter", theme: "Growth & luck", glyph: "♃", suggest: "Expand — learn, plan, or take a good risk." },
  { planet: "Venus", theme: "Love & beauty", glyph: "♀", suggest: "Connect, create, or treat yourself well." },
  { planet: "Saturn", theme: "Structure & focus", glyph: "♄", suggest: "Finish a chore or set a boundary." },
];

// --- Synastry breakdown ----------------------------------------
function synastry(a, b) {
  const base = compatibility(a, b).score;
  const za = ZODIAC[a], zb = ZODIAC[b];
  const airy = ["Air", "Fire"].filter((e) => [za.element, zb.element].includes(e)).length;
  const ai = SIGN_KEYS.indexOf(a), bi = SIGN_KEYS.indexOf(b);
  const dist = Math.min((ai - bi + 12) % 12, (bi - ai + 12) % 12);
  const clamp = (n) => Math.max(20, Math.min(99, Math.round(n)));
  return {
    Communication: clamp(base + airy * 6 - (za.element === "Water" && zb.element === "Earth" ? 8 : 0)),
    Romance: clamp(base + (dist === 6 ? 10 : 0) - (a === b ? 4 : 0)),
    Friendship: clamp(base + (za.element === zb.element ? 8 : 0)),
    Chaos: clamp(40 + (za.modality === zb.modality ? 22 : 0) + (dist === 6 ? 18 : 0) - airy * 4),
  };
}
const SYN_COLOR = { Communication: "var(--air)", Romance: "var(--fire)", Friendship: "var(--earth)", Chaos: "var(--iris-soft)" };

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
const COVEN_KEY = "astrarium.coven.v1";

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
  const [activeId, setActiveId] = useState(() => profiles[0]?.id);
  const [pinned, setPinned] = useState(() => {
    const raw = safeStorage.get(COVEN_KEY);
    if (raw) { try { const a = JSON.parse(raw); if (Array.isArray(a)) return a; } catch { /* ignore */ } }
    return [];
  });
  const [loading, setLoading] = useState(false);

  // Persist on every change to profiles / coven
  useEffect(() => { safeStorage.set(STORAGE_KEY, JSON.stringify(profiles)); }, [profiles]);
  useEffect(() => { safeStorage.set(COVEN_KEY, JSON.stringify(pinned)); }, [pinned]);

  const enrich = (p) => p && ({ ...p, sun: sunSignFromDate(p.birthDate), moon: mockMoonSign(p), rising: mockRisingSign(p) });

  const selectProfile = (id) => {
    if (id === activeId) return;
    setLoading(true);
    setTimeout(() => { setActiveId(id); setLoading(false); }, 650); // mystical transition
  };

  const value = {
    profiles: profiles.map(enrich),
    rawProfiles: profiles,
    activeProfile: enrich(profiles.find((p) => p.id === activeId) || profiles[0]),
    activeId, setActiveId, selectProfile, loading,
    pinned,
    togglePin(id) { setPinned((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])); },
    addProfile(p) {
      const id = "p-" + Date.now();
      setProfiles((prev) => { const next = [...prev, { ...p, id }]; safeStorage.set(STORAGE_KEY, JSON.stringify(next)); return next; });
      setActiveId(id);
    },
    removeProfile(id) {
      setProfiles((prev) => {
        const next = prev.filter((x) => x.id !== id);
        safeStorage.set(STORAGE_KEY, JSON.stringify(next));
        if (id === activeId && next.length) setActiveId(next[0].id);
        return next;
      });
      setPinned((prev) => prev.filter((x) => x !== id));
      try { safeStorage.set(journalKey(id), JSON.stringify([])); } catch { /* ignore */ }
    },
  };
  return <AstroContext.Provider value={value}>{children}</AstroContext.Provider>;
}

// --- Small UI atoms --------------------------------------------
function Starfield() {
  const farRef = useRef(null);
  const nearRef = useRef(null);
  const stars = useMemo(() => {
    const make = (n, depth) => Array.from({ length: n }, (_, i) => ({
      id: depth + "-" + i, top: Math.random() * 100, left: Math.random() * 100,
      size: Math.random() * (depth === "near" ? 2.2 : 1.4) + (depth === "near" ? 1 : 0.6),
      delay: Math.random() * 4, dur: Math.random() * 3 + 3,
    }));
    return { far: make(50, "far"), near: make(26, "near") };
  }, []);
  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5);
        const y = (e.clientY / window.innerHeight - 0.5);
        if (farRef.current) farRef.current.style.transform = `translate(${x * 12}px, ${y * 12}px)`;
        if (nearRef.current) nearRef.current.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);
  const layer = (ref, arr) => (
    <div ref={ref} className="absolute inset-0" style={{ transition: "transform .25s ease-out" }}>
      {arr.map((s) => (
        <span key={s.id} className="star" style={{ top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s`, animationDuration: `${s.dur}s` }} />
      ))}
    </div>
  );
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {layer(farRef, stars.far)}
      {layer(nearRef, stars.near)}
      <span className="shoot absolute" style={{ top: "12%", right: "8%", width: 2, height: 2, borderRadius: 9, background: "#fff", boxShadow: "0 0 6px 1px #fff, 60px -36px 0 -1px rgba(255,255,255,0.25)" }} />
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
  const { profiles, activeProfile, selectProfile } = useAstro();
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
              <button key={p.id} onClick={() => { selectProfile(p.id); setOpen(false); }}
                className="focus-ring tap flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left hover:bg-white/5">
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

        <div className="mt-5">
          <p className="mb-3 text-xs uppercase tracking-wider muted">Synastry breakdown</p>
          <div className="space-y-2.5">
            {Object.entries(synastry(p.sun, targetSign)).map(([cat, val]) => (
              <div key={cat}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="lav">{cat}</span><span className="mono" style={{ color: SYN_COLOR[cat] }}>{val}</span>
                </div>
                <div className="overflow-hidden rounded-full" style={{ height: 7, background: "rgba(155,140,232,0.14)" }}>
                  <div style={{ width: `${val}%`, height: "100%", background: SYN_COLOR[cat], transition: "width .6s ease", borderRadius: 999 }} />
                </div>
              </div>
            ))}
          </div>
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
  const { activeProfile: p } = useAstro();
  const phase = useMemo(moonPhase, []);
  const upcoming = useMemo(() => nextPhases(4), []);
  return (
    <section id="sky" className="panel p-5 sm:p-6 fade-up">
      <div className="mb-4 flex items-center gap-2">
        <Moon size={18} className="gold" />
        <h2 className="display text-2xl" style={{ fontWeight: 600 }}>Current sky</h2>
      </div>
      <div className="panel-soft p-4">
        <div className="flex items-center gap-4">
          <span style={{ fontSize: 42 }} aria-hidden="true">{phase.glyph}</span>
          <div>
            <p className="text-xs uppercase tracking-wider muted">Moon phase</p>
            <p className="text-lg font-medium">{phase.name}</p>
            <p className="text-xs muted mono">{phase.illum}% illuminated · {phase.age} days old</p>
          </div>
        </div>
        <p className="mt-3 border-t pt-3 text-xs lav hairline">{moonNote(phase.name, p.moon)}</p>
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

// --- Mystical loading overlay ---------------------------------
function LoadingOverlay() {
  const { loading } = useAstro();
  if (!loading) return null;
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center" style={{ background: "rgba(7,6,15,0.78)", backdropFilter: "blur(3px)" }}>
      <div className="text-center">
        <svg width="120" height="120" viewBox="0 0 120 120" className="overlay-spin mx-auto">
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(155,140,232,0.2)" strokeWidth="1" />
          <circle cx="60" cy="60" r="40" fill="none" stroke="rgba(217,176,106,0.4)" strokeWidth="1" strokeDasharray="3 7" />
          {SIGN_KEYS.map((s, i) => {
            const a = (i / 12) * 2 * Math.PI - Math.PI / 2;
            return <text key={s} x={60 + Math.cos(a) * 46} y={60 + Math.sin(a) * 46} textAnchor="middle" dominantBaseline="central"
              style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 13, fill: "var(--iris-soft)" }}>{ZODIAC[s].glyph}</text>;
          })}
        </svg>
        <p className="display mt-3 text-lg gold">Aligning the stars…</p>
      </div>
    </div>
  );
}

// --- Retrograde Radar (alert banner) --------------------------
const RETRO_TIPS = {
  Mercury: "Back up files, reread before you send, and hold off on signing.",
  Venus: "Don't impulsively rekindle old flames; revisit budgets instead.",
  Mars: "Channel friction into refining old plans, not launching new fights.",
};
function RetrogradeRadar() {
  const { activeProfile: p } = useAstro();
  const active = RETROGRADES.filter((r) => r.status === "Retrograde" && RETRO_TIPS[r.planet]);
  if (active.length === 0) return null;
  return (
    <div className="panel retro-glow mb-4 p-4 fade-up">
      <div className="flex items-start gap-3">
        <span className="grid place-items-center rounded-full shrink-0" style={{ width: 36, height: 36, background: "rgba(224,90,90,0.18)" }}>
          <Orbit size={18} style={{ color: "#e87d7d" }} />
        </span>
        <div>
          <p className="text-sm font-semibold" style={{ color: "#f0a3a3" }}>
            Retrograde Radar · {active.map((a) => a.planet).join(" & ")} {active.length > 1 ? "are" : "is"} retrograde
          </p>
          <ul className="mt-1.5 space-y-1">
            {active.map((a) => (
              <li key={a.planet} className="text-xs lav"><span className="gold">{a.planet}.</span> {RETRO_TIPS[a.planet]}</li>
            ))}
          </ul>
          {p.sun && <p className="mt-2 text-xs muted">Tip for {ZODIAC[p.sun].name}: lean on your {ZODIAC[p.sun].element.toLowerCase()} steadiness and avoid rushing decisions.</p>}
        </div>
      </div>
    </div>
  );
}

// --- Birth Chart Visualizer (Big 3 concentric rings) ----------
function BirthChartRings() {
  const { activeProfile: p } = useAstro();
  const size = 260, c = size / 2;
  const rings = [
    { label: "Sun", sign: p.sun, r: 108, Icon: Sun },
    { label: "Moon", sign: p.moon, r: 80, Icon: Moon },
    { label: "Rising", sign: p.rising, r: 52, Icon: Sparkles },
  ];
  return (
    <section id="chart" className="panel p-5 sm:p-6 fade-up">
      <div className="mb-4 flex items-center gap-2">
        <Compass size={18} className="gold" />
        <h2 className="display text-2xl" style={{ fontWeight: 600 }}>Birth chart</h2>
      </div>
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
        <div style={{ width: "min(260px, 70vw)" }}>
          <svg width="100%" viewBox={`0 0 ${size} ${size}`} style={{ height: "auto", display: "block" }}>
            {rings.map((ring) => {
              if (!ring.sign) return null;
              const z = ZODIAC[ring.sign];
              const idx = SIGN_KEYS.indexOf(ring.sign);
              const ang = (idx / 12) * 2 * Math.PI - Math.PI / 2;
              const gx = c + Math.cos(ang) * ring.r, gy = c + Math.sin(ang) * ring.r;
              const col = ELEMENT_COLOR[z.element];
              return (
                <g key={ring.label}>
                  <circle cx={c} cy={c} r={ring.r} fill="none" stroke={col} strokeOpacity="0.45" strokeWidth="1.5" />
                  <circle cx={gx} cy={gy} r="16" fill="var(--midnight)" stroke={col} strokeWidth="1.5" />
                  <text x={gx} y={gy} textAnchor="middle" dominantBaseline="central" style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 18, fill: col }}>{z.glyph}</text>
                </g>
              );
            })}
            <circle cx={c} cy={c} r="6" fill="var(--gold-bright)" />
          </svg>
        </div>
        <div className="w-full space-y-2 sm:w-auto sm:flex-1">
          {rings.map((ring) => (
            <div key={ring.label} className="panel-soft flex items-center gap-3 p-3">
              <ring.Icon size={16} className="gold shrink-0" />
              <span className="text-xs uppercase tracking-wider muted" style={{ width: 52 }}>{ring.label}</span>
              {ring.sign ? (
                <>
                  <SignGlyph sign={ring.sign} size={20} />
                  <span className="text-sm font-medium">{ZODIAC[ring.sign].name}</span>
                  <span className="ml-auto"><ElementBadge element={ZODIAC[ring.sign].element} withLabel={false} /></span>
                </>
              ) : <span className="text-sm muted">Add birth time</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Numerology ------------------------------------------------
function NumerologyModule() {
  const { activeProfile: p } = useAstro();
  const lp = lifePath(p.birthDate);
  const exp = nameNumber(p.name);
  const py = personalYear(p.birthDate);
  const items = [
    { label: "Life path", n: lp, sub: "Your core journey, from birth date" },
    { label: "Expression", n: exp, sub: "Your nature, from your name" },
    { label: "Personal year", n: py, sub: `Your ${new Date().getFullYear()} theme` },
  ];
  return (
    <section id="numerology" className="panel p-5 sm:p-6 fade-up">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles size={18} className="gold" />
        <h2 className="display text-2xl" style={{ fontWeight: 600 }}>Numerology</h2>
      </div>
      <div className="space-y-2.5">
        {items.map((it) => (
          <div key={it.label} className="panel-soft flex items-center gap-4 p-3.5">
            <span className="display grid place-items-center rounded-2xl shrink-0" style={{ width: 56, height: 56, background: "var(--plum)", fontSize: 28, fontWeight: 600, color: "var(--gold-bright)" }}>
              {it.n ?? "—"}
            </span>
            <div>
              <p className="text-xs uppercase tracking-wider muted">{it.label} · {it.sub}</p>
              <p className="text-sm" style={{ color: "var(--starlight)" }}>{it.n ? NUM_MEANING[it.n] : "Add birth details to reveal."}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- Aura of the Day (dynamic gradient orb) -------------------
function AuraOrb() {
  const { activeProfile: p } = useAstro();
  const mood = p.sun ? composeHoroscope(p.sun, "daily", 0, p.name).mood : "";
  const aura = useMemo(() => auraOfDay(p.sun, mood), [p.sun, mood]);
  const [saved, setSaved] = useState(false);
  const save = () => {
    try {
      const cv = document.createElement("canvas"); cv.width = 512; cv.height = 512;
      const ctx = cv.getContext("2d");
      ctx.fillStyle = "#0a0a14"; ctx.fillRect(0, 0, 512, 512);
      const g = ctx.createRadialGradient(200, 180, 30, 256, 256, 280);
      g.addColorStop(0, aura.from); g.addColorStop(0.55, aura.via); g.addColorStop(1, aura.to);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(256, 256, 200, 0, Math.PI * 2); ctx.fill();
      const a = document.createElement("a");
      a.href = cv.toDataURL("image/png"); a.download = `aura-${p.name}-${dayKey(0)}.png`; a.click();
    } catch { /* download blocked in sandbox */ }
    setSaved(true); setTimeout(() => setSaved(false), 1800);
  };
  return (
    <section className="panel p-5 sm:p-6 fade-up">
      <div className="mb-4 flex items-center gap-2">
        <Sun size={18} className="gold" />
        <h2 className="display text-2xl" style={{ fontWeight: 600 }}>Aura of the day</h2>
      </div>
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="orb-float grid place-items-center rounded-full shrink-0" style={{
          width: 130, height: 130,
          background: `radial-gradient(circle at 32% 30%, ${aura.from}, ${aura.via} 55%, ${aura.to})`,
          boxShadow: `0 0 50px -6px ${aura.via}, inset 0 0 30px -8px rgba(255,255,255,0.4)`,
        }} />
        <div className="flex-1 text-center sm:text-left">
          <p className="display text-2xl" style={{ fontWeight: 600 }}>{aura.label}</p>
          <p className="mt-1 text-sm lav">Your energy reads <span className="gold">{mood || "—"}</span> today — a one-of-a-kind hue cast from your sign and the date.</p>
          <button onClick={save} className="btn-ghost focus-ring mt-3 inline-flex items-center gap-1.5 px-4 py-2 text-sm">
            {saved ? <><Check size={14} className="gold" /> Saved</> : <><Copy size={14} /> Save orb</>}
          </button>
        </div>
      </div>
    </section>
  );
}

// --- Cosmic To-Do (planetary days) ----------------------------
function CosmicTodo() {
  const { activeProfile: p } = useAstro();
  const ruler = PLANET_DAY[new Date().getDay()];
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  useEffect(() => { setItems(loadList("todos", p.id)); setText(""); }, [p.id]);
  const persist = (next) => { setItems(next); saveList("todos", p.id, next); };
  const add = (t) => { const v = (t || text).trim(); if (!v) return; persist([{ id: Date.now(), text: v, done: false }, ...items]); setText(""); };
  const toggle = (id) => persist(items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  const remove = (id) => persist(items.filter((i) => i.id !== id));
  return (
    <section id="todo" className="panel p-5 sm:p-6 fade-up">
      <div className="mb-4 flex items-center gap-2">
        <Check size={18} className="gold" />
        <h2 className="display text-2xl" style={{ fontWeight: 600 }}>Cosmic to-do</h2>
      </div>
      <div className="panel-soft mb-3 flex items-center gap-3 p-3">
        <span className="glyph grid place-items-center rounded-full shrink-0" style={{ width: 38, height: 38, background: "var(--plum)", fontSize: 20, color: "var(--gold-bright)" }}>{ruler.glyph}</span>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wider muted">{new Date().toLocaleDateString(undefined, { weekday: "long" })} · ruled by {ruler.planet}</p>
          <p className="text-sm">{ruler.suggest}</p>
        </div>
        <button onClick={() => add(ruler.suggest)} className="btn-ghost focus-ring shrink-0 rounded-full p-2" title="Add as task"><Plus size={16} /></button>
      </div>
      <div className="flex gap-2">
        <input className="field tap px-3 py-2.5" placeholder="Add an aligned task…" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} />
        <button onClick={() => add()} disabled={!text.trim()} className="btn-gold focus-ring tap px-4" style={{ opacity: text.trim() ? 1 : 0.5 }}><Plus size={16} /></button>
      </div>
      <div className="mt-3 space-y-2">
        {items.length === 0 ? (
          <p className="text-xs muted">No tasks yet — try the {ruler.planet}-day suggestion above.</p>
        ) : items.map((i) => (
          <div key={i.id} className="panel-soft flex items-center gap-3 p-2.5">
            <button onClick={() => toggle(i.id)} className="focus-ring grid place-items-center rounded-md shrink-0" style={{ width: 22, height: 22, border: "1px solid var(--line)", background: i.done ? "var(--gold)" : "transparent" }}>
              {i.done && <Check size={14} style={{ color: "#2a1c05" }} />}
            </button>
            <span className={`flex-1 text-sm ${i.done ? "muted" : ""}`} style={{ textDecoration: i.done ? "line-through" : "none" }}>{i.text}</span>
            <button onClick={() => remove(i.id)} className="focus-ring rounded-full p-1.5 hover:bg-white/5"><Trash2 size={13} className="muted" /></button>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- Lucky 8-ball ---------------------------------------------
function EightBall() {
  const [answer, setAnswer] = useState(null);
  const [shaking, setShaking] = useState(false);
  const kColor = { yes: "var(--earth)", no: "var(--fire)", maybe: "var(--air)" };
  const ask = () => {
    if (shaking) return;
    setShaking(true); setAnswer(null);
    setTimeout(() => { setAnswer(EIGHTBALL[Math.floor(Math.random() * EIGHTBALL.length)]); setShaking(false); }, 600);
  };
  return (
    <section id="eightball" className="panel p-5 sm:p-6 fade-up">
      <div className="mb-4 flex items-center gap-2">
        <Star size={18} className="gold" />
        <h2 className="display text-2xl" style={{ fontWeight: 600 }}>Lucky 8-ball</h2>
      </div>
      <div className="flex flex-col items-center">
        <button onClick={ask} aria-label="Shake the 8-ball" className={`focus-ring grid place-items-center rounded-full ${shaking ? "shaking" : ""}`}
          style={{ width: 160, height: 160, background: "radial-gradient(circle at 34% 30%, #3a3358, #0c0b1a 72%)", boxShadow: "inset 0 0 30px -6px rgba(255,255,255,0.15), 0 16px 40px -16px #000" }}>
          <span className="grid place-items-center rounded-full" style={{ width: 92, height: 92, background: "radial-gradient(circle at 40% 35%, #241d44, #14122b)", border: "1px solid var(--line)" }}>
            {answer ? (
              <span className="px-2 text-center fade-up" style={{ fontSize: 11, lineHeight: 1.25, color: kColor[answer.k] }}>{answer.t}</span>
            ) : (
              <span className="display" style={{ fontSize: 40, color: "var(--gold-bright)" }}>8</span>
            )}
          </span>
        </button>
        <p className="mt-4 text-sm muted">{shaking ? "Swirling the cosmos…" : answer ? "Tap to ask again" : "Hold a question in mind, then tap the ball"}</p>
      </div>
    </section>
  );
}

// --- Tarot 3-card reading -------------------------------------
const SPREAD = ["Past", "Present", "Future"];
function TarotReading() {
  const [cards, setCards] = useState(null);
  const [flipped, setFlipped] = useState([false, false, false]);
  const draw = () => {
    const deck = [...TAROT].sort(() => Math.random() - 0.5).slice(0, 3);
    setCards(deck); setFlipped([false, false, false]);
  };
  const flip = (i) => setFlipped((f) => f.map((v, idx) => (idx === i ? true : v)));
  return (
    <section id="reading" className="panel p-5 sm:p-6 fade-up">
      <div className="mb-4 flex items-center gap-2">
        <Wand2 size={18} className="gold" />
        <h2 className="display text-2xl" style={{ fontWeight: 600 }}>Tarot reading</h2>
        <button onClick={draw} className="btn-ghost focus-ring ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs">
          {cards ? "Shuffle again" : "Draw spread"}
        </button>
      </div>
      {!cards ? (
        <p className="text-sm muted">Draw a three-card spread — Past, Present, Future. Tap each card to turn it.</p>
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {cards.map((card, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="mb-2 text-xs uppercase tracking-wider muted">{SPREAD[i]}</span>
              <button onClick={() => flip(i)} className={`flip focus-ring w-full ${flipped[i] ? "is-flipped" : ""}`} style={{ height: 150, maxWidth: 110 }} aria-label={`Reveal ${SPREAD[i]} card`}>
                <div className="flip-inner">
                  <div className="flip-face grid place-items-center" style={{ background: "linear-gradient(160deg, var(--plum), var(--midnight))", border: "1px solid var(--line)" }}>
                    <span className="glyph" style={{ fontSize: 26, color: "var(--gold-bright)" }}>✷</span>
                  </div>
                  <div className="flip-face flip-back grid place-items-center p-1.5 text-center" style={{ background: "linear-gradient(160deg, #211a3e, var(--midnight))", border: "1px solid rgba(217,176,106,0.35)" }}>
                    <span className="glyph" style={{ fontSize: 30, color: "var(--gold-bright)" }}>{card.glyph}</span>
                  </div>
                </div>
              </button>
              {flipped[i] && (
                <div className="mt-2 text-center fade-up">
                  <p className="display text-sm gold" style={{ fontWeight: 600 }}>{card.name}</p>
                  <p className="mt-0.5 text-[11px] muted leading-snug">{card.meaning}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// --- Lunar Calendar -------------------------------------------
function LunarCalendar() {
  const [view, setView] = useState(() => new Date());
  const cells = useMemo(() => buildMonth(view), [view]);
  const move = (delta) => { const d = new Date(view); d.setMonth(d.getMonth() + delta); setView(d); };
  const monthName = view.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  return (
    <section id="lunar" className="panel p-5 sm:p-6 fade-up">
      <div className="mb-4 flex items-center gap-2">
        <CalendarDays size={18} className="gold" />
        <h2 className="display text-2xl" style={{ fontWeight: 600 }}>Lunar calendar</h2>
        <div className="ml-auto flex items-center gap-1">
          <button onClick={() => move(-1)} className="btn-ghost focus-ring tap rounded-full px-3 py-1.5 text-sm" aria-label="Previous month">‹</button>
          <button onClick={() => move(1)} className="btn-ghost focus-ring tap rounded-full px-3 py-1.5 text-sm" aria-label="Next month">›</button>
        </div>
      </div>
      <p className="mb-3 text-sm lav">{monthName}</p>
      <div className="grid grid-cols-7 gap-1 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <span key={i} className="text-[10px] uppercase muted">{d}</span>)}
        {cells.map((cell, i) => (
          cell ? (
            <div key={i} className="flex flex-col items-center justify-center rounded-lg py-1.5" title={`${cell.d}: ${cell.name}`}
              style={{ background: cell.isToday ? "var(--plum)" : "transparent", border: cell.principal ? "1px solid rgba(217,176,106,0.4)" : "1px solid transparent" }}>
              <span style={{ fontSize: 16 }} aria-hidden="true">{cell.glyph}</span>
              <span className={`text-[10px] ${cell.isToday ? "gold" : "muted"}`}>{cell.d}</span>
            </div>
          ) : <span key={i} />
        ))}
      </div>
      <p className="mt-3 text-[11px] muted">Gold outline marks New, First-Quarter, Full &amp; Last-Quarter days.</p>
    </section>
  );
}

// --- Coven / Inner Circle -------------------------------------
function CovenMode() {
  const { profiles, pinned, togglePin, activeProfile: me } = useAstro();
  const circle = profiles.filter((p) => pinned.includes(p.id));
  const dynamics = circle.filter((p) => p.id !== me.id && p.sun && me.sun).map((p) => {
    const score = compatibility(me.sun, p.sun).score;
    const todayScore = composeHoroscope(p.sun, "daily", 0, p.name).score;
    const status = score >= 72 ? "Thriving" : score >= 55 ? "Steady" : "Clashing";
    return { p, score, todayScore, status };
  });
  const avg = dynamics.length ? Math.round(dynamics.reduce((a, d) => a + d.score, 0) / dynamics.length) : null;
  const statusColor = { Thriving: "var(--earth)", Steady: "var(--air)", Clashing: "var(--fire)" };
  return (
    <section id="coven" className="panel p-5 sm:p-6 fade-up">
      <div className="mb-4 flex items-center gap-2">
        <Users size={18} className="gold" />
        <h2 className="display text-2xl" style={{ fontWeight: 600 }}>Inner circle</h2>
      </div>
      {avg != null && (
        <div className="panel-soft mb-3 flex items-center gap-3 p-3">
          <Heart size={16} className="gold" />
          <p className="text-sm">Group harmony with your circle: <span className="gold">{avg}</span>
            <span className="muted"> · {avg >= 70 ? "the stars are smiling on you all" : avg >= 55 ? "a balanced, workable mix" : "spicy dynamics today"}</span></p>
        </div>
      )}
      <p className="mb-2 text-xs uppercase tracking-wider muted">Pin people to your circle</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {profiles.map((p) => {
          const on = pinned.includes(p.id);
          return (
            <button key={p.id} onClick={() => togglePin(p.id)} className={`focus-ring flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition ${on ? "tab-active" : "chip"}`}>
              <Star size={12} style={{ fill: on ? "#2a1c05" : "none" }} /> {p.name}
            </button>
          );
        })}
      </div>
      {circle.length === 0 ? (
        <p className="text-sm muted">Pin friends or partners above to see how your signs play together today.</p>
      ) : (
        <div className="space-y-2">
          {circle.map((p) => {
            const dyn = dynamics.find((d) => d.p.id === p.id);
            const isMe = p.id === me.id;
            return (
              <div key={p.id} className="panel-soft flex items-center gap-3 p-3">
                <SignGlyph sign={p.sun} size={22} active={isMe} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{p.name} {isMe && <span className="gold text-xs">· you</span>}</p>
                  <p className="text-xs muted">{p.sun ? `${ZODIAC[p.sun].name} · today's energy ${composeHoroscope(p.sun, "daily", 0, p.name).score}` : "Add birth date"}</p>
                </div>
                {dyn && (
                  <span className="rounded-full px-2.5 py-1 text-xs" style={{ color: statusColor[dyn.status], border: `1px solid ${statusColor[dyn.status]}40` }}>
                    {dyn.status} · {dyn.score}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

// --- Mobile quick-nav -----------------------------------------
const NAV = [
  ["horoscope", "Horoscope"], ["chart", "Chart"], ["numerology", "Numerology"],
  ["tarot", "Card"], ["reading", "Reading"], ["match", "Match"], ["coven", "Circle"],
  ["oracle", "Oracle"], ["eightball", "8-Ball"], ["todo", "To-do"],
  ["journal", "Journal"], ["lunar", "Lunar"], ["sky", "Sky"], ["signs", "Signs"],
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
      <LoadingOverlay />
      <TopBar onCreate={() => setModal(true)} />
      <main className="relative mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <WelcomeHeader />
        <div className="mt-4"><QuickNav /></div>
        <RetrogradeRadar />
        <div className="mt-2 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <HoroscopeModule />
            <BirthChartRings />
            <CompatibilityMatrix />
            <TarotReading />
            <CovenMode />
            <ZodiacDeepDive />
          </div>
          <div className="space-y-6">
            <AuraOrb />
            <TransitsWidget />
            <NumerologyModule />
            <TarotCard />
            <EightBall />
            <AskTheStars />
            <CosmicTodo />
            <LunarCalendar />
            <CosmicJournal />
            <ManageProfiles />
          </div>
        </div>
        <footer className="mt-10 text-center text-xs muted">
          For wonder, not divination · Moon, Rising &amp; numerology are playful estimates
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
