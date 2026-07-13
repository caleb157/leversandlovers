// The Levers of B4T — data model
// tiers: "additive" levers sum into base intensity; "multiplier" levers scale it.
// weight: 1 = straw-on-the-camel, 2 = standard, 3 = heavy.
// Each option maps to an intensity score 0 (low) – 4 (high).
// "philosophical" levers also carry a spectrum value 0 (business end) – 100 (mission end).

export type Category =
  | "Environmental"
  | "Personal"
  | "Business"
  | "Transformational"
  | "Philosophical";

export interface Option {
  label: string;
  intensity: number; // 0–4
  spectrum?: number; // 0–100, philosophical levers only
}

export interface Lever {
  id: string;
  category: Category;
  question: string;
  weight: 1 | 2 | 3;
  tier: "additive" | "multiplier";
  note?: string;
  options: Option[];
}

const yn = (yesLow: boolean, hi = 3): Option[] =>
  yesLow
    ? [
        { label: "Yes", intensity: 0 },
        { label: "Somewhat / partially", intensity: 2 },
        { label: "No", intensity: hi },
      ]
    : [
        { label: "Yes", intensity: hi },
        { label: "Somewhat / partially", intensity: 2 },
        { label: "No", intensity: 0 },
      ];

export const LEVERS: Lever[] = [
  // ─────────────── ENVIRONMENTAL (the base layer / context score) ───────────────
  {
    id: "expat-proximity",
    category: "Environmental",
    question:
      "Do other expats live within reasonable distance for frequent personal contact?",
    weight: 1,
    tier: "additive",
    options: yn(true),
  },
  {
    id: "lived-in-city",
    category: "Environmental",
    question: "Have you lived in the city you are building the business in?",
    weight: 2,
    tier: "additive",
    options: [
      { label: "Yes, 2+ years", intensity: 0 },
      { label: "Yes, under 2 years", intensity: 1 },
      { label: "Visited only", intensity: 3 },
      { label: "Never been", intensity: 4 },
    ],
  },
  {
    id: "foreigners-before",
    category: "Environmental",
    question: "Have other foreigners lived there before you?",
    weight: 1,
    tier: "additive",
    options: yn(true),
  },
  {
    id: "language-need",
    category: "Environmental",
    question:
      "How much local language does your specific business model require you to have?",
    weight: 2,
    tier: "additive",
    options: [
      { label: "Almost none — English or translators suffice", intensity: 0 },
      { label: "Conversational", intensity: 2 },
      { label: "Professional working fluency", intensity: 3 },
      { label: "Native-level nuance (sales, negotiation, trust)", intensity: 4 },
    ],
  },
  {
    id: "bureaucracy",
    category: "Environmental",
    question:
      "Does the legal system in your country and city carry a lot of bureaucracy?",
    weight: 2,
    tier: "additive",
    options: yn(false),
  },
  {
    id: "taxes",
    category: "Environmental",
    question: "Are taxes punitive for businesses in your context?",
    weight: 1,
    tier: "additive",
    options: yn(false),
  },
  {
    id: "ecosystem",
    category: "Environmental",
    question:
      "Is there a good business ecosystem in your location for your industry?",
    weight: 2,
    tier: "additive",
    options: yn(true),
  },
  {
    id: "proven-locally",
    category: "Environmental",
    question:
      "Is this business already working in your location — including expat-run examples in your country or region?",
    weight: 2,
    tier: "additive",
    options: [
      { label: "Yes, expats run it successfully here", intensity: 0 },
      { label: "Locals run it successfully here", intensity: 1 },
      { label: "Works elsewhere, unproven here", intensity: 3 },
      { label: "Unproven anywhere", intensity: 4 },
    ],
  },
  {
    id: "location-strategic",
    category: "Environmental",
    question:
      "Can your business location (office, factory, home office) sit somewhere strategic for hiring your target people group?",
    weight: 2,
    tier: "additive",
    options: yn(true),
  },
  {
    id: "surveillance",
    category: "Environmental",
    question:
      "How intense is political/religious surveillance of foreigners and religious activity in your context?",
    weight: 3,
    tier: "multiplier",
    note: "A capacity multiplier: constant background load on nearly every other lever.",
    options: [
      { label: "Open society, low scrutiny", intensity: 0 },
      { label: "Watched but tolerated", intensity: 2 },
      { label: "Active monitoring, informants plausible", intensity: 3 },
      { label: "Hostile state security environment", intensity: 4 },
    ],
  },
  {
    id: "repatriation",
    category: "Environmental",
    question:
      "How much friction exists in banking, forex, and moving money in and out of the country?",
    weight: 2,
    tier: "additive",
    options: [
      { label: "Frictionless", intensity: 0 },
      { label: "Manageable paperwork", intensity: 1 },
      { label: "Heavy controls / informal economy norms", intensity: 3 },
      { label: "Severe capital controls or sanctions", intensity: 4 },
    ],
  },
  {
    id: "infrastructure",
    category: "Environmental",
    question:
      "How reliable are power, internet, and logistics infrastructure where you operate?",
    weight: 2,
    tier: "additive",
    options: [
      { label: "Fully reliable", intensity: 0 },
      { label: "Occasional outages, easy redundancy", intensity: 1 },
      { label: "Frequent disruption, redundancy required", intensity: 3 },
      { label: "Chronically unreliable", intensity: 4 },
    ],
  },
  {
    id: "family-fit",
    category: "Environmental",
    question:
      "How well does the location fit your family — schooling, spouse's life and visa, healthcare?",
    weight: 3,
    tier: "multiplier",
    note: "Family capacity is often the true ceiling, not founder capacity.",
    options: [
      { label: "Family thrives here / not applicable", intensity: 0 },
      { label: "Workable with effort", intensity: 2 },
      { label: "Significant ongoing strain", intensity: 3 },
      { label: "Family is at breaking point", intensity: 4 },
    ],
  },
  {
    id: "visa",
    category: "Environmental",
    question: "How stable and renewable is your visa pathway?",
    weight: 3,
    tier: "multiplier",
    note: "If the founder can be removed, everything built on trust is fragile.",
    options: [
      { label: "Long-term secure status", intensity: 0 },
      { label: "Renewable with confidence", intensity: 1 },
      { label: "Renewable with uncertainty", intensity: 3 },
      { label: "Precarious / frequently denied class", intensity: 4 },
    ],
  },

  // ─────────────── PERSONAL ───────────────
  {
    id: "founded-before",
    category: "Personal",
    question: "Have you founded a business before?",
    weight: 2,
    tier: "additive",
    options: yn(true),
  },
  {
    id: "sales-experience",
    category: "Personal",
    question: "Have you done sales before?",
    weight: 2,
    tier: "additive",
    options: yn(true),
  },
  {
    id: "industry-experience",
    category: "Personal",
    question: "Have you worked in your industry before?",
    weight: 2,
    tier: "additive",
    options: yn(true),
  },
  {
    id: "coach",
    category: "Personal",
    question: "Do you have a coach?",
    weight: 1,
    tier: "additive",
    options: yn(true, 2),
  },
  {
    id: "advisors",
    category: "Personal",
    question: "Do you have advisors who know your specific industry?",
    weight: 1,
    tier: "additive",
    options: yn(true, 2),
  },
  {
    id: "skill-model-match",
    category: "Personal",
    question:
      "Does the bottleneck function of your business model (sales, operations, craft, finance) match your strongest gifting?",
    weight: 3,
    tier: "additive",
    note: "A mismatched founder runs the machine permanently hot.",
    options: [
      { label: "Direct match — the bottleneck is my strength", intensity: 0 },
      { label: "Adjacent — I can grow into it", intensity: 2 },
      { label: "Mismatch — I'll depend on hiring it", intensity: 3 },
      { label: "Mismatch and no plan to cover it", intensity: 4 },
    ],
  },
  {
    id: "hours-desired",
    category: "Personal",
    question:
      "Do you intend to work fewer hours in the business than a normal employee would (under ~30 hours/week)?",
    weight: 2,
    tier: "additive",
    note: "Low hours with high ambition is an intensity trap.",
    options: [
      { label: "No — full working hours or more", intensity: 0 },
      { label: "Roughly normal hours", intensity: 1 },
      { label: "Yes, under 30 hours", intensity: 3 },
    ],
  },
  {
    id: "timeline",
    category: "Personal",
    question: "How long do you expect to spend building this business?",
    weight: 1,
    tier: "additive",
    options: [
      { label: "7+ years", intensity: 0 },
      { label: "4–6 years", intensity: 1 },
      { label: "2–3 years", intensity: 3 },
      { label: "Under 2 years", intensity: 4 },
    ],
  },
  {
    id: "paycheck-5yr",
    category: "Personal",
    question: "Do you intend to draw a paycheck from this business within 5 years?",
    weight: 1,
    tier: "additive",
    note: "Needing income raises pressure; not needing it can erode realness.",
    options: [
      { label: "No — funded another way", intensity: 1 },
      { label: "Yes, partial income", intensity: 1 },
      { label: "Yes — it must fully support us", intensity: 3 },
    ],
  },

  // ─────────────── BUSINESS ───────────────
  {
    id: "capital",
    category: "Business",
    question: "How much capital do you have access to, relative to what the model needs?",
    weight: 2,
    tier: "additive",
    options: [
      { label: "Fully capitalized with buffer", intensity: 0 },
      { label: "Enough to reach revenue", intensity: 1 },
      { label: "Undercapitalized — tight runway", intensity: 3 },
      { label: "Severely undercapitalized", intensity: 4 },
    ],
  },
  {
    id: "partners",
    category: "Business",
    question: "Do you have founding partners?",
    weight: 2,
    tier: "additive",
    note: "Partners spread load but add alignment cost.",
    options: [
      { label: "Yes, aligned and complementary", intensity: 0 },
      { label: "Yes, but alignment is untested", intensity: 2 },
      { label: "No — solo founder", intensity: 3 },
    ],
  },
  {
    id: "known-customer",
    category: "Business",
    question:
      "Do you already know a large customer for your business who is not in your family?",
    weight: 2,
    tier: "additive",
    options: yn(true),
  },
  {
    id: "ownership",
    category: "Business",
    question: "Do you own the business, or is it owned by someone else?",
    weight: 1,
    tier: "additive",
    options: [
      { label: "I own it (or with partners)", intensity: 0 },
      { label: "Shared with outside owners", intensity: 2 },
      { label: "Owned by someone else", intensity: 3 },
    ],
  },
  {
    id: "franchise",
    category: "Business",
    question: "Is this a franchise/proven playbook, or your own idea?",
    weight: 1,
    tier: "additive",
    options: [
      { label: "Franchise or proven playbook", intensity: 0 },
      { label: "Adaptation of a proven model", intensity: 1 },
      { label: "Entirely my own idea", intensity: 3 },
    ],
  },
  {
    id: "innovation",
    category: "Business",
    question: "How innovative are you trying to be with the product or service?",
    weight: 2,
    tier: "additive",
    options: [
      { label: "Branding tweak on a known offer", intensity: 0 },
      { label: "Meaningful improvement", intensity: 1 },
      { label: "Changing the business model", intensity: 3 },
      { label: "Building a whole new category", intensity: 4 },
    ],
  },
  {
    id: "scale",
    category: "Business",
    question: "What scale are you aiming for?",
    weight: 2,
    tier: "additive",
    options: [
      { label: "Small, low-profile business", intensity: 1 },
      { label: "Solid SME (10–50 people)", intensity: 2 },
      { label: "Large employer (50+)", intensity: 4 },
    ],
  },
  {
    id: "supply-chain",
    category: "Business",
    question:
      "Do you understand your supply chain and have good access to it (vendors, service providers)?",
    weight: 2,
    tier: "additive",
    options: yn(true),
  },
  {
    id: "model-complexity",
    category: "Business",
    question:
      "How complex is your business model? Does each business-model-canvas square take a sentence, or two paragraphs?",
    weight: 2,
    tier: "additive",
    options: [
      { label: "A sentence per square", intensity: 0 },
      { label: "A paragraph per square", intensity: 2 },
      { label: "Two paragraphs per square", intensity: 4 },
    ],
  },
  {
    id: "cash-cycle",
    category: "Business",
    question:
      "How long is your cash conversion cycle — from spending money to getting paid?",
    weight: 2,
    tier: "additive",
    options: [
      { label: "Days (cash business)", intensity: 0 },
      { label: "Weeks", intensity: 1 },
      { label: "1–3 months", intensity: 3 },
      { label: "3+ months", intensity: 4 },
    ],
  },
  {
    id: "physical-digital",
    category: "Business",
    question: "Is your deliverable physical or digital/service?",
    weight: 2,
    tier: "additive",
    note: "Physical products drag in supply chain, QC, logistics, and working-capital levers all at once.",
    options: [
      { label: "Digital / pure service", intensity: 0 },
      { label: "Service with physical elements", intensity: 2 },
      { label: "Physical product", intensity: 3 },
      { label: "Physical, perishable or heavy/regulated", intensity: 4 },
    ],
  },

  // ─────────────── TRANSFORMATIONAL ───────────────
  {
    id: "team",
    category: "Transformational",
    question: "Do you have a team for the transformational side of the work?",
    weight: 2,
    tier: "additive",
    options: yn(true),
  },
  {
    id: "target-educated",
    category: "Transformational",
    question:
      "Is your target people group educated and skilled in the work you're trying to do?",
    weight: 2,
    tier: "additive",
    options: [
      { label: "Skilled and educated", intensity: 0 },
      { label: "Trainable with effort", intensity: 2 },
      { label: "Requires long-term training investment", intensity: 4 },
    ],
  },
  {
    id: "hire-majority",
    category: "Transformational",
    question:
      "Are you able to hire and employ mostly people from your target culture?",
    weight: 2,
    tier: "additive",
    options: yn(true),
  },
  {
    id: "locals-likeminded",
    category: "Transformational",
    question:
      "Are there like-minded locals available for sensitive or strategic roles, whom you know or can reach through your network?",
    weight: 3,
    tier: "additive",
    options: yn(true, 4),
  },
  {
    id: "giftedness",
    category: "Transformational",
    question:
      "Are you gifted for the kind of transformational work your model requires?",
    weight: 2,
    tier: "additive",
    options: yn(true),
  },
  {
    id: "org-alignment",
    category: "Transformational",
    question:
      "Does your organization support your specific type of work, and are you in line with it?",
    weight: 1,
    tier: "additive",
    options: yn(true),
  },
  {
    id: "flavor-articulated",
    category: "Transformational",
    question:
      "Does your team have a clearly articulated flavor of B4T, or is it still vague?",
    weight: 1,
    tier: "additive",
    options: [
      { label: "Clearly articulated and shared", intensity: 0 },
      { label: "Partially articulated", intensity: 2 },
      { label: "Still vague", intensity: 3 },
    ],
  },

  // ─────────────── PHILOSOPHICAL (the horizontal spectrum) ───────────────
  {
    id: "transformation-inside",
    category: "Philosophical",
    question:
      "How much of the spiritual transformation do you want to happen inside the business, versus through neighbors or the business as a hub for outside work?",
    weight: 2,
    tier: "additive",
    options: [
      { label: "Business is a platform; work happens outside it", intensity: 1, spectrum: 90 },
      { label: "Mixed — hub plus some inside", intensity: 2, spectrum: 55 },
      { label: "Primarily inside the business itself", intensity: 3, spectrum: 20 },
    ],
  },
  {
    id: "target-customer",
    category: "Philosophical",
    question:
      "Are you the target customer or end user for your product or service — do you want or need what you sell?",
    weight: 1,
    tier: "additive",
    options: [
      { label: "Yes — I'd buy this myself", intensity: 0, spectrum: 20 },
      { label: "Partially", intensity: 1, spectrum: 50 },
      { label: "No — it's purely strategic", intensity: 3, spectrum: 80 },
    ],
  },
  {
    id: "donor-subsidy",
    category: "Philosophical",
    question:
      "Are you directly or indirectly subsidizing the business with donor funds (direct giving, or people raising support to be paid)?",
    weight: 2,
    tier: "additive",
    note: "Subsidy lowers financial intensity but pulls hard toward the mission end and can mask a broken model.",
    options: [
      { label: "No subsidy — market-funded", intensity: 3, spectrum: 5 },
      { label: "Founder support-raised, business market-funded", intensity: 2, spectrum: 45 },
      { label: "Business itself is subsidized", intensity: 1, spectrum: 85 },
    ],
  },
  {
    id: "real-business",
    category: "Philosophical",
    question:
      "How much of your business is real and engaged with the open market, rather than a front?",
    weight: 3,
    tier: "additive",
    options: [
      { label: "Fully real — market accountability", intensity: 3, spectrum: 5 },
      { label: "Real but sheltered", intensity: 2, spectrum: 45 },
      { label: "Largely a platform/front", intensity: 1, spectrum: 90 },
    ],
  },
  {
    id: "product-love",
    category: "Philosophical",
    question:
      "Do you love the quality and beauty of what you sell, or is it utilitarian to you?",
    weight: 1,
    tier: "additive",
    options: [
      { label: "I love it — craft matters to me", intensity: 0, spectrum: 20 },
      { label: "It's fine", intensity: 1, spectrum: 50 },
      { label: "Purely utilitarian", intensity: 2, spectrum: 75 },
    ],
  },
  {
    id: "visibility",
    category: "Philosophical",
    question: "How much of your business happens in front of local people?",
    weight: 2,
    tier: "additive",
    options: [
      { label: "Highly visible — shopfront, factory floor", intensity: 3, spectrum: 25 },
      { label: "Partly visible", intensity: 2, spectrum: 50 },
      { label: "Mostly invisible (export, online)", intensity: 1, spectrum: 70 },
    ],
  },
];

export const CATEGORIES: Category[] = [
  "Environmental",
  "Personal",
  "Business",
  "Transformational",
  "Philosophical",
];

export const CATEGORY_BLURBS: Record<Category, string> = {
  Environmental:
    "The base layer. Mostly fixed once you've chosen a context — this is the intensity floor you build everything on.",
  Personal: "Your experience, gifting, motivation, and support structures.",
  Business: "The model itself — scale, capital, complexity, cash, customers.",
  Transformational: "Team, target group, and the machinery of impact.",
  Philosophical:
    "Where you sit on the spectrum from traveling on business to traveling on mission.",
};
