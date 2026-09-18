// ============================================================
// js/data.js — Portfolio Data Layer (Firebase Firestore)
// ============================================================
// HOW IT WORKS:
//   1. DEFAULT_DATA holds all placeholder/initial content.
//   2. On page load, data is fetched from Firebase Firestore.
//   3. If Firestore has no data yet, DEFAULT_DATA is used as
//      the first-time seed and written to Firestore.
//   4. The admin panel saves back to Firestore so ALL devices
//      and visitors see the updated data instantly.
//
// OFFLINE FALLBACK:
//   localStorage is used as a local cache so the site still
//   works if Firestore is momentarily unreachable.
// ============================================================

const DEFAULT_DATA = {
  meta: {
    password: "harshraj@admin",
    siteTitle: "Harshraj Dodiya — UI/UX Designer",
    siteDescription: "UI/UX Designer crafting purposeful digital experiences.",
  },

  home: {
    greeting: "Hello, I'm",
    name: "Harshraj Dodiya",
    roles: [
      "UI/UX Designer",
      "Product Designer",
      "Visual Designer",
      "Digital Creator"
    ],
    tagline: "Crafting digital experiences\nthat feel inevitable.",
    availableForWork: true,
    availableText: "Available for freelance",
    scrollText: "Scroll to explore"
  },

  about: {
    headline: "Design is not just what it looks like.\nDesign is how it works.",
    bio: "I'm Harshraj, a UI/UX Designer passionate about creating clean, purposeful digital experiences. I believe great design lives at the intersection of empathy and precision — where understanding people meets the obsession over every pixel.\n\nCurrently exploring product design, building design systems, and turning complex problems into intuitive interfaces.",
    traits: ["User-Centered", "Detail Obsessed", "Systems Thinker", "Prototype-First"],
    photo: "ASSETS/harshraj.jpeg"
  },

  experience: [
    {
      id: "exp1",
      company: "Company Name",
      role: "Senior UI/UX Designer",
      type: "Full-time",
      duration: "Jan 2024 — Present",
      location: "Remote",
      description: "Led end-to-end design for mobile and web products. Built and maintained a comprehensive design system used across 3 products. Conducted user research, usability testing, and iterative design sprints.",
      tags: ["Figma", "Design System", "Mobile", "Web"]
    },
    {
      id: "exp2",
      company: "Previous Company",
      role: "UI Designer",
      type: "Full-time",
      duration: "Jun 2022 — Dec 2023",
      location: "On-site",
      description: "Designed user interfaces for SaaS products. Collaborated closely with developers and product managers to ship high-quality features on time.",
      tags: ["Figma", "Adobe XD", "Prototyping"]
    },
    {
      id: "exp3",
      company: "Freelance",
      role: "UI/UX Consultant",
      type: "Freelance",
      duration: "2021 — 2022",
      location: "Remote",
      description: "Worked with startups and small businesses to improve their digital products through UX audits, redesigns, and strategic design consulting.",
      tags: ["UX Audit", "Redesign", "Consulting"]
    }
  ],

  education: [
    {
      id: "edu1",
      institution: "University / Institute Name",
      degree: "Bachelor of Design — UI/UX",
      year: "2019 — 2023",
      location: "City, India",
      description: "Focused on human-computer interaction, visual design principles, and user research methodologies. Graduated with distinction."
    }
  ],

  certifications: [
    {
      id: "cert1",
      title: "Google UX Design Certificate",
      issuer: "Google / Coursera",
      date: "2023",
      credentialUrl: "#",
      image: ""
    },
    {
      id: "cert2",
      title: "UI / UX Design Specialization",
      issuer: "California Institute of the Arts",
      date: "2022",
      credentialUrl: "#",
      image: ""
    },
    {
      id: "cert3",
      title: "Figma UI UX Design Essentials",
      issuer: "Udemy",
      date: "2022",
      credentialUrl: "#",
      image: ""
    }
  ],

  skills: [
    {
      category: "Design Tools",
      items: ["Figma", "Adobe XD", "Photoshop", "Illustrator", "Framer", "Webflow"]
    },
    {
      category: "Research & Strategy",
      items: ["User Interviews", "Usability Testing", "Heuristic Evaluation", "A/B Testing", "Competitive Analysis", "Affinity Mapping"]
    },
    {
      category: "Design Craft",
      items: ["Wireframing", "Prototyping", "Design Systems", "User Flows", "Information Architecture", "Motion Design", "Accessibility"]
    },
    {
      category: "Development Basics",
      items: ["HTML", "CSS", "JavaScript", "Responsive Design"]
    }
  ],

  projects: [
    {
      id: "proj1",
      title: "Project Alpha",
      description: "A comprehensive redesign of a fintech mobile app, improving task completion rate by 40% through simplified navigation and clearer information hierarchy.",
      tags: ["Mobile App", "Fintech", "Research", "Figma"],
      link: "#",
      image: ""
    },
    {
      id: "proj2",
      title: "Design System — Orbit",
      description: "Built a scalable design system from scratch for a B2B SaaS platform. 200+ components, full documentation, and Figma variables.",
      tags: ["Design System", "SaaS", "Figma", "Documentation"],
      link: "#",
      image: ""
    },
    {
      id: "proj3",
      title: "E-Commerce UX Overhaul",
      description: "End-to-end UX redesign for a D2C fashion brand, reducing cart abandonment by 28% and increasing average session duration significantly.",
      tags: ["E-Commerce", "UX Research", "Web", "Prototyping"],
      link: "#",
      image: ""
    },
    {
      id: "proj4",
      title: "Healthcare Patient App",
      description: "Designed a patient-facing healthcare app focused on accessibility and clarity. Simplified appointment booking and medical record access.",
      tags: ["Healthcare", "Mobile", "Accessibility", "iOS"],
      link: "#",
      image: ""
    }
  ],

  resume: {
    headline: "Interested in the full story?",
    subtext: "Download my resume to see my complete experience, education, and skill set in one place.",
    link: "ASSETS/resume.pdf",
    buttonText: "Download Resume",
    note: "Last updated September 2026"
  },

  contact: {
    headline: "Let's build something great.",
    subtext: "Open to new opportunities, freelance projects, and collaborations.",
    email: "hello@harshraj.design",
    social: [
      { platform: "LinkedIn",   url: "https://linkedin.com/in/harshrajdodiya",  icon: "linkedin"   },
      { platform: "Instagram",  url: "https://instagram.com/harshrajdodiya",    icon: "instagram"  },
      { platform: "Figma",      url: "https://figma.com/@harshrajdodiya",       icon: "figma"      }
    ]
  }
};

