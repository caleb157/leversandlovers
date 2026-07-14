// The Levers of B4T — data model
// weight: 1 (barely matters) – 5 (dominant). All seeded at 3 pending tuning.
// Each option maps to an intensity score 0 (low) – 5 (high).

export type Category =
  | "Environmental"
  | "Personal"
  | "Business"
  | "Transformational";

export interface Option {
  label: string;
  intensity: number; // 0–5
}

export interface Lever {
  id: string;
  category: Category;
  name: string; // short display name for the board
  question: string;
  weight: 1 | 2 | 3 | 4 | 5;
  options: Option[];
  description: string; // what the lever measures and why it matters in B4T
  prosCons: { up: string[]; down: string[] }; // up = pull harder, down = ease off
}

type BaseLever = Omit<Lever, "name" | "description" | "prosCons">;
type LeverMeta = Pick<Lever, "name" | "description" | "prosCons">;

const BASE: BaseLever[] = [
  // ─────────────── ENVIRONMENTAL (the base layer / context score) ───────────────
  {
    id: "expat-proximity",
    category: "Environmental",
    question:
      "Do other expats live within reasonable distance for frequent personal contact?",
    weight: 3,
    options: [
      { label: "Yes — several within easy reach", intensity: 0 },
      { label: "A few, seen fairly often", intensity: 1 },
      { label: "Some, but contact takes planning", intensity: 3 },
      { label: "Very few — occasional contact at best", intensity: 4 },
      { label: "None — we are entirely alone", intensity: 5 },
    ],
  },
  {
    id: "lived-in-city",
    category: "Environmental",
    question: "Have you lived in the city you are building the business in?",
    weight: 3,
    options: [
      { label: "Yes, 2+ years", intensity: 0 },
      { label: "Yes, under 2 years", intensity: 1 },
      { label: "Extended stays, never lived there", intensity: 3 },
      { label: "Visited briefly", intensity: 4 },
      { label: "Never been", intensity: 5 },
    ],
  },
  {
    id: "foreigners-before",
    category: "Environmental",
    question: "Have other foreigners lived there before you?",
    weight: 2,
    options: [
      { label: "Yes — an established foreign presence", intensity: 0 },
      { label: "A handful live here now", intensity: 1 },
      { label: "One or two, some years ago", intensity: 3 },
      { label: "Passing foreigners only, never residents", intensity: 4 },
      { label: "We would be the first", intensity: 5 },
    ],
  },
  {
    id: "language-need",
    category: "Environmental",
    question:
      "How much local language does your specific business model require you to have?",
    weight: 4,
    options: [
      { label: "Almost none — English or translators suffice", intensity: 0 },
      { label: "Basic conversational", intensity: 1 },
      { label: "Solid conversational for daily operations", intensity: 3 },
      { label: "Professional working fluency", intensity: 4 },
      { label: "Native-level nuance (sales, negotiation, trust)", intensity: 5 },
    ],
  },
  {
    id: "bureaucracy",
    category: "Environmental",
    question:
      "Does the legal system in your country and city carry a lot of bureaucracy?",
    weight: 3,
    options: [
      { label: "No — light and predictable", intensity: 0 },
      { label: "Some paperwork, manageable", intensity: 1 },
      { label: "Real bureaucracy — slow but navigable", intensity: 3 },
      { label: "Heavy — permits and stamps dominate timelines", intensity: 4 },
      { label: "Crushing — arbitrary, opaque, and constant", intensity: 5 },
    ],
  },
  {
    id: "taxes",
    category: "Environmental",
    question: "Are taxes punitive for businesses in your context?",
    weight: 2,
    options: [
      { label: "No — reasonable and predictable", intensity: 0 },
      { label: "Noticeable but fair", intensity: 1 },
      { label: "Heavy enough to shape decisions", intensity: 3 },
      { label: "Punitive — formal businesses struggle", intensity: 4 },
      { label: "Confiscatory — pushes everyone informal", intensity: 5 },
    ],
  },
  {
    id: "ecosystem",
    category: "Environmental",
    question:
      "Is there a good business ecosystem in your location for your industry?",
    weight: 3,
    options: [
      { label: "Yes — strong ecosystem for my industry", intensity: 0 },
      { label: "Decent — most of what we need exists", intensity: 1 },
      { label: "Thin — key pieces missing", intensity: 3 },
      { label: "Weak — we import or build most things", intensity: 4 },
      { label: "None — we'd be building the ecosystem itself", intensity: 5 },
    ],
  },
  {
    id: "business-culture",
    category: "Environmental",
    question:
      "Does the culture in the city you work in support good business practices such as punctuality, hard work, honesty, and trust?",
    weight: 2,
    options: [
      { label: "Yes — punctuality, honesty, and trust are the norm", intensity: 0 },
      { label: "Mostly — occasional friction", intensity: 1 },
      { label: "Mixed — depends heavily on the person", intensity: 3 },
      { label: "Weak — verification needed on everything", intensity: 4 },
      { label: "No — unreliability is the operating norm", intensity: 5 },
    ],
  },
  {
    id: "proven-locally",
    category: "Environmental",
    question:
      "Is this business already working in your location — including expat-run examples in your country or region?",
    weight: 3,
    options: [
      { label: "Yes, expats run it successfully here", intensity: 0 },
      { label: "Locals run it successfully here", intensity: 1 },
      { label: "Proven in similar cities nearby", intensity: 3 },
      { label: "Works elsewhere, unproven here", intensity: 4 },
      { label: "Unproven anywhere", intensity: 5 },
    ],
  },
  {
    id: "location-strategic",
    category: "Environmental",
    question:
      "Does reaching your target group require moving your business location away from where you live, where your business type normally operates, or somewhere pleasant to be?",
    weight: 1,
    options: [
      { label: "No — they're where we naturally live and operate", intensity: 0 },
      { label: "Slightly — minor inconvenience", intensity: 1 },
      { label: "Somewhat — a commute or a less convenient district", intensity: 3 },
      { label: "Significantly — far from home or industry norms", intensity: 4 },
      { label: "Completely — a hard place, far from everything", intensity: 5 },
    ],
  },
  {
    id: "surveillance",
    category: "Environmental",
    question:
      "How intense is political/religious surveillance of foreigners and religious activity in your context?",
    weight: 2,
    options: [
      { label: "Open society, low scrutiny", intensity: 0 },
      { label: "Occasional attention to foreigners", intensity: 1 },
      { label: "Watched but tolerated", intensity: 3 },
      { label: "Active monitoring, informants plausible", intensity: 4 },
      { label: "Hostile state security environment", intensity: 5 },
    ],
  },
  {
    id: "repatriation",
    category: "Environmental",
    question:
      "How much friction exists in banking, forex, and moving money in and out of the country?",
    weight: 1,
    options: [
      { label: "Frictionless", intensity: 0 },
      { label: "Manageable paperwork", intensity: 1 },
      { label: "Slow and costly but workable", intensity: 3 },
      { label: "Heavy controls / informal economy norms", intensity: 4 },
      { label: "Severe capital controls or sanctions", intensity: 5 },
    ],
  },
  {
    id: "infrastructure",
    category: "Environmental",
    question:
      "How reliable are power, internet, and logistics infrastructure where you operate?",
    weight: 2,
    options: [
      { label: "Fully reliable", intensity: 0 },
      { label: "Occasional outages, easy redundancy", intensity: 1 },
      { label: "Regular disruption — redundancy required", intensity: 3 },
      { label: "Frequent failures — productivity often halved", intensity: 4 },
      { label: "Chronically unreliable", intensity: 5 },
    ],
  },
  {
    id: "family-fit",
    category: "Environmental",
    question:
      "How well does the location fit your family — schooling, spouse's life and visa, healthcare?",
    weight: 4,
    options: [
      { label: "Family thrives here / not applicable", intensity: 0 },
      { label: "Good fit with minor compromises", intensity: 1 },
      { label: "Workable with real, ongoing effort", intensity: 3 },
      { label: "Significant ongoing strain", intensity: 4 },
      { label: "Family is at breaking point", intensity: 5 },
    ],
  },
  {
    id: "visa",
    category: "Environmental",
    question: "How stable and renewable is your visa pathway?",
    weight: 2,
    options: [
      { label: "Long-term secure status", intensity: 0 },
      { label: "Renewable with confidence", intensity: 1 },
      { label: "Renewable with some uncertainty", intensity: 3 },
      { label: "Uncertain every cycle", intensity: 4 },
      { label: "Precarious / frequently denied class", intensity: 5 },
    ],
  },

  // ─────────────── PERSONAL ───────────────
  {
    id: "founded-before",
    category: "Personal",
    question: "Have you founded a business before?",
    weight: 2,
    options: [
      { label: "Yes, more than once", intensity: 0 },
      { label: "Yes, once", intensity: 1 },
      { label: "No, but I've been close to a founding team", intensity: 3 },
      { label: "No — some management experience only", intensity: 4 },
      { label: "No — completely new to business", intensity: 5 },
    ],
  },
  {
    id: "sales-experience",
    category: "Personal",
    question: "Have you done sales before?",
    weight: 3,
    options: [
      { label: "Yes — professional sales background", intensity: 0 },
      { label: "Yes — regular selling in past roles", intensity: 1 },
      { label: "Some — customer-facing but not selling", intensity: 3 },
      { label: "Very little", intensity: 4 },
      { label: "None", intensity: 5 },
    ],
  },
  {
    id: "industry-experience",
    category: "Personal",
    question: "Have you worked in your industry before?",
    weight: 3,
    options: [
      { label: "Yes — years in this exact industry", intensity: 0 },
      { label: "Yes — an adjacent industry", intensity: 1 },
      { label: "Some exposure, never worked in it", intensity: 3 },
      { label: "Hobby-level familiarity", intensity: 4 },
      { label: "None", intensity: 5 },
    ],
  },
  {
    id: "coach",
    category: "Personal",
    question: "Do you have a coach?",
    weight: 3,
    options: [
      { label: "Yes — regular rhythm with an experienced coach", intensity: 0 },
      { label: "Yes, but irregular", intensity: 1 },
      { label: "Informal mentors only", intensity: 3 },
      { label: "Looking, none yet", intensity: 4 },
      { label: "No coach and no plan for one", intensity: 5 },
    ],
  },
  {
    id: "advisors",
    category: "Personal",
    question: "Do you have advisors who know your specific industry?",
    weight: 3,
    options: [
      { label: "Yes — several who know my industry well", intensity: 0 },
      { label: "One or two solid advisors", intensity: 1 },
      { label: "General business advisors only", intensity: 3 },
      { label: "Occasional ad-hoc advice", intensity: 4 },
      { label: "No advisors at all", intensity: 5 },
    ],
  },
  {
    id: "skill-model-match",
    category: "Personal",
    question:
      "Does the bottleneck function of your business model (sales, operations, craft, finance) match your strongest gifting?",
    weight: 3,
    options: [
      { label: "Direct match — the bottleneck is my strength", intensity: 0 },
      { label: "Strong overlap", intensity: 1 },
      { label: "Adjacent — I can grow into it", intensity: 3 },
      { label: "Mismatch — I'll depend on hiring it", intensity: 4 },
      { label: "Mismatch and no plan to cover it", intensity: 5 },
    ],
  },
  {
    id: "hours-desired",
    category: "Personal",
    question:
      "Do you intend to work fewer hours in the business than a normal employee would (under ~30 hours/week)?",
    weight: 3,
    options: [
      { label: "Full working hours or more", intensity: 0 },
      { label: "Roughly normal hours", intensity: 1 },
      { label: "Slightly reduced (30–35 hours)", intensity: 3 },
      { label: "Under 30 hours", intensity: 4 },
      { label: "Well under 20 hours", intensity: 5 },
    ],
  },
  {
    id: "timeline",
    category: "Personal",
    question: "How long do you expect to spend building this business?",
    weight: 3,
    options: [
      { label: "7+ years", intensity: 0 },
      { label: "5–6 years", intensity: 1 },
      { label: "3–4 years", intensity: 3 },
      { label: "Around 2 years", intensity: 4 },
      { label: "Under 2 years", intensity: 5 },
    ],
  },
  {
    id: "paycheck-5yr",
    category: "Personal",
    question: "Do you intend to draw a paycheck from this business within 5 years?",
    weight: 3,
    options: [
      { label: "No — funded another way indefinitely", intensity: 1 },
      { label: "Yes, partial income eventually", intensity: 2 },
      { label: "Yes — meaningful income within 5 years", intensity: 3 },
      { label: "Yes — full support within 5 years", intensity: 4 },
      { label: "It must fully support us within 2–3 years", intensity: 5 },
    ],
  },

  // ─────────────── BUSINESS ───────────────
  {
    id: "capital",
    category: "Business",
    question: "How much capital do you have access to, relative to what the model needs?",
    weight: 3,
    options: [
      { label: "Fully capitalized with buffer", intensity: 0 },
      { label: "Enough to reach revenue", intensity: 1 },
      { label: "Tight — will demand discipline", intensity: 3 },
      { label: "Undercapitalized — thin runway", intensity: 4 },
      { label: "Severely undercapitalized", intensity: 5 },
    ],
  },
  {
    id: "partners",
    category: "Business",
    question: "Do you have a founding partner? (Assume alignment.)",
    weight: 4,
    options: [
      { label: "Yes — a full partner with complementary skills", intensity: 0 },
      { label: "Yes — a part-time or limited partner", intensity: 1 },
      { label: "No, but a strong support circle", intensity: 3 },
      { label: "No — solo with occasional help", intensity: 4 },
      { label: "No — completely solo", intensity: 5 },
    ],
  },
  {
    id: "known-customer",
    category: "Business",
    question:
      "Do you already have a large customer for your business who is not a family member? Or do you have a \"fishing hole\" at your disposal of hungry first fans — a set of customers or a network already primed and waiting to buy?",
    weight: 3,
    options: [
      { label: "Yes — a committed large customer", intensity: 0 },
      { label: "A primed network / fishing hole of first fans", intensity: 1 },
      { label: "Warm leads, nothing committed", intensity: 3 },
      { label: "A few contacts only", intensity: 4 },
      { label: "No — starting completely cold", intensity: 5 },
    ],
  },
  {
    id: "target-customer",
    category: "Business",
    question:
      "How well do you understand the needs of the customer you're serving — are you a target customer or end user yourself?",
    weight: 3,
    options: [
      { label: "Yes — I want or need this myself", intensity: 0 },
      { label: "Close — I've lived next to this need", intensity: 1 },
      { label: "Partially — I understand it secondhand", intensity: 3 },
      { label: "Barely — early research only", intensity: 4 },
      { label: "No — I'm learning the customer as I go", intensity: 5 },
    ],
  },
  {
    id: "donor-subsidy",
    category: "Business",
    question:
      "How is the business's revenue funded? This shapes cash flow and long-term sustainability.",
    weight: 3,
    options: [
      { label: "Fully donor-subsidized operations", intensity: 1 },
      { label: "Substantial donor support alongside revenue", intensity: 2 },
      { label: "Some donor-backed customers or aligned non-profits", intensity: 3 },
      { label: "Mostly market-driven, small donor cushion", intensity: 4 },
      { label: "No subsidies — directly market-driven", intensity: 5 },
    ],
  },
  {
    id: "ownership",
    category: "Business",
    question: "Do you own the business, or is it owned by someone else?",
    weight: 1,
    options: [
      { label: "Owned by someone else — their money, their problems", intensity: 0 },
      { label: "Minority stake", intensity: 1 },
      { label: "Shared with outside owners", intensity: 3 },
      { label: "Majority mine", intensity: 4 },
      { label: "Fully mine — my money and personal guarantee on the line", intensity: 5 },
    ],
  },
  {
    id: "franchise",
    category: "Business",
    question: "Is this a franchise/proven playbook, or your own idea?",
    weight: 2,
    options: [
      { label: "Franchise or proven playbook", intensity: 0 },
      { label: "Licensed or copied model with support", intensity: 1 },
      { label: "Adaptation of a proven model", intensity: 3 },
      { label: "Loosely inspired by existing models", intensity: 4 },
      { label: "Entirely my own idea", intensity: 5 },
    ],
  },
  {
    id: "innovation",
    category: "Business",
    question: "How innovative are you trying to be with the product or service?",
    weight: 3,
    options: [
      { label: "Branding tweak on a known offer", intensity: 0 },
      { label: "Meaningful improvement", intensity: 1 },
      { label: "New twist on the business model", intensity: 3 },
      { label: "Substantially new offer", intensity: 4 },
      { label: "Building a whole new category", intensity: 5 },
    ],
  },
  {
    id: "scale",
    category: "Business",
    question: "What scale are you aiming for?",
    weight: 3,
    options: [
      { label: "Micro — just us", intensity: 1 },
      { label: "Small team (under 10)", intensity: 2 },
      { label: "Solid SME (10–50)", intensity: 3 },
      { label: "Large (50–150)", intensity: 4 },
      { label: "Major employer (150+)", intensity: 5 },
    ],
  },
  {
    id: "supply-chain",
    category: "Business",
    question:
      "Do you understand your supply chain and have good access to it (vendors, service providers)?",
    weight: 2,
    options: [
      { label: "Yes — known suppliers, good access", intensity: 0 },
      { label: "Mostly known, minor gaps", intensity: 1 },
      { label: "Partial — key links untested", intensity: 3 },
      { label: "Weak understanding, patchy access", intensity: 4 },
      { label: "No real grip on the supply chain", intensity: 5 },
    ],
  },
  {
    id: "model-complexity",
    category: "Business",
    question:
      "How hard is your business model to execute? Could one person with a laptop and a piece of software run it, or does it take many vendors and programs, a complicated fee structure, and ten hires just to get off the ground?",
    weight: 2,
    options: [
      { label: "Simple — a laptop, a tool or two, easy to explain", intensity: 0 },
      { label: "Light — a few tools and vendors", intensity: 1 },
      { label: "Moderate — several vendors, tools, and early hires", intensity: 3 },
      { label: "Heavy — many vendors and real coordination load", intensity: 4 },
      { label: "Complex — many programs, complicated fees, a big team to launch", intensity: 5 },
    ],
  },
  {
    id: "cash-cycle",
    category: "Business",
    question:
      "How long is your cash conversion cycle — from spending money to getting paid?",
    weight: 3,
    options: [
      { label: "Days (cash business)", intensity: 0 },
      { label: "Weeks", intensity: 1 },
      { label: "1–2 months", intensity: 3 },
      { label: "2–3 months", intensity: 4 },
      { label: "3+ months", intensity: 5 },
    ],
  },
  {
    id: "physical-digital",
    category: "Business",
    question: "Is your deliverable physical or digital/service?",
    weight: 2,
    options: [
      { label: "Digital / pure service", intensity: 0 },
      { label: "Mostly service, light physical elements", intensity: 1 },
      { label: "Service with significant physical elements", intensity: 3 },
      { label: "Physical product", intensity: 4 },
      { label: "Physical — perishable, heavy, or regulated", intensity: 5 },
    ],
  },

  // ─────────────── TRANSFORMATIONAL ───────────────
  {
    id: "team",
    category: "Transformational",
    question: "Do you have a team for the transformational side of the work?",
    weight: 5,
    options: [
      { label: "Yes — an established team", intensity: 0 },
      { label: "One or two committed teammates", intensity: 1 },
      { label: "Forming — interest but no commitment yet", intensity: 3 },
      { label: "Hoping to recruit later", intensity: 4 },
      { label: "No team and no prospects", intensity: 5 },
    ],
  },
  {
    id: "target-educated",
    category: "Transformational",
    question:
      "Is your target people group educated and skilled in the work you're trying to do?",
    weight: 3,
    options: [
      { label: "Skilled and educated in this work", intensity: 0 },
      { label: "Mostly skilled — light training needed", intensity: 1 },
      { label: "Trainable with real effort", intensity: 3 },
      { label: "Major training investment required", intensity: 4 },
      { label: "We'd be a long-term training institution", intensity: 5 },
    ],
  },
  {
    id: "hire-majority",
    category: "Transformational",
    question:
      "Are you able to hire and employ mostly people from your target people group?",
    weight: 3,
    options: [
      { label: "Yes — the whole team can come from the target group", intensity: 0 },
      { label: "Mostly", intensity: 1 },
      { label: "About half", intensity: 3 },
      { label: "A minority only", intensity: 4 },
      { label: "No — barriers make it impractical", intensity: 5 },
    ],
  },
  {
    id: "locals-likeminded",
    category: "Environmental",
    question:
      "Are there like-minded locals available for sensitive or strategic roles, whom you know or can reach through your network?",
    weight: 3,
    options: [
      { label: "Yes — several, already known to us", intensity: 0 },
      { label: "A few, reachable through our network", intensity: 1 },
      { label: "One or two possibilities, untested", intensity: 3 },
      { label: "None known, but plausible to find", intensity: 4 },
      { label: "None — and none in reach", intensity: 5 },
    ],
  },
  {
    id: "giftedness",
    category: "Transformational",
    question:
      "Are you gifted for the kind of transformational work your model and team require?",
    weight: 3,
    options: [
      { label: "Yes — clearly gifted for this work", intensity: 0 },
      { label: "Mostly — a solid fit", intensity: 1 },
      { label: "Somewhat — growth required", intensity: 3 },
      { label: "A weak fit", intensity: 4 },
      { label: "No — the model needs gifts I don't have", intensity: 5 },
    ],
  },
  {
    id: "org-alignment",
    category: "Transformational",
    question:
      "Does your organization support your specific type and flavor of work, and are you in line with it?",
    weight: 2,
    options: [
      { label: "Yes — full support and alignment", intensity: 0 },
      { label: "Supportive with minor friction", intensity: 1 },
      { label: "Neutral / mixed signals", intensity: 3 },
      { label: "Skeptical — regular friction", intensity: 4 },
      { label: "No — misaligned or unsupported", intensity: 5 },
    ],
  },
  {
    id: "flavor-articulated",
    category: "Transformational",
    question:
      "Does your team have a clearly articulated flavor of B4T, or is it still vague?",
    weight: 2,
    options: [
      { label: "Clearly articulated and shared", intensity: 0 },
      { label: "Written down but not fully owned", intensity: 1 },
      { label: "Partially articulated", intensity: 3 },
      { label: "Discussed but never pinned down", intensity: 4 },
      { label: "Still vague", intensity: 5 },
    ],
  },

  {
    id: "product-love",
    category: "Business",
    question:
      "How much do you love what you sell and need it to be perfect — do you hold it to demanding standards, or is it utilitarian to you?",
    weight: 1,
    options: [
      { label: "Purely utilitarian — good enough is good enough", intensity: 0 },
      { label: "I care about quality but ship pragmatically", intensity: 1 },
      { label: "I hold it to high standards", intensity: 3 },
      { label: "I love it — flaws genuinely bother me", intensity: 4 },
      { label: "It must be perfect — I feel every flaw personally", intensity: 5 },
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
  "business-culture": {
    name: "Business culture",
    description:
      "Measures whether the surrounding culture supports good business practices — punctuality, hard work, honesty, and trust. Where these are weak, every hire, contract, and delivery carries a hidden management tax that the founder pays personally.",
    prosCons: {
      up: [
        "Appointments, deadlines, and agreements are treated as suggestions",
        "Verification and follow-up consume hours on every commitment",
        "Trust must be built from zero and guarded constantly",
      ],
      down: [
        "People show up when they say they will and do what they agreed",
        "Contracts and handshakes mostly hold without policing",
        "Management energy goes into growth, not enforcement",
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
      "Measures how dependable power, internet, and logistics are where you operate. Unreliable infrastructure forces you to buy redundancy — generators, backup links, buffer stock — which quietly inflates the capital the model needs. You also may need to account for days where productivity drops in half, or even completely.",
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

  "locals-likeminded": {
    name: "Like-minded locals",
    description:
      "Measures whether like-minded locals exist in your context — and are reachable through your network — for sensitive or strategic roles. This is a condition of the place more than a choice: without them, the most delicate parts of the work stay founder-dependent, capped at your capacity and your visa.",
    prosCons: {
      up: [
        "No like-minded locals exist yet, or none you can reach",
        "Every sensitive role rests on the founder indefinitely",
        "The work's continuity is tied entirely to your presence",
      ],
      down: [
        "Trusted locals are available for sensitive and strategic roles",
        "A local partner reads situations you would always misread",
        "The work can survive your departure",
      ],
    },
  },

  // ─── Personal ───
  "founded-before": {
    name: "Founder experience",
    description:
      "Measures whether you've built a business before. Like your context, this is a given, not a choice: a first venture means learning founding itself — pricing, hiring, firing, cash discipline — at the same time as a new culture and language.",
    prosCons: {
      up: [
        "Founding basics are being learned for the first time, in a foreign context",
        "Every pricing, hiring, and cash mistake is paid at full tuition",
        "Cash trouble is spotted late because the warning signs are unfamiliar",
      ],
      down: [
        "Years of expensive lessons are already compressed into instinct",
        "The founding playbook is familiar — only the context is new",
        "Trouble is recognized months earlier, while it's still cheap to fix",
      ],
    },
  },
  "sales-experience": {
    name: "Sales experience",
    description:
      "Measures whether you've sold before. Sales is the function most founders underestimate and the one no B4T business survives without — in the early years, the founder is the sales force, ready or not.",
    prosCons: {
      up: [
        "Selling is being learned on the job, in a second culture",
        "Revenue ramps slowly while the skill develops",
        "Rejection and negotiation drain more energy than they should",
      ],
      down: [
        "Prospecting, pitching, and closing are already muscle memory",
        "Revenue starts moving early because someone knows how to ask for it",
        "Cross-cultural selling builds on a solid home-market foundation",
      ],
    },
  },
  "industry-experience": {
    name: "Industry experience",
    description:
      "Measures whether you've worked in this industry before. Veterans know the margins, the failure modes, and the suppliers by name; outsiders buy that knowledge with time and mistakes.",
    prosCons: {
      up: [
        "Margins, failure modes, and supplier norms are all discovered by experience",
        "Credibility with customers and vendors must be earned from zero",
        "Whether the margins can support the mission is still an open question",
      ],
      down: [
        "The industry's expensive surprises are already known",
        "Credibility with suppliers and customers arrives on day one",
        "You already know what 'normal' costs, margins, and timelines look like",
      ],
    },
  },
  coach: {
    name: "Coaching",
    description:
      "Measures whether you have a coach — someone with permission to ask hard questions on a regular rhythm. B4T founders operate far from oversight, and unexamined drift in the business or the mission is the default, not the exception.",
    prosCons: {
      up: [
        "No regular outside voice examines your decisions or your drift",
        "Blind spots grow quietly until they surface as crises",
        "Isolation, authority, and stress accumulate with no release valve",
      ],
      down: [
        "A trusted voice asks the hard questions on a schedule",
        "Business and mission get honestly weighed by someone outside both",
        "Founder blind spots get caught while they're still small",
      ],
    },
  },
  advisors: {
    name: "Industry advisors",
    description:
      "Measures whether you can reach people who know your specific industry well enough to sanity-check your numbers and decisions. Generic business advice abounds; industry-specific counsel is what prevents pricing and sourcing mistakes.",
    prosCons: {
      up: [
        "Numbers and decisions go unchecked by anyone who knows the industry",
        "Five-figure mistakes happen that one phone call would have prevented",
        "The network into suppliers, customers, and hires must be built alone",
      ],
      down: [
        "Pricing and sourcing decisions get sanity-checked before they're expensive",
        "Advisors open doors to suppliers, customers, and hires",
        "Someone can tell you whether your plan is normal or naive",
      ],
    },
  },
  "skill-model-match": {
    name: "Skill-to-model match",
    description:
      "Measures whether the bottleneck function of your business model — sales, operations, craft, finance — matches your strongest gifting. Your gifting is largely fixed; when it mismatches the model's critical function, the machine runs permanently hot.",
    prosCons: {
      up: [
        "The business's make-or-break function is your weakest work",
        "Every critical day is spent outside your gifting — a burnout formula",
        "Covering the gap depends on hiring talent you may not find or afford",
      ],
      down: [
        "The bottleneck function is exactly where your strength lives",
        "Your best energy goes to the work that matters most",
        "Weaker functions can be hired or systematized at leisure",
      ],
    },
  },
  "hours-desired": {
    name: "Hours committed",
    description:
      "Measures the gap between the hours the business needs and the hours you intend to give it. Founders who plan under 30 hours a week — often to protect ministry time — are asking the business to grow on part-time fuel.",
    prosCons: {
      up: [
        "The business is asked to grow on part-time founder fuel",
        "Ambition and available hours pull in opposite directions",
        "Locals notice when the boss treats the business as a side project",
      ],
      down: [
        "The business gets the full working hours a real venture requires",
        "Growth expectations and founder input actually match",
        "Commitment is visible to staff, customers, and officials",
      ],
    },
  },
  timeline: {
    name: "Time horizon",
    description:
      "Measures how long you expect to spend building. Businesses in hard places take longer than at home, and transformational fruit takes longer still; a short horizon forces shortcuts in exactly the areas that can't be shortcut.",
    prosCons: {
      up: [
        "The plan needs results faster than trust and fluency can grow",
        "Shortcuts get forced in areas that punish shortcuts",
        "Local staff hold back from a leader they suspect is leaving soon",
      ],
      down: [
        "Trust, fluency, and profitability get the years they actually take",
        "Staff and partners invest because you're clearly staying",
        "Slow seasons are absorbed instead of triggering panic",
      ],
    },
  },
  "paycheck-5yr": {
    name: "Paycheck dependence",
    description:
      "Measures whether the business must pay you within five years. Needing income raises the pressure on every decision; the business has to work commercially on a clock, not just eventually.",
    prosCons: {
      up: [
        "The family's income rides on the business succeeding on schedule",
        "Slow quarters are felt at the dinner table",
        "Pressure pushes toward short-term revenue over right strategy",
      ],
      down: [
        "Income comes from elsewhere while the business finds its feet",
        "Slow-trust, long-cycle markets can be served with patience",
        "Strategic decisions aren't hostage to next month's rent",
      ],
    },
  },

  // ─── Business ───
  capital: {
    name: "Capitalization",
    description:
      "Measures your funding relative to what the model actually needs — including the buffer for the surprises hard contexts guarantee. Undercapitalization rarely kills a business outright; it forces the chain of desperate decisions that does.",
    prosCons: {
      up: [
        "Runway is tight and every surprise is a small crisis",
        "Decisions get made desperate — discounting, cutting corners, bad hires",
        "The visa delay, the raid, or the lost container has no financial shock absorber",
      ],
      down: [
        "The model is funded through to revenue with a real buffer",
        "Surprises are absorbed as costs, not emergencies",
        "Decisions stay strategic because nobody is panicking",
      ],
    },
  },
  partners: {
    name: "Founding partner",
    description:
      "Measures whether you carry the venture alone or with a partner (alignment assumed). A partner spreads the daily and emotional load; going solo keeps things lean and fast, which can be the right call for a simple model or an extreme setting — but it costs intensity.",
    prosCons: {
      up: [
        "Every decision, crisis, and absence lands on one person",
        "No complementary skill set covers your gaps",
        "The business stops when you stop — illness, visa runs, furlough",
        "Solo can still be right: lean, simple, fast-moving, no coordination overhead",
      ],
      down: [
        "The load — practical and emotional — is genuinely shared",
        "A partner covers the functions you're weakest in",
        "Someone minds the shop when life interrupts",
      ],
    },
  },
  "known-customer": {
    name: "Anchor customers",
    description:
      "Measures whether real buyers are already waiting — a large committed customer outside the family, or a \"fishing hole\": a set of customers or a network already primed to buy. Ready demand converts the riskiest assumption in the model (will anyone pay?) into a known fact.",
    prosCons: {
      up: [
        "Every customer must be found, convinced, and won cold",
        "Demand is a hope until the first strangers pay",
        "Marketing and sales consume the runway before revenue arrives",
      ],
      down: [
        "A committed customer or hungry network is waiting at launch",
        "Early revenue flows while others are still pitching",
        "First fans become the reference that unlocks the next ten customers",
      ],
    },
  },
  "target-customer": {
    name: "Customer understanding",
    description:
      "Measures how deeply you understand the needs of the customer you're serving. Founders who are their own target customer carry an instinctive feel for the product; others must build that understanding through research, conversation, and iteration.",
    prosCons: {
      up: [
        "The customer's real needs are learned by trial, error, and lost sales",
        "Product decisions are guesses filtered through secondhand reports",
        "Slow drift into irrelevance can go unnoticed for a long time",
      ],
      down: [
        "You want or need the product yourself — instinct comes built in",
        "Selling is authentic because you genuinely believe the pitch",
        "Product drift gets caught early because you'd feel it as a customer",
      ],
    },
  },
  "donor-subsidy": {
    name: "Revenue funding mix",
    description:
      "Measures how much donor money stands behind the business's revenue — none, some (donor-backed customers or mission-aligned non-profits), or direct subsidy. Donor funding lowers cash-flow intensity: the more of it, the less the market alone must carry. The trade is dependence on funding cycles outside your control.",
    prosCons: {
      up: [
        "The open market alone must carry every cost, on time, every month",
        "Slow seasons hit cash immediately — no cushion behind revenue",
        "Commercial pressure shapes every decision, for better and worse",
      ],
      down: [
        "Donor funds cushion cash flow and buy patience with slow markets",
        "The gap between launch and sustainability is bridged deliberately",
        "Lower cash pressure frees capacity for people and long-term work",
      ],
    },
  },
  ownership: {
    name: "Ownership stake",
    description:
      "Measures whose money and name are on the line. Owning the business means your capital and personal guarantee carry the risk — high intensity. Running someone else's business means someone else's money, someone else's problems.",
    prosCons: {
      up: [
        "Your savings and personal guarantee absorb every loss",
        "A bad year is a family financial event, not just a business one",
        "Walking away isn't an option you can afford",
      ],
      down: [
        "Someone else's capital carries the downside",
        "Failure costs you a job, not your savings",
        "Risk decisions can be made with a clear head",
      ],
    },
  },
  franchise: {
    name: "Model provenance",
    description:
      "Measures whether you're running a proven playbook or your own idea. A franchise or established model means the fundamental question — does this work? — is already answered; an original idea means answering it in a hard market.",
    prosCons: {
      up: [
        "The core question — does this even work? — is still unanswered",
        "Systems, pricing, and processes are invented as you go",
        "Every mistake is original because nobody wrote the manual",
      ],
      down: [
        "The playbook exists — execution is the only question",
        "Documented systems free founder attention for people and mission",
        "Support networks and benchmarks substitute for missing local ecosystems",
      ],
    },
  },
  innovation: {
    name: "Innovation ambition",
    description:
      "Measures how novel your product or service is trying to be. Every step past a proven offer adds market-education cost — and educating a market takes exactly the time, money, and energy that B4T contexts already tax heavily.",
    prosCons: {
      up: [
        "Customers must be taught what the product even is before they'll buy",
        "Innovation risk stacks on top of context risk — you carry both",
        "Feedback loops are slow because nothing comparable exists locally",
      ],
      down: [
        "Customers already understand and want what's being sold",
        "Energy goes into execution and people, not market education",
        "Demand is proven, so failure modes are operational, not existential",
      ],
    },
  },
  scale: {
    name: "Scale ambition",
    description:
      "Measures the size you're aiming for. Bigger employers create more jobs and more transformational surface area, but scale multiplies management load, capital needs, and — in sensitive contexts — visibility to the state.",
    prosCons: {
      up: [
        "Every ten employees adds a new tier of management complexity",
        "Capital needs and fixed costs grow ahead of revenue",
        "A high profile draws official attention in sensitive places",
      ],
      down: [
        "A small operation stays manageable by one or two people",
        "Low profile means low scrutiny",
        "Profitability can come before headcount",
      ],
    },
  },
  "supply-chain": {
    name: "Supply chain grip",
    description:
      "Measures whether you understand and can reliably access your supply chain — vendors, materials, service providers. In thin markets, a single unreliable supplier can idle the whole business, and alternatives may be a border away.",
    prosCons: {
      up: [
        "Key inputs depend on suppliers you don't yet know or trust",
        "A single vendor failure can idle the whole operation",
        "Import dependencies stack customs and forex risk onto daily operations",
      ],
      down: [
        "Suppliers are known, tested, and reachable",
        "Cost, quality, and delivery are predictable enough to promise customers",
        "Backup options exist when a vendor fails",
      ],
    },
  },
  "model-complexity": {
    name: "Execution complexity",
    description:
      "Measures how hard the model is to execute day to day. One person with a laptop and a single tool is one life; fifty vendors, twenty programs, a complicated fee structure, and ten hires just to launch is another. Complexity is permanent overhead — every moving part gets managed in a second language.",
    prosCons: {
      up: [
        "Many vendors, tools, and hires must work before the first sale",
        "The fee structure or offering takes real effort just to explain",
        "Every moving part is one more thing that breaks in a hard context",
      ],
      down: [
        "A laptop and a tool or two run the whole model",
        "Anyone can understand the offer in a sentence",
        "Staff could run it without you — the succession test passes",
      ],
    },
  },
  "cash-cycle": {
    name: "Cash cycle",
    description:
      "Measures the time between spending money and getting paid. Long cash-conversion cycles demand working capital and nerve; in economies with weak contract enforcement, a 90-day receivable is a hope, not an asset.",
    prosCons: {
      up: [
        "Months pass between paying costs and seeing revenue",
        "Receivables are collection gambles where courts are weak",
        "Cash pressure compounds every other stressor on the founder",
      ],
      down: [
        "Money comes in within days of going out",
        "Growth self-funds instead of borrowing against hope",
        "Shocks are survivable because cash is always near",
      ],
    },
  },
  "physical-digital": {
    name: "Physical vs digital",
    description:
      "Measures how physical your deliverable is. Physical products drag in supply chain, quality control, logistics, and working capital simultaneously — one lever that silently pulls four others with it.",
    prosCons: {
      up: [
        "Inventory, logistics, QC, and working capital all activate at once",
        "Customs, spoilage, and breakage are recurring line items",
        "Regulatory touchpoints multiply with every physical step",
      ],
      down: [
        "No inventory, no customs, no spoilage",
        "The business can start small and pivot fast",
        "Capital goes to people instead of stock",
      ],
    },
  },
  "product-love": {
    name: "Craft standards",
    description:
      "Measures how much you love what you sell and need it to be perfect. Loving your product and demanding high standards raises intensity — you have a little darling, and every compromise hurts. A utilitarian product ships when it's good enough.",
    prosCons: {
      up: [
        "Every flaw is felt personally — 'good enough' is never good enough",
        "Perfectionism slows shipping and inflates costs",
        "The product is a little darling that resists necessary compromises",
      ],
      down: [
        "Good enough ships on time and on budget",
        "Standards follow the customer's needs, not the founder's feelings",
        "Pivots don't have to fight sentiment",
      ],
    },
  },

  // ─── Transformational ───
  team: {
    name: "Transformational team",
    description:
      "Measures whether you have a team for the transformational side of the work, or whether the founder carries business and mission alone. Solo spiritual labor stacked on solo business labor is the classic B4T overload pattern.",
    prosCons: {
      up: [
        "One person carries the business all day and the mission all evening",
        "Only one gifting reaches only the people it naturally reaches",
        "Doctrine and strategy drift with nobody to check them",
      ],
      down: [
        "The mission keeps moving when the business consumes the founder",
        "Different giftings reach different people",
        "Shared discernment guards against solo drift",
      ],
    },
  },
  "target-educated": {
    name: "Workforce readiness",
    description:
      "Measures whether your target people group already has the education and skills your business needs. A skills gap converts your hiring plan into a training institution — noble, transformational, and very expensive.",
    prosCons: {
      up: [
        "Every hire needs long training before they're productive",
        "Training costs land exactly when the business is weakest",
        "Quality wobbles for years while skills develop",
      ],
      down: [
        "Hires are productive in weeks, not years",
        "Quality is dependable from early on",
        "Training budgets go to development, not survival",
      ],
    },
  },
  "hire-majority": {
    name: "Target-group hiring",
    description:
      "Measures whether you can actually employ mostly people from your target people group. If legal, linguistic, or skills barriers push hiring outside the community, the business can succeed while the strategy quietly fails.",
    prosCons: {
      up: [
        "Barriers force hiring outside the community you came to serve",
        "The deepest access B4T offers — daily work together — never materializes",
        "Business success and mission success quietly diverge",
      ],
      down: [
        "The team is drawn from the community itself",
        "Wages and daily relationships flow where the mission points",
        "Work becomes the natural context for everything else",
      ],
    },
  },
  giftedness: {
    name: "Transformational gifting",
    description:
      "Measures whether your gifting matches the kind of transformational work your model and team require. A model built around workplace discipleship needs a discipler; one built on community presence needs a connector.",
    prosCons: {
      up: [
        "The model demands ministry you're not naturally shaped for",
        "Forced ministry style drains rather than energizes",
        "The transformational engine depends on your weakest gear",
      ],
      down: [
        "The transformational work flows out of who you already are",
        "Ministry energizes rather than depletes",
        "The model and the person reinforce each other",
      ],
    },
  },
  "org-alignment": {
    name: "Org alignment",
    description:
      "Measures whether your sending organization supports your specific type and flavor of work, and whether you're genuinely in line with it. Misalignment surfaces at the worst times — funding reviews, member care crises, security incidents.",
    prosCons: {
      up: [
        "The org second-guesses the strategy at every review",
        "Friction with your own people is a chronic energy leak",
        "Crisis support falters because the org never understood the work",
      ],
      down: [
        "The org provides cover, care, and continuity you can't self-supply",
        "Reviews strengthen the work instead of relitigating it",
        "In a crisis, the people behind you actually understand what you do",
      ],
    },
  },
  "flavor-articulated": {
    name: "Articulated flavor",
    description:
      "Measures whether your team has a clearly articulated flavor of B4T or is still running on vague intentions. Unarticulated philosophy doesn't stay neutral; it drifts toward whatever is easiest, and team members quietly diverge until a conflict reveals the gap.",
    prosCons: {
      up: [
        "Each team member quietly carries a different definition of the work",
        "Hiring, funding, and partnership decisions wobble without a shared test",
        "The divergence surfaces as a conflict instead of a conversation",
      ],
      down: [
        "The team shares language for what the work is and isn't",
        "Decisions get made fast against a clear philosophy",
        "Mission success can actually be evaluated against a stated target",
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
