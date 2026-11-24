/**
 * Core site content, drawn from the November 2026 CV and faculty packet.
 * Every claim here must match those documents. Future work is never worded as a result.
 */

export type Status = 'published' | 'in-review' | 'ongoing' | 'direction';

export const statusLabel: Record<Status, string> = {
  published: 'Published',
  'in-review': 'In review',
  ongoing: 'Ongoing',
  direction: 'Research direction',
};

export const person = {
  name: 'Niloofar Rezaei',
  /** As the owner gave it on 22 Nov 2026. Capitals mark the stressed syllable. */
  pronunciation: 'nee-loo-FAR reh-zah-YEE',
  role: 'Ph.D. Candidate in Engineering',
  emphasis: 'Electrical and Computer Engineering emphasis',
  unit: 'College of Engineering',
  university: 'University of Georgia',
  /** The lab's official name, as on its own website and in the owner's CV. */
  lab: 'Price Industries Innovation Factory',
  labUrl: 'https://factory.uga.edu/',
  advisor: 'Dr. Jaime A. Camelio',
  defense: 'Defense expected Summer 2027',
  email: 'niloofar.rezaei@uga.edu',
  scholar: 'https://scholar.google.com/citations?user=ee-iN8cAAAAJ',
  linkedin: 'https://www.linkedin.com/in/niloofarezaei/',
  /** Path of the public CV PDF inside /public. Made by scripts/make-public-cv.py, never copied in by hand. */
  cvPdf: '/Niloofar_Rezaei_CV.pdf' as string | null,
} as const;

/** One switch: set `show` to false when the search ends. */
export const jobMarket = {
  show: true,
  label: '2026–27 job market',
  text: 'Defense expected Summer 2027. Seeking a tenure-track assistant professor position starting Fall 2027.',
} as const;

export const thesis = {
  statement: 'Factories measure their machines in detail and their people almost not at all.',
  turn: 'I study how to change that.',
  lede: 'Manufacturing Empathy, my research program, works to make an operator’s cognitive load and fatigue observable, uncertainty-calibrated and actionable in production systems, with privacy and operator agency as engineering requirements.',
  why: 'Cognitive load and fatigue sit directly upstream of assembly errors, rework, slow onboarding and injury risk.',
  how: 'Wearable physiology, computer vision and station telemetry, fused in state-space production models.',
} as const;

export const agenda = {
  title: 'Manufacturing Empathy',
  subtitle: 'Making operator state observable and actionable in advanced manufacturing.',
  overview: [
    'Advanced manufacturing has become very good at sensing machines and remains poor at sensing people. Spindle loads, cycle times and part counts stream into plant dashboards. The cognitive load and fatigue of the operators who assemble, inspect and supervise go unmeasured, although manual and hybrid assembly remain present in roughly 87% of manufacturing plants.',
    'Today plants rely on periodic ergonomic audits, post-task questionnaires such as NASA-TLX, and supervisor judgment. These tools are too slow and too coarse to guide minute-to-minute production decisions.',
    'Manufacturing Empathy works to make operator cognitive load and fatigue observable, uncertainty-calibrated and actionable variables in manufacturing systems, with privacy and operator agency treated as core engineering requirements.',
  ],
  gaps: [
    'Physiological workload measures degrade under two-handed manufacturing motion and unaligned time bases.',
    'Differences between workers are rarely represented inside unit-by-unit production models.',
    'Few studies connect real-time workload estimates to levers a plant can control without creating workplace surveillance.',
  ],
  sources: [
    'Sprovieri, J. (2024). New workstations improve ergonomics, efficiency. ASSEMBLY Magazine. Source of the 87% figure.',
    'Tran, T.-A., et al. (2023). Heart rate variability measurement to assess acute work-content-related stress in manufacturing. IEEE Trans. Syst., Man, Cybern.: Syst., 53(11), 6685–6692.',
    'Katiraee, N., et al. (2021). Consideration of workers’ differences in production systems modelling and design. Int. J. Prod. Res., 59(11), 3237–3268.',
  ],
} as const;

export type Thrust = {
  number: string;
  question: string;
  title: string;
  approach: string;
  firstProject: string;
  status: Status;
};

/** The three thrusts of the faculty research agenda, each posed as the question the research statement asks. */
export const thrusts: Thrust[] = [
  {
    number: '01',
    question:
      'Which components of cognitive load and fatigue can be estimated reliably during real assembly work, and with what uncertainty?',
    title: 'Uncertainty-calibrated, privacy-preserving estimation of operator state',
    approach:
      'My lab will fuse non-contact vision, wearable physiology and process telemetry. We will quantify estimation uncertainty so downstream controllers know when an estimate is unreliable under occlusion or motion, and benchmark camera-plus-process subsets against full physiological baselines on operators unseen during training.',
    firstProject:
      'An openly documented multi-station assembly dataset that benchmarks single-modality and fused workload estimators across task complexity, pacing and operator experience.',
    status: 'direction',
  },
  {
    number: '02',
    question: 'How should a production cell adapt when it perceives rising operator strain?',
    title: 'Workload-aware production control and collaborative automation',
    approach:
      'Building on my state-space formulation, we will design and test workload-aware line balancing, adaptive pacing and density of work instructions, and adjustable human-robot task allocation. Robot interaction timing and pauses serve as passive ergonomic indicators, and the operator keeps an explicit override.',
    firstProject:
      'A controlled comparison of fixed versus uncertainty-gated task allocation between a technician and a collaborative robot, evaluating cycle time, quality, workload and operator trust together.',
    status: 'direction',
  },
  {
    number: '03',
    question: 'How can human-centered sensing operate on shop floors without becoming surveillance?',
    title: 'Edge-first industrial deployment and workforce onboarding',
    approach:
      'Extending my USDA equipment-retrofitting experience and my participation in Georgia AIM outreach, we will build edge-only station architectures that process raw video and biosignals locally, retain no raw footage, and share only de-identified aggregate indicators.',
    firstProject:
      'A shop-floor pilot with a small or mid-sized manufacturer that evaluates adaptive digital work instructions for new-hire onboarding and measures voluntary operator acceptance.',
    status: 'direction',
  },
];