// ============================================================
// Utilities
// ============================================================

const STORAGE_KEY = "hrd_portfolio_v1";

/** Deep-merge two plain objects. Arrays from source always win. */
function deepMerge(target, source) {
  const out = Object.assign({}, target);
  if (_isObj(target) && _isObj(source)) {
    Object.keys(source).forEach(k => {
      if (Array.isArray(source[k])) {
        out[k] = source[k];
      } else if (_isObj(source[k])) {
        out[k] = k in target ? deepMerge(target[k], source[k]) : source[k];
      } else {
        out[k] = source[k];
      }
    });
  }
  return out;
}

function _isObj(v) {
  return v && typeof v === "object" && !Array.isArray(v);
}

/** Write to localStorage cache. */
function _cacheLocally(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) { /* ignore */ }
}

/** Read from localStorage cache. Returns null if not found. */
function _readCache() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

// ============================================================
// Firebase / Firestore helpers
// ============================================================

/** Check if Firebase SDK is available and config is filled in. */
function _firebaseReady() {
  if (typeof firebase === "undefined") return false;
  if (typeof FIREBASE_CONFIG === "undefined") return false;
  if (FIREBASE_CONFIG.apiKey.startsWith("PASTE_")) return false;
  return true;
}

/** Get (or reuse) the Firestore db instance. */
let _db = null;
function _getDb() {
  if (_db) return _db;
  if (!_firebaseReady()) return null;
  try {
    // Initialize app only once
    if (!firebase.apps.length) {
      firebase.initializeApp(FIREBASE_CONFIG);
    }
    _db = firebase.firestore();
    return _db;
  } catch (e) {
    console.warn("[Portfolio] Firestore init failed:", e);
    return null;
  }
}

/** Load data from Firestore. Returns merged data or null on failure. */
async function _loadFromFirestore() {
  const db = _getDb();
  if (!db) return null;
  try {
    const doc = await db
      .collection(FIRESTORE_COLLECTION)
      .doc(FIRESTORE_DOCUMENT)
      .get();
    if (doc.exists) {
      return deepMerge(DEFAULT_DATA, doc.data());
    }
    return null; // document doesn't exist yet
  } catch (e) {
    console.warn("[Portfolio] Firestore read failed, using cache/defaults:", e);
    return null;
  }
}

/** Save data to Firestore. Returns true on success. */
async function _saveToFirestore(data) {
  const db = _getDb();
  if (!db) return false;
  try {
    await db
      .collection(FIRESTORE_COLLECTION)
      .doc(FIRESTORE_DOCUMENT)
      .set(data);
    return true;
  } catch (e) {
    console.error("[Portfolio] Firestore write failed:", e);
    return false;
  }
}

// ============================================================
// Public API
// ============================================================

/**
 * Load data: Firestore first → localStorage cache → DEFAULT_DATA.
 * Returns a Promise<object>.
 */
async function loadData() {
  // 1. Try Firestore (source of truth)
  const firestoreData = await _loadFromFirestore();
  if (firestoreData) {
    _cacheLocally(firestoreData); // keep cache fresh
    return firestoreData;
  }

  // 2. Firestore unavailable — try localStorage cache
  const cached = _readCache();
  if (cached) {
    console.info("[Portfolio] Using local cache (Firestore unavailable).");
    return deepMerge(DEFAULT_DATA, cached);
  }

  // 3. Neither available — use defaults
  console.info("[Portfolio] Using default data.");
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

/**
 * Save data: writes to Firestore AND updates localStorage cache.
 * Returns a Promise<boolean>.
 */
async function saveData(data) {
  const ok = await _saveToFirestore(data);
  _cacheLocally(data); // always update cache regardless
  return ok;
}

/** Trigger browser download of portfolio_data.json */
function exportData(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = "portfolio_data.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Parse imported JSON and merge with defaults. Throws on bad JSON. */
function importData(jsonString) {
  const parsed = JSON.parse(jsonString);
  return deepMerge(DEFAULT_DATA, parsed);
}

/** Wipe Firestore + localStorage and return fresh default copy. */
async function resetData() {
  try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
  const fresh = JSON.parse(JSON.stringify(DEFAULT_DATA));
  await _saveToFirestore(fresh);
  return fresh;
}

// ============================================================
// Global bootstrap — all scripts reference `portfolioData`
// Async load: data is fetched before the rest of the page
// renders via window._portfolioDataReady promise.
// ============================================================
let portfolioData = JSON.parse(JSON.stringify(DEFAULT_DATA)); // sync fallback

// Promise that resolves once real data is loaded
window._portfolioDataReady = loadData().then(data => {
  portfolioData = data;
  return data;
}).catch(err => {
  console.error("[Portfolio] Data load error:", err);
  return portfolioData; // fallback to defaults
});
