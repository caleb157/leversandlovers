// The Levers of B4T — data model
// tiers: "additive" levers sum into base intensity; "multiplier" levers scale it.
// weight: 1 = straw-on-the-camel, 2 = standard, 3 = heavy.
// Each option maps to an intensity score 0 (low) – 4 (high).
// "philosophical" levers also carry a spectrum value 0 (business end) – 100 (mission end).

export type Category =
  | "Environmental"
  | "Personal"
  | "Business"
  | "Transformational";

export interface Option {
  label: string;
  intensity: number; // 0–4
  spectrum?: number; // 0–100, philosophical levers only
}

export interface Lever {
  id: string;
  category: Category;
  name: string; // short display name for the board
  question: string;
  weight: 1 | 2 | 3;
  tier: "additive" | "multiplier";
  note?: string;
  options: Option[];
  description: string; // what the lever measures and why it matters in B4T
  prosCons: { up: string[]; down: string[] }; // up = pull harder, down = ease off
}

type BaseLever = Omit<Lever, "name" | "description" | "prosCons">;
type LeverMeta = Pick<Lever, "name" | "description" | "prosCons">;

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

const BASE: BaseLever[] = [
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
      "Does reaching your target group require moving your business location away from where you live, where your business type normally operates, or somewhere pleasant to be?",
    weight: 1,
    tier: "additive",
    options: [
      { label: "No — they're where we naturally live and operate", intensity: 0 },
      { label: "Somewhat — a commute or a less convenient district", intensity: 2 },
      { label: "Yes — far from home, unusual for our industry, or a hard place to be", intensity: 4 },
    ],
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
    weight: 2,
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
    weight: 2,
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
    weight: 2,
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
    weight: 2,
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
    weight: 3,
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
    weight: 3,
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
    weight: 1,
    tier: "additive",
    options: yn(true),
  },
  {
    id: "target-customer",
    category: "Business",
    question:
      "How well do you understand the needs of the customer you're serving — are you a target customer or end user yourself?",
    weight: 1,
    tier: "additive",
    options: [
      { label: "Yes — I want or need this myself", intensity: 0 },
      { label: "Partially — I understand it secondhand", intensity: 1 },
      { label: "No — I'm learning the customer as I go", intensity: 3 },
    ],
  },
  {
    id: "donor-subsidy",
    category: "Business",
    question:
      "How is the business's revenue funded? This shapes cash flow and long-term sustainability.",
    weight: 2,
    tier: "additive",
    options: [
      { label: "No subsidies — directly market-driven", intensity: 3 },
      {
        label:
          "Some customers raise money to pay for the service, or are non-profits with a similar vision",
        intensity: 2,
      },
      { label: "We directly subsidize the business with outside funds", intensity: 1 },
    ],
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
    weight: 1,
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
    weight: 1,
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
    weight: 2,
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

  {
    id: "product-love",
    category: "Business",
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
    category: "Transformational",
    question:
      "How much of your business's daily operations — office work, service delivery, product creation — happens in front of local people?",
    weight: 2,
    tier: "additive",
    options: [
      { label: "Highly visible — shopfront, factory floor", intensity: 3, spectrum: 25 },
      { label: "Partly visible", intensity: 2, spectrum: 50 },
      { label: "Mostly invisible (export, online)", intensity: 1, spectrum: 70 },
    ],
  },
];

