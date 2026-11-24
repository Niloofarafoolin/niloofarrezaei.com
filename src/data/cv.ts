/**
 * CV facts, exactly as in the owner's CV (the version of 24 November 2026).
 * Not on the site by design: phone number, referees, manuscripts in preparation.
 */

export const bio = [
  'I am a Ph.D. candidate in Engineering at the University of Georgia, with an emphasis in Electrical and Computer Engineering. I work in the Price Industries Innovation Factory, advised by Dr. Jaime A. Camelio, and expect to defend in Summer 2027.',
  'My research asks how production systems can account for the people who run them. I build sensing and modeling methods that make an operator’s cognitive load and fatigue measurable during assembly work, and I study how work instructions and production control should respond. I call this program Manufacturing Empathy.',
  'I came to this question as an industrial engineer. I earned a B.Sc. in Industrial Engineering from Islamic Azad University, Arak, and an M.Sc. in Industrial Engineering (Healthcare Systems Engineering) from Tarbiat Modares University in Tehran, where my thesis used image processing to assess vitiligo treatment. I also worked as an industrial engineer in Iran, running workflow time studies and production documentation.',
  'At UGA I spent four years leading the Cracking sub-team on a USDA-supported smart pecan processing project, instrumenting industrial machinery with high-speed imaging and process sensors. Production-systems training, hands-on work with industrial hardware, and sensing and computer vision are what my research program is built on.',
] as const;

/**
 * Third-person version for talk announcements and introductions. Just over 100 words.
 * Uses the surname instead of a pronoun, so a host can paste it unchanged.
 */
export const shortBio =
  'Niloofar Rezaei is a Ph.D. candidate in Engineering (Electrical and Computer Engineering emphasis) at the University of Georgia, advised by Dr. Jaime A. Camelio in the Price Industries Innovation Factory. Rezaei’s research program, Manufacturing Empathy, works to make an operator’s cognitive load and fatigue measurable during assembly work, using wearable physiology, computer vision and station telemetry, so that work instructions and production control can respond. Rezaei was first-listed member and presenter of the six-person UGA entry that won the 2025 SME Blue Sky Competition and David Dornfeld Manufacturing Vision Award, and sole-author winner of the 2025 NSF/ASME Student Design Essay Competition. Trained as an industrial engineer (B.Sc. and M.Sc.), Rezaei expects to defend in Summer 2027.';

export const education = [
  {
    degree: 'Ph.D. in Engineering, emphasis in Electrical and Computer Engineering',
    place: 'University of Georgia, College of Engineering, Athens, GA',
    when: 'Aug 2021 – Summer 2027 (expected)',
    notes: [
      'Dissertation: Estimating and Modeling Operator Cognitive Load Across Stations in Manual Assembly: A Multimodal State-Space Approach. Comprehensive Examination passed Fall 2024.',
      'Advisor: Dr. Jaime A. Camelio.',
      'Advisory committee: Dr. Beshoy Morkos, Dr. Hongyue Sun and Dr. Joshua D. Summers (The University of Texas at Dallas).',
    ],
  },
  {
    degree: 'M.Sc. in Industrial Engineering (Healthcare Systems Engineering)',
    place: 'Tarbiat Modares University, Tehran, Iran',
    when: 'Feb 2020',
    notes: [
      'Thesis: Assessing the Success of Vitiligo Treatment Based on Image Processing. Published in Skin Research and Technology, 2021.',
    ],
  },
  {
    degree: 'B.Sc. in Industrial Engineering (Planning and System Analysis)',
    place: 'Islamic Azad University, Arak Branch, Arak, Iran',
    when: 'Jul 2014',
    notes: ['Senior project: Industrial Cluster Development Model Based on Batch Production.'],
  },
] as const;