export const fiveYearPlan = {
  phases: [
    {
      period: 'Years 1–2',
      items: [
        'Establish a modular human-centered assembly and collaborative-robot cell.',
        'Secure reusable IRB approval and recruit the first Ph.D. and undergraduate researchers.',
        'Publish the Thrust 1 fusion benchmarks.',
        'Submit proposals to NSF CMMI programs, including GOALI, and to CDC/NIOSH occupational safety programs.',
      ],
    },
    {
      period: 'Years 3–5',
      items: [
        'Run closed-loop human-robot adaptation studies (Thrust 2).',
        'Run industrial onboarding pilots (Thrust 3).',
        'Submit an NSF CAREER proposal that integrates smart-assembly research with learning-factory education.',
        'Pursue USDA and industry manufacturing partnerships.',
      ],
    },
  ],
  fit: 'Across Industrial and Systems Engineering, Mechanical Engineering, and Electrical and Computer Engineering, my lab will bridge multimodal human-factors sensing, statistical quality and production modeling, and collaborative automation.',
} as const;

export type Recognition = {
  /** The home page uses this to attach photos to an award. */
  key: 'blue-sky' | 'essay' | 'reviewer' | 'iaap';
  year: string;
  /** "Winner", "Award" or "Scholarship". */
  kind: string;
  /** The name of the award, without the kind. */
  name: string;
  /** Kind and name together, as the CV page lists it. */
  title: string;
  detail: string;
  /** A short name, for the award chips at the top of the home page. */
  short?: string;
  /** Official pages where a reader can confirm the award. */
  links?: { label: string; href: string }[];
  /** Shown on the home page only. The CV page already lists it under scholarships. */
  homeOnly?: boolean;
};

export const recognition: Recognition[] = [
  {
    key: 'blue-sky',
    year: '2025',
    kind: 'Winner',
    name: 'SME Blue Sky Competition and David Dornfeld Manufacturing Vision Award',
    title: 'Winner, SME Blue Sky Competition and David Dornfeld Manufacturing Vision Award',
    short: 'SME Blue Sky Competition',
    detail:
      'First-listed member and presenter of the six-person UGA entry, “Manufacturing Empathy: Sensorial AI for Rewriting Human-AI Collaboration.” NAMRI\u00a0|\u2060\u00a0SME, NAMRC 53.',
    links: [
      {
        label: 'Official results (SME)',
        href: 'https://www.sme.org/aboutsme/awards/blue-sky/david-dornfeld-manufacturing-vision-award/',
      },
      {
        label: 'Winning presentation (PDF)',
        href: 'https://www.sme.org/globalassets/sme.org/about/awards/blue-sky-competition/2025-dornfeld-presentations/niloofar-rezaei-corrected-order.pdf',
      },
    ],
  },
  {
    key: 'essay',
    year: '2025',
    kind: 'Winner',
    name: 'NSF/ASME Student Design Essay Competition, Graduate Category',
    title: 'Winner, NSF/ASME Student Design Essay Competition, Graduate Category',
    short: 'NSF/ASME Student Design Essay Competition',
    detail:
      'Sole author of “The Sentient Factory: Cultivating Human Agency and Purpose in AI-Driven Manufacturing of 2040.” ASME IDETC/CIE 2025.',
    links: [{ label: 'Official winners list', href: 'https://idetctravel.com/' }],
  },
  {
    key: 'reviewer',
    year: '2026',
    kind: 'Award',
    name: 'NAMRC 54 Outstanding Reviewer Award',
    title: 'NAMRC 54 Outstanding Reviewer Award',
    detail: 'One of four conference-wide Outstanding Reviewers. NAMRI\u00a0|\u2060\u00a0SME.',
  },
  {
    // From the CV: "Certificate of IAAP-DC Scholarship, Iranian American Academics and Professionals, Washington, DC (2025)".
    key: 'iaap',
    year: '2025',
    kind: 'Scholarship',
    name: 'IAAP-DC Scholarship',
    title: 'IAAP-DC Scholarship',
    detail: 'Iranian American Academics and Professionals, Washington, DC. 2025 cycle.',
    homeOnly: true,
  },
];

export const nav = [
  { href: '/research', label: 'Research' },
  { href: '/publications', label: 'Publications' },
  { href: '/teaching', label: 'Teaching' },
  { href: '/about', label: 'About' },
  { href: '/cv', label: 'CV' },
] as const;