const META: Record<string, LeverMeta> = {
  // ─── Environmental ───
  // For Environmental levers, prosCons reads as: up = what high intensity
  // looks like, down = what low intensity looks like. These are context
  // conditions, not choices — the board shows them as high/low pictures.
  "expat-proximity": {
    name: "Expat proximity",
    description:
      "Measures how isolated you are from peers who share your language, faith, and pressures. Frequent personal contact with other expats is a proven buffer against burnout in B4T contexts, where the founder often carries stress they can't share with locals or a distant sending org.",
    prosCons: {
      up: [
        "You are the only expat family for hours in any direction",
        "Encouragement and debriefs happen by video call, if at all",
        "A hard week has nowhere local to land — everything is carried alone or at home",
      ],
      down: [
        "Other expats live close enough for a shared meal without planning a trip",
        "Someone nearby has already navigated the visa office, the hospital, the school",
        "Hard seasons are witnessed by people who understand both worlds",
      ],
    },
  },
  "lived-in-city": {
    name: "City familiarity",
    description:
      "Measures how well you know the city you're building in. This intensity is concentrated in the first couple of years: unfamiliarity means learning the informal rules — who to trust, what things really cost, which official actually decides — while simultaneously launching a business.",
    prosCons: {
      up: [
        "Your first years are spent learning the city and the business at the same time",
        "Every price, landlord, and official is an unknown you discover by paying",
        "You don't yet know whether your family can genuinely live here",
      ],
      down: [
        "You already know the neighborhoods, the real costs, and who to call",
        "Existing relationships shortcut hiring, permits, and supplier trust",
        "The city's surprises were absorbed before the business depended on you",
      ],
    },
  },
  "foreigners-before": {
    name: "Foreigner precedent",
    description:
      "Measures whether local officials, landlords, and neighbors have a mental category for you. Being the first foreigner means every registration, lease, and friendship is a novel event — often flattering, always slow, and sometimes suspicious.",
    prosCons: {
      up: [
        "Every registration and lease is a first — officials improvise, slowly",
        "Neighbors have no category for you except curiosity or suspicion",
        "You absorb every foreigner-shaped mistake personally, with no trail to follow",
      ],
      down: [
        "Bureaucrats already know how to process your paperwork",
        "Goodwill (or at least familiarity) toward foreigners is established",
        "Someone has already made the expensive mistakes you'd otherwise repeat",
      ],
    },
  },
  "language-need": {
    name: "Language load",
    description:
      "Measures how much local-language mastery your specific business model demands, not language ability in general. A trading business run in English is a different life from retail sales requiring native-level nuance and trust-building.",
    prosCons: {
      up: [
        "Sales, negotiation, and trust all run through native-level nuance",
        "Years of language study compete directly with business hours",
        "Contracts and conflict get handled below your fluency level",
      ],
      down: [
        "English or translators carry most business communication",
        "Language study is for life and ministry, not business survival",
        "Staff can cover the linguistic gaps the model does have",
      ],
    },
  },
  bureaucracy: {
    name: "Bureaucratic drag",
    description:
      "Measures the paperwork tax your legal system charges on everything — registration, hiring, imports, closing a bad contract. Heavy bureaucracy doesn't just slow you down; it multiplies your exposure to officials who can ask questions about who you are.",
    prosCons: {
      up: [
        "Weeks of stamps and offices for what should take a day",
        "Every government touchpoint is another set of questions about who you are",
        "Compliance overhead quietly consumes founder hours the model never priced in",
      ],
      down: [
        "Registration, hiring, and imports follow published, predictable steps",
        "Officials are a formality, not a recurring risk",
        "Founder time goes into the business, not the paperwork",
      ],
    },
  },
  taxes: {
    name: "Tax burden",
    description:
      "Measures whether the tax regime punishes formal businesses. Punitive taxes push local competitors into informality, which means a fully-compliant foreign-run business competes at a structural cost disadvantage.",
    prosCons: {
      up: [
        "Formal compliance puts you at a structural cost disadvantage against informal rivals",
        "The runway to a real paycheck stretches by years",
        "Tax season is a recurring source of exposure and negotiation",
      ],
      down: [
        "Taxes are a line item, not a strategy problem",
        "Compliance is affordable, so integrity costs nothing extra",
      ],
    },
  },
  ecosystem: {
    name: "Business ecosystem",
    description:
      "Measures whether your location has the industry infrastructure your business needs — suppliers, skilled labor, service providers, customers who understand your offer. A weak ecosystem means importing everything, including expertise.",
    prosCons: {
      up: [
        "Suppliers, skilled labor, and services must be imported or built from scratch",
        "No peer businesses exist to benchmark normal costs and margins",
        "Every solved problem was solved by you, at full price",
      ],
      down: [
        "Suppliers, talent, and service providers exist locally and compete for your business",
        "Customers already understand what you're offering",
        "You can buy solutions instead of building them",
      ],
    },
  },
  "proven-locally": {
    name: "Local proof",
    description:
      "Measures whether your business model has already worked in your location — ideally run by expats. An unproven model in an unfamiliar market means you're testing the model and the market simultaneously, which doubles the learning burden.",
    prosCons: {
      up: [
        "You're testing the model and the market at the same time",
        "Every assumption — pricing, demand, margins — is unverified locally",
        "No local example exists to learn from or point to",
      ],
      down: [
        "The model demonstrably works here, possibly even expat-run",
        "Local examples show real prices, margins, and pitfalls",
        "The biggest unknown — does this work here? — is already answered",
      ],
    },
  },
  "location-strategic": {
    name: "Strategic siting",
    description:
      "Measures whether reaching your target group forces the business somewhere it wouldn't naturally sit — away from your home, outside your industry's normal geography, or in a hard place to spend your days. The bigger that dislocation, the more daily friction the location itself adds.",
    prosCons: {
      up: [
        "Long daily travel between home and the place the work has to happen",
        "Your industry doesn't normally operate there — suppliers and customers are elsewhere",
        "The area itself is a hard place to spend every working day",
      ],
      down: [
        "The target group lives where you already live and work",
        "The business sits where its industry naturally operates",
        "No forced choice between commercial logic and reaching the right people",
      ],
    },
  },
  surveillance: {
    name: "Surveillance intensity",
    description:
      "Measures the background weight of political and religious monitoring in your context. This is a capacity multiplier, not just another lever: surveillance adds load to hiring, meetings, communications, finances, and friendships simultaneously, and it never switches off.",
    prosCons: {
      up: [
        "Communications, finances, and friendships all carry a second audience",
        "Hiring and meeting decisions are filtered through informant risk",
        "The family feels watched even on ordinary days",
      ],
      down: [
        "You speak, meet, and message without a mental censor",
        "Staff and friends carry no risk simply by knowing you",
        "Energy goes into the work, not into operational care",
      ],
    },
  },
  repatriation: {
    name: "Money movement",
    description:
      "Measures the friction in banking, forex, and moving money in and out of the country. Capital controls and informal-economy norms complicate everything from paying suppliers to receiving investment to eventually drawing a salary.",
    prosCons: {
      up: [
        "Capital sits trapped on one side of a border while bills sit on the other",
        "Paying suppliers or receiving investment requires workarounds and patience",
        "A rule change can strand the business from its funding overnight",
      ],
      down: [
        "Money moves in and out at market rates with ordinary paperwork",
        "Runway on paper is runway in practice",
        "Drawing a salary someday is a tax question, not a smuggling question",
      ],
    },
  },
  infrastructure: {
    name: "Infrastructure reliability",
    description:
      "Measures how dependable power, internet, and logistics are where you operate. Unreliable infrastructure forces you to buy redundancy — generators, backup links, buffer stock — which quietly inflates the capital the model needs.",
    prosCons: {
      up: [
        "Generators, backup links, and buffer stock are mandatory line items",
        "Outages regularly become missed deliveries and lost work",
        "Plans assume disruption because disruption is the norm",
      ],
      down: [
        "Power, internet, and logistics simply work",
        "Capital goes to payroll and inventory, not redundancy",
        "A digital or delivery-dependent model runs as designed",
      ],
    },
  },
  "family-fit": {
    name: "Family fit",
    description:
      "Measures how well the location works for your whole household — schooling, spouse's daily life and legal status, healthcare. This is a multiplier because family strain doesn't stay contained: it caps the founder's real capacity regardless of what the business needs.",
    prosCons: {
      up: [
        "Schooling, healthcare, or the spouse's daily life runs on ongoing strain",
        "Family stress follows the founder into every working day",
        "Medical or schooling gaps surface as emergencies at the worst moments",
      ],
      down: [
        "The whole household has a life here, not just the founder",
        "School, healthcare, and the spouse's status are settled questions",
        "Home is where capacity gets restored, not depleted",
      ],
    },
  },
  visa: {
    name: "Visa stability",
    description:
      "Measures how secure and renewable your legal right to stay is. Everything you build — the company, the team, the trust — is anchored to your presence; if the founder can be removed with one denied renewal, the whole structure is fragile.",
    prosCons: {
      up: [
        "Every renewal season puts the whole enterprise in question",
        "Long-cycle investments feel irrational when next year isn't certain",
        "Local partners and staff hesitate to commit to someone who might vanish",
      ],
      down: [
        "Legal status is measured in years, not renewal cycles",
        "Plans can honestly assume you'll still be here",
        "Staff and partners commit because you're clearly staying",
      ],
    },
  },

  // ─── Personal ───
  "founded-before": {
    name: "Founder experience",
    description:
      "Measures whether you've built a business before. A first venture means learning founding itself — pricing, hiring, firing, cash discipline — at the same time as learning a new culture, language, and security environment.",
    prosCons: {
      up: [
        "First-time founders bring energy and no bad habits",
        "The learning curve is survivable with good coaching and a simple model",
      ],
      down: [
        "Prior founding compresses years of expensive lessons into instinct",
        "Cross-cultural founding is a hard place to learn founding basics",
        "Experienced founders spot cash trouble months earlier",
      ],
    },
  },
  "sales-experience": {
    name: "Sales experience",
    description:
      "Measures whether you've sold before. Sales is the function most founders underestimate and the one no B4T business survives without — someone has to bring in revenue, and in the early years that someone is you.",
    prosCons: {
      up: [
        "Selling can be learned by doing if the model tolerates a slow ramp",
        "Technical founders can pair with a sales-gifted partner or hire",
      ],
      down: [
        "Revenue is the business's oxygen and sales skill is the pump",
        "Cross-cultural selling is harder than home-market selling, not easier",
        "Donor-backed founders can drift for years without confronting weak sales",
      ],
    },
  },
  "industry-experience": {
    name: "Industry experience",
    description:
      "Measures whether you've worked in this industry before. Industry veterans know the margins, the failure modes, and the suppliers by name; outsiders must buy that knowledge with time and mistakes.",
    prosCons: {
      up: [
        "Outsiders sometimes disrupt industries insiders have stopped questioning",
        "Passion for a new field can outlast the grind better than familiarity",
      ],
      down: [
        "Industry fluency removes an entire class of expensive surprises",
        "Credibility with suppliers and customers arrives on day one",
        "You already know whether the margins can support the mission",
      ],
    },
  },
  coach: {
    name: "Coaching",
    description:
      "Measures whether you have a coach — someone with authority to ask hard questions on a regular rhythm. B4T founders operate far from oversight, and unexamined drift (in the business or the mission) is the default, not the exception.",
    prosCons: {
      up: [
        "Going without frees you from another reporting relationship",
        "Some seasons genuinely lack access to a good coach",
      ],
      down: [
        "A coach catches founder blind spots before they become crises",
        "Regular external perspective keeps business and mission honestly weighed",
        "Isolation plus authority plus stress is exactly when leaders go sideways",
      ],
    },
  },
  advisors: {
    name: "Industry advisors",
    description:
      "Measures whether you can reach people who know your specific industry well enough to sanity-check your numbers and decisions. Generic business advice abounds; industry-specific counsel is what actually prevents pricing and sourcing mistakes.",
    prosCons: {
      up: [
        "Building without advisors keeps you nimble and forces first-principles thinking",
        "In frontier industries, no relevant advisors may exist yet",
      ],
      down: [
        "One experienced advisor call can save a five-figure mistake",
        "Advisors extend your network into suppliers, customers, and hires",
      ],
    },
  },
  "skill-model-match": {
    name: "Skill-to-model match",
    description:
      "Measures whether the bottleneck function of your business model — sales, operations, craft, finance — matches your strongest gifting. A mismatched founder runs the machine permanently hot, doing their weakest work at the most critical point.",
    prosCons: {
      up: [
        "Stretching into a weak area can grow you if the gap is adjacent, not opposite",
        "A strong early hire can cover the bottleneck if capital allows",
      ],
      down: [
        "The bottleneck function is where the business lives or dies — put your strength there",
        "Permanent operation outside your gifting is a burnout formula",
        "Hiring your way out assumes talent and money you may not have",
      ],
    },
  },
  "hours-desired": {
    name: "Hours committed",
    description:
      "Measures the gap between the hours the business needs and the hours you intend to give it. Founders who plan under 30 hours a week — often to protect ministry time — are asking the business to grow on part-time fuel, which is an intensity trap.",
    prosCons: {
      up: [
        "Full commitment is what real businesses require — and locals can tell",
        "The business is the ministry platform; starving it starves both",
      ],
      down: [
        "Protected non-business hours can guard family and direct ministry",
        "Some mature or simple models genuinely run on fewer founder hours",
        "Sustainable pace beats heroic pace over a 10-year horizon",
      ],
    },
  },
  timeline: {
    name: "Time horizon",
    description:
      "Measures how long you expect to spend building. Businesses in hard places take longer than businesses at home, and transformational fruit takes longer still; a short horizon forces shortcuts in exactly the areas that can't be shortcut.",
    prosCons: {
      up: [
        "Urgency concentrates effort and forces early market validation",
        "Short commitments are easier to recruit family and partners into",
      ],
      down: [
        "Trust, fluency, and profitability all compound on 7+ year timelines",
        "A 2-year plan in a 7-year context guarantees leaving before the fruit",
        "Local staff invest in leaders they believe are staying",
      ],
    },
  },
  "paycheck-5yr": {
    name: "Paycheck dependence",
    description:
      "Measures whether the business must pay you within five years. Needing income raises pressure and forces commercial discipline; not needing it removes pressure but can quietly erode the realness the whole strategy depends on.",
    prosCons: {
      up: [
        "Needing the paycheck forces the market honesty that makes B4T credible",
        "A business that supports its founder is proven, not subsidized",
      ],
      down: [
        "Outside funding buys patience in slow-trust, long-cycle markets",
        "Income pressure can push you into short-term revenue over right strategy",
      ],
    },
  },

  // ─── Business ───
  capital: {
    name: "Capitalization",
    description:
      "Measures your funding relative to what the model actually needs — including the buffer for the surprises hard contexts guarantee. Undercapitalization doesn't usually kill businesses outright; it forces a chain of desperate decisions that do.",
    prosCons: {
      up: [
        "Lean starts force frugality and fast validation",
        "Less capital at risk means less lost if the model needs a pivot",
      ],
      down: [
        "Runway is decision quality — desperate founders make bad calls",
        "Hard contexts always cost more than the spreadsheet says",
        "A buffer lets you survive the visa delay, the raid, the lost container",
      ],
    },
  },
  partners: {
    name: "Founding partners",
    description:
      "Measures whether you're building alone or with partners. Partners spread the load and cover skill gaps, but add alignment cost — and misaligned partners in a stressed cross-cultural setting are their own crisis.",
    prosCons: {
      up: [
        "Solo founding means total clarity of vision and speed of decision",
        "No partner conflict risk — the most common startup killer after cash",
      ],
      down: [
        "Aligned partners cover your skill gaps and share the emotional load",
        "Someone can mind the business during your visa runs and family emergencies",
        "Shared burden is sustainability insurance in high-intensity contexts",
      ],
    },
  },
  "known-customer": {
    name: "Anchor customer",
    description:
      "Measures whether you already know a large customer — outside your family — before you build. A real anchor customer converts the riskiest assumption in the whole model (will anyone pay?) into a known fact.",
    prosCons: {
      up: [
        "Building without one keeps you honest about serving a whole market",
        "Anchor dependence can distort the product toward one buyer's needs",
      ],
      down: [
        "A committed first customer de-risks the model more than any plan",
        "Early revenue shortens the runway to sustainability",
        "One reference customer unlocks the next ten",
      ],
    },
  },
  ownership: {
    name: "Ownership stake",
    description:
      "Measures whether you own the business you're pouring yourself into. Ownership aligns risk, reward, and authority; running someone else's business means your strategic calls — including mission-critical ones — need someone else's sign-off.",
    prosCons: {
      up: [
        "Full ownership gives you the authority your transformational strategy needs",
        "Owners can hold the long timeline; hired managers get measured quarterly",
      ],
      down: [
        "Outside owners bring capital and experience you may lack",
        "Local ownership structures can be legally required or strategically wise",
      ],
    },
  },
  franchise: {
    name: "Model provenance",
    description:
      "Measures whether you're running a proven playbook or your own idea. A franchise or established model means the fundamental question — does this work? — is already answered; an original idea means you're answering it in a hard market.",
    prosCons: {
      up: [
        "Original ideas can fit the local context in ways no imported playbook does",
        "Your own model means no royalties and no external constraints",
      ],
      down: [
        "Proven playbooks eliminate whole categories of fatal unknowns",
        "Documented systems free founder attention for people and mission",
        "Franchise support networks substitute for missing local ecosystems",
      ],
    },
  },
  innovation: {
    name: "Innovation ambition",
    description:
      "Measures how novel your product or service is trying to be. Every step past a proven offer adds market education cost — and educating a market takes exactly the time, money, and energy that B4T contexts already tax heavily.",
    prosCons: {
      up: [
        "Real innovation can create an uncontested market position",
        "Category creation can serve needs no existing offer touches",
      ],
      down: [
        "Known offers sell without expensive market education",
        "Innovation risk stacks on top of context risk — you're carrying both",
        "Proven demand lets you focus energy on execution and people",
      ],
    },
  },
  scale: {
    name: "Scale ambition",
    description:
      "Measures the size you're aiming for. Bigger employers create more jobs and more transformational surface area, but scale multiplies management load, capital needs, and — in sensitive contexts — visibility to the state.",
    prosCons: {
      up: [
        "More employees means more lives touched daily — the core B4T logic",
        "Scale brings local economic weight and legitimacy that protect you",
        "Larger businesses can develop local leaders into real management",
      ],
      down: [
        "Every ten employees is a new tier of management complexity",
        "High profile attracts scrutiny in surveillance-heavy contexts",
        "Small and profitable beats large and fragile",
      ],
    },
  },
  "supply-chain": {
    name: "Supply chain grip",
    description:
      "Measures whether you understand and can reliably access your supply chain — vendors, materials, service providers. In thin markets, a single unreliable supplier can idle the whole business, and alternatives may be a border away.",
    prosCons: {
      up: [
        "Building new supplier relationships creates exactly the local ties B4T wants",
        "Vertical integration of a weak link can become its own revenue line",
      ],
      down: [
        "Known suppliers mean predictable cost, quality, and delivery",
        "Supply blind spots surface as customer-facing failures",
        "Import dependencies stack customs and forex risk onto operations",
      ],
    },
  },
  "model-complexity": {
    name: "Model complexity",
    description:
      "Measures how complicated your business model is — whether each business-model-canvas square takes a sentence or two paragraphs. Complexity is a permanent overhead: every moving part must be managed in a second language under scrutiny.",
    prosCons: {
      up: [
        "Complex models can be defensible precisely because they're hard to copy",
        "Some real local needs simply require complex solutions",
      ],
      down: [
        "Simple models leave founder capacity for language, family, and mission",
        "Every extra moving part is another thing that breaks in a hard context",
        "Staff can actually run a simple model without you — the succession test",
      ],
    },
  },
  "cash-cycle": {
    name: "Cash cycle",
    description:
      "Measures the time between spending money and getting paid. Long cash conversion cycles demand working capital and nerve; in economies with weak contract enforcement, a 90-day receivable is a hope, not an asset.",
    prosCons: {
      up: [
        "Long-cycle B2B work often has better margins and stickier customers",
        "Financing the cycle is possible if capitalization is genuinely strong",
      ],
      down: [
        "Cash businesses self-fund growth and survive shocks",
        "Weak courts make long receivables a collection gamble",
        "Cash pressure compounds every other stressor on the founder",
      ],
    },
  },
  "physical-digital": {
    name: "Physical vs digital",
    description:
      "Measures how physical your deliverable is. Physical products drag in supply chain, quality control, logistics, and working capital simultaneously — a lever that silently pulls four others with it.",
    prosCons: {
      up: [
        "Physical businesses are visible, legible, and legitimate to officials and neighbors",
        "Factories and shops employ the many; digital shops employ the few",
        "Tangible products fit markets where digital trust is low",
      ],
      down: [
        "Digital models sidestep customs, spoilage, and inventory capital",
        "Service businesses can start smaller and pivot faster",
        "Physical operations multiply regulatory touchpoints",
      ],
    },
  },

  "target-customer": {
    name: "Customer understanding",
    description:
      "Measures how deeply you understand the needs of the customer you're serving. Founders who are their own target customer carry an instinctive feel for the product; others build that understanding through research, conversation, and iteration.",
    prosCons: {
      up: [
        "Serving a customer unlike yourself can open markets others overlook",
        "Learning the customer deliberately builds listening habits that serve the whole business",
      ],
      down: [
        "Being your own customer gives instant product instinct and authentic selling",
        "Deep customer understanding prevents slow product drift into irrelevance",
      ],
    },
  },
  "donor-subsidy": {
    name: "Revenue funding mix",
    description:
      "Measures where the money that funds the business comes from — the open market, mission-aligned buyers, or outside funds. This is a cash-flow and sustainability question as much as a philosophical one: each funding mix carries its own pressures and its own freedoms.",
    prosCons: {
      up: [
        "Market-driven revenue proves the model can stand on its own",
        "Commercial discipline sharpens every part of the operation",
        "No dependence on funding cycles outside your control",
      ],
      down: [
        "Outside funds can bridge the honest gap between launch and sustainability",
        "Mission-aligned customers and funders let you serve markets that pay slowly",
        "Lower cash pressure frees capacity for people and long-term work",
      ],
    },
  },

  // ─── Transformational ───
  team: {
    name: "Transformational team",
    description:
      "Measures whether you have a team for the transformational side of the work, or whether the founder is carrying business and mission alone. Solo spiritual labor alongside solo business labor is the classic B4T overload pattern.",
    prosCons: {
      up: [
        "Starting alone lets you set culture before adding people to it",
        "Teams add coordination and security overhead in sensitive places",
      ],
      down: [
        "A team sustains the mission when the business consumes the founder",
        "Different giftings reach different people — no founder has them all",
        "Shared discernment protects against solo drift in doctrine and strategy",
      ],
    },
  },
  "target-educated": {
    name: "Workforce readiness",
    description:
      "Measures whether your target people group already has the education and skills your business needs. A skills gap converts your hiring plan into a training institution — noble, transformational, and very expensive.",
    prosCons: {
      up: [
        "Training people is transformation — skills change families' trajectories",
        "Trained-by-you staff carry loyalty and shared culture",
      ],
      down: [
        "Skilled hires are productive in weeks, not years",
        "Training costs land exactly when the business is weakest",
        "Quality risk during the training years can sink customer trust",
      ],
    },
  },
  "hire-majority": {
    name: "Target-culture hiring",
    description:
      "Measures whether you can actually employ mostly people from your target culture. If legal, linguistic, or skills barriers push you toward hiring outside the community, the business succeeds while the strategy quietly fails.",
    prosCons: {
      up: [
        "Daily employment relationships are the deepest access B4T offers",
        "Wages flowing into the community build durable goodwill",
      ],
      down: [
        "Mixed hiring may be commercially necessary to keep quality up",
        "Concentrating one group can create local political friction",
      ],
    },
  },
  "locals-likeminded": {
    name: "Like-minded locals",
    description:
      "Measures whether like-minded locals are available — and reachable through your network — for sensitive or strategic roles. Without them, the most delicate parts of the work stay founder-dependent forever, which caps everything at your capacity and your visa.",
    prosCons: {
      up: [
        "Where none exist yet, developing the first ones is the pioneering work itself",
        "Building slowly with new believers avoids importing outside culture",
      ],
      down: [
        "Trusted locals make the work survivable past your departure",
        "Sensitive roles held by locals are far less exposed than founder-held ones",
        "A local partner reads situations you will always misread",
      ],
    },
  },
  giftedness: {
    name: "Transformational gifting",
    description:
      "Measures whether your gifting matches the kind of transformational work your model requires. A model built around workplace discipleship needs a discipler; one built on community presence needs a connector — mismatches here mirror the business skill-match trap.",
    prosCons: {
      up: [
        "Gifting can grow through practice when the gap is modest",
        "Teams can cover what the founder lacks",
      ],
      down: [
        "Working in your gifting is sustainable; working against it isn't",
        "A model redesign is cheaper than a decade of forced ministry style",
      ],
    },
  },
  "org-alignment": {
    name: "Org alignment",
    description:
      "Measures whether your sending organization supports your specific type of work and whether you're genuinely in line with it. Misalignment surfaces at the worst times — funding reviews, member care crises, security incidents — as friction and second-guessing.",
    prosCons: {
      up: [
        "Independence gives freedom to follow the strategy the context demands",
        "Some orgs' policies genuinely don't fit real B4T",
      ],
      down: [
        "Aligned orgs provide cover, care, and continuity you can't self-supply",
        "Fighting your own organization is a chronic energy leak",
        "Crisis support depends on the org understanding what you actually do",
      ],
    },
  },
  "flavor-articulated": {
    name: "Articulated flavor",
    description:
      "Measures whether your team has a clearly articulated flavor of B4T or is still running on vague intentions. Unarticulated philosophy doesn't stay neutral; it drifts toward whatever is easiest, and team members quietly diverge until a conflict reveals the gap.",
    prosCons: {
      up: [
        "Early ambiguity leaves room to learn before locking positions",
        "Over-defined philosophy can become rigidity in a shifting context",
      ],
      down: [
        "Shared language prevents the slow divergence that splits teams",
        "Clear philosophy makes hiring, funding, and partnership decisions fast",
        "You can't evaluate the business's mission success against a vague target",
      ],
    },
  },

  "product-love": {
    name: "Product love",
    description:
      "Measures whether you love the quality and beauty of what you sell or find it merely utilitarian. Craft-love sustains motivation through the grind years and shows up in quality that customers notice; utilitarian products get utilitarian effort.",
    prosCons: {
      up: [
        "Loving the craft makes excellence natural rather than forced",
        "Product passion is contagious to staff and customers alike",
      ],
      down: [
        "Strategic product choice can trump personal taste for good reasons",
        "Over-attachment to craft can resist necessary pivots",
      ],
    },
  },
  visibility: {
    name: "Local visibility",
    description:
      "Measures how much of your business's daily operations — office work, service delivery, product creation — happens in front of local people. Visible daily work makes you legible and familiar to the community; low-visibility models trade that presence for privacy and flexibility.",
    prosCons: {
      up: [
        "Visible work answers 'what do you actually do?' before it's asked",
        "Daily public presence generates organic relationships no strategy can",
      ],
      down: [
        "Low-profile models suit high-surveillance contexts",
        "Export and online businesses can serve the mission without the exposure",
      ],
    },
  },
};

export const LEVERS: Lever[] = BASE.map((l) => ({ ...l, ...META[l.id] }));

export const CATEGORIES: Category[] = [
  "Environmental",
  "Personal",
  "Business",
  "Transformational",
];

export const CATEGORY_BLURBS: Record<Category, string> = {
  Environmental:
    "The base layer. Mostly fixed once you've chosen a context — this is the intensity floor you build everything on.",
  Personal: "Your experience, gifting, motivation, and support structures.",
  Business: "The model itself — scale, capital, complexity, cash, customers.",
  Transformational: "Team, target group, and the machinery of impact.",
};