export const appointments = [
  {
    title: 'Graduate Research Assistant, Price Industries Innovation Factory',
    place: 'College of Engineering, University of Georgia',
    when: 'Aug 2021 – present',
    notes: [
      'Designed and executed a multimodal sequential-assembly feasibility study integrating wearable physiological sensors, cycle-time telemetry and NASA-TLX ratings under paper versus video work instructions.',
      'Formulated a state-space production model of operator cognitive load, stress and fatigue across multi-station assembly lines.',
      'Developed an IIoT-enabled, non-contact dual-camera framework combining facial-expression and body-posture recognition.',
      'Developing synchronized wearable, camera-vision and workstation-telemetry pipelines on the Innovation Factory assembly testbed to evaluate adaptive work instructions.',
    ],
  },
  {
    title: 'Graduate Research Assistant and Cracking Sub-Team Lead',
    place: 'USDA-ARS Smart Pecan Processing Project, University of Georgia',
    when: 'Aug 2021 – Aug 2025',
    notes: [
      'Led the Cracking sub-team for four years: instrumented industrial cracking machinery with high-speed imaging and process sensors, executed factorial process-optimization experiments, and led multimodal data curation and ablation analysis.',
      // The paper's own words: 53 industry members in the pecan harvesting and post-harvesting industry.
      'Co-authored an industry-wide survey of 53 members of the pecan industry.',
    ],
  },
] as const;

export const scholarships =
  'Certificate of IAAP-DC Scholarship, Iranian American Academics and Professionals, Washington, DC (2025). UGA Graduate School Conference Travel Grant for NAMRC 52 (2024).';

export type Talk = {
  kind: string;
  title: string;
  where: string;
  when: string;
  link?: { label: string; href: string };
};

export const presentations: Talk[] = [
  {
    kind: 'Invited webinar',
    title: 'Manufacturing Empathy: Sensorial AI for Rewriting Human-AI Collaboration',
    // The spaces around the bar do not break, so the two names stay on one line.
    where: 'Inaugural session of the NAMRI\u00a0|\u2060\u00a0SME Manufacturing Research Pulse Webinar Series',
    when: 'January 29, 2026',
    link: { label: 'Webinar page', href: 'https://app.webinar.net/MRvgYPrdA8r' },
  },
  {
    kind: 'Poster',
    title: 'The Sentient Factory: Cultivating Human Agency and Purpose in AI-Driven Manufacturing of 2040',
    where: 'ASME IDETC/CIE 2025, Anaheim, CA',
    when: 'August 2025',
  },
  {
    kind: 'Finalist oral presentation',
    title: 'Manufacturing Empathy: Sensorial AI for Rewriting Human-AI Collaboration',
    where: 'SME Blue Sky Competition, NAMRC 53, Greenville, SC',
    when: 'June 2025',
  },
  {
    kind: 'Oral presentation',
    title: 'Smart Sensors, Smarter Workplaces: Multi-Modal Cognitive Load Assessment in Industry 4.0',
    where: 'IISE Annual Conference & Expo, Atlanta, GA',
    when: 'June 2025',
  },
  {
    kind: 'Oral presentation',
    title: 'Decoding the Silent Language: Visual Emotion Recognition in Manufacturing',
    where: 'NAMRC 52, Knoxville, TN',
    when: 'June 2024',
  },
];

export const service = [
  {
    label: 'Peer review',
    text: 'Invited journal reviewer for the ASME Journal of Computing and Information Science in Engineering (2026). Invited technical paper reviewer for SME NAMRC 52 (2024, three papers) and NAMRC 54 (2026, six papers), with Outstanding Reviewer recognition at NAMRC 54.',
  },
  {
    label: 'Outreach',
    text: 'Active participant in statewide Georgia AIM (Artificial Intelligence in Manufacturing) coalition meetings and outreach events at UGA, Fall 2025 to present.',
  },
  {
    label: 'Memberships',
    text: 'SME, ASME, IISE and SWE.',
  },
  {
    label: 'Prior industry roles',
    text: 'Assistant Project Manager, Pars Ab Tadbir Consulting Engineering (Jul–Oct 2018). Junior Industrial Engineer, RailRoad Engineering Company (Jul 2016–Feb 2017).',
  },
] as const;

export const skills =
  'Python, MATLAB, R and C++. Multimodal physiological and visual signal processing. OpenCV and deep-learning computer vision. Statistical experimental design and state-space modeling. IRB human-subject study design.';
