/**
 * Publications, exactly as listed in the November 2026 CV.
 * Manuscripts "in preparation" are deliberately not listed here; they stay in the CV PDF.
 *
 * Wording rules (checked 21 Nov 2026 against the papers' public records):
 * - A takeaway never claims more than the paper does. Framework papers "propose"; the 2025 IISE paper is a feasibility study.
 * - A manuscript under review is never called accepted or forthcoming, and its tracking number is not shown.
 * - `openAccess` is set only when the publisher's own record, or the first page of the published PDF, carries an open license.
 * - The papers' PDFs are never hosted here. Link to the publisher instead.
 */
import type { Status } from './program';

export type Author = { name: string; me?: boolean };

export type PublicationGroup = 'journal' | 'namrc' | 'proceedings' | 'review';

export type Publication = {
  id: string;
  group: PublicationGroup;
  authors: Author[];
  year: number | null;
  title: string;
  venue: string;
  detail?: string;
  doi?: string;
  status: Status;
  role: string;
  takeaway: string;
  /** Shown on the home page. */
  selected?: boolean;
  /** Anchor of the matching project on the Research page. */
  project?: string;
  /** Anchor of this paper's interactive figure on the Research page. */
  figure?: string;
  /** Other official records of the same paper, such as its PubMed entry. */
  links?: { label: string; href: string }[];
  /** The open license on the publisher's record, when there is one. */
  openAccess?: string;
  /** Citation for reference managers, built from the publisher's record. Shown on the Publications page. */
  bibtex?: string;
};

export const groupTitles: Record<PublicationGroup, string> = {
  journal: 'Peer-reviewed journal article',
  namrc: 'Peer-reviewed conference papers published in Manufacturing Letters (SME NAMRC)',
  proceedings: 'Peer-reviewed conference proceedings',
  review: 'Manuscript under review',
};

export const groupOrder: PublicationGroup[] = ['namrc', 'proceedings', 'journal', 'review'];

const me: Author = { name: 'Rezaei, N.', me: true };

export const publications: Publication[] = [
  {
    id: 'mfglet-2025',
    group: 'namrc',
    authors: [{ name: 'Heydarzade, A.' }, me, { name: 'Vaezi, S. A.' }, { name: 'Camelio, J. A.' }],
    year: 2025,
    title:
      'Multi-layer multi-variable value stream mapping: A comprehensive framework across operational, environmental, and social layers with integrated KPIs interrelationships',
    venue: 'Manufacturing Letters',
    detail: '44, 184–194. 53rd SME North American Manufacturing Research Conference (NAMRC 53).',
    doi: '10.1016/j.mfglet.2025.06.023',
    status: 'published',
    role: 'Second author',
    takeaway:
      'A value-stream mapping framework that links operational, environmental and social KPIs. My state-space production model builds on it.',
    selected: true,
    project: 'production-model',
    figure: 'fig-layers',
    // Crossref and OpenAlex both list this license for the published version.
    openAccess: 'CC BY-NC-ND 4.0',
    bibtex: String.raw`@article{heydarzade2025mlmvvsm,
  author  = {Heydarzade, Ayoub and Rezaei, Niloofar and Vaezi, Seyed Alireza and Camelio, Jaime A.},
  title   = {Multi-layer multi-variable value stream mapping: A comprehensive framework across operational, environmental, and social layers with integrated {KPIs} interrelationships},
  journal = {Manufacturing Letters},
  volume  = {44},
  pages   = {184--194},
  year    = {2025},
  note    = {53rd SME North American Manufacturing Research Conference (NAMRC 53)},
  doi     = {10.1016/j.mfglet.2025.06.023}
}`,
  },
  {
    id: 'mfglet-2024',
    group: 'namrc',
    authors: [me, { name: 'Vaezi, S. A.' }, { name: 'Camelio, J. A.' }],
    year: 2024,
    title:
      'Decoding the silent language: A framework for advanced visual emotion recognition to enhance worker well-being on IIoT-enabled manufacturing',
    venue: 'Manufacturing Letters',
    detail: '41, 1357–1365. 52nd SME North American Manufacturing Research Conference (NAMRC 52).',
    doi: '10.1016/j.mfglet.2024.09.162',
    status: 'published',
    role: 'First author',
    takeaway:
      'An IIoT-enabled, non-contact dual-camera framework that combines facial-expression and body-posture recognition to inform line balancing, break scheduling and operator training.',
    selected: true,
    project: 'visual-framework',
    figure: 'fig-vision',
    // The first page of the published PDF reads "open access article under the CC BY-NC-ND license" (read 23 Nov 2026).
    // The registries still list the paper as closed, so the PDF is the basis.
    openAccess: 'CC BY-NC-ND 4.0',
    bibtex: String.raw`@article{rezaei2024decoding,
  author  = {Rezaei, Niloofar and Vaezi, Seyed Alireza and Camelio, Jaime A.},
  title   = {Decoding the silent language: A framework for advanced visual emotion recognition to enhance worker well-being on {IIoT}-enabled manufacturing},
  journal = {Manufacturing Letters},
  volume  = {41},
  pages   = {1357--1365},
  year    = {2024},
  note    = {52nd SME North American Manufacturing Research Conference (NAMRC 52)},
  doi     = {10.1016/j.mfglet.2024.09.162}
}`,
  },
  {
    id: 'iise-2025',
    group: 'proceedings',
    authors: [me, { name: 'Vaezi, S. A.' }, { name: 'Mahmoudi, H.' }, { name: 'Camelio, J. A.' }],
    year: 2025,
    title: 'Smart sensors, smarter workplaces: Multi-modal cognitive load assessment in Industry 4.0',
    venue: 'Proceedings of the IISE Annual Conference & Expo 2025',
    detail: 'pp. 1–6.',
    status: 'published',
    role: 'First author',
    // Wording agreed with the owner. Check with the owner before adding further results.
    takeaway:
      'A feasibility study that recorded wearable physiology, station timing and NASA-TLX ratings together on a three-station assembly line; tablet video instructions shortened completion time for a novice operator and changed little for an experienced one.',
    selected: true,
    project: 'multimodal-assembly',
    figure: 'fig-session',
    bibtex: String.raw`@inproceedings{rezaei2025smartsensors,
  author    = {Rezaei, Niloofar and Vaezi, Seyed Alireza and Mahmoudi, H. and Camelio, Jaime A.},
  title     = {Smart sensors, smarter workplaces: Multi-modal cognitive load assessment in {Industry 4.0}},
  booktitle = {Proceedings of the IISE Annual Conference \& Expo 2025},
  pages     = {1--6},
  year      = {2025}
}`,
  },
  {
    id: 'idetc-2023',
    group: 'proceedings',
    authors: [
      { name: 'Smith, L.' },
      { name: 'Bowen, M. B.' },
      me,
      { name: 'Mozaffar, F.' },
      { name: 'Rahmanpour, M.' },
      { name: 'Das, R. P.' },
      { name: 'Morkos, B.' },
    ],
    year: 2023,
    title: 'Industry’s take on challenges in the agricultural post-harvesting industry',
    venue:
      'Proceedings of the ASME 2023 International Design Engineering Technical Conferences and Computers and Information in Engineering Conference (IDETC/CIE 2023)',
    detail: 'Paper DETC2023-117157.',
    doi: '10.1115/DETC2023-117157',
    status: 'published',
    role: 'Third of seven authors',
    takeaway:
      // The paper's own words: 53 industry members in the pecan harvesting and post-harvesting industry.
      'A survey of 53 members of the pecan industry that identifies moisture conditioning and cracking efficiency as bottlenecks.',
    project: 'pecan',
    figure: 'fig-survey',
    bibtex: String.raw`@inproceedings{smith2023industrys,
  author    = {Smith, Logan and Bowen, Matthew B. and Rezaei, Niloofar and Mozaffar, Fatemeh and Rahmanpour, Mozhdeh and Das, Runu Proma and Morkos, Beshoy},
  title     = {Industry's take on challenges in the agricultural post-harvesting industry},
  booktitle = {Proceedings of the ASME 2023 International Design Engineering Technical Conferences and Computers and Information in Engineering Conference. Volume 2: 43rd Computers and Information in Engineering Conference (CIE)},
  address   = {Boston, Massachusetts, USA},
  publisher = {American Society of Mechanical Engineers},
  year      = {2023},
  note      = {Paper No. DETC2023-117157, V002T02A038},
  doi       = {10.1115/DETC2023-117157}
}`,
  },
  {
    id: 'srt-2021',
    group: 'journal',
    authors: [{ name: 'Khatibi, T.' }, me, { name: 'Ataei Fashtami, L.' }, { name: 'Totonchi, M.' }],
    year: 2021,
    title:
      'Proposing a novel unsupervised stack ensemble of deep and conventional image segmentation (SEDCIS) method for localizing vitiligo lesions in skin images',
    venue: 'Skin Research and Technology',
    detail: '27(2), 126–137.',
    doi: '10.1111/srt.12920',
    status: 'published',
    role: 'Second author. From my M.Sc. thesis.',
    project: 'computer-vision',
    figure: 'fig-segment',
    takeaway:
      'An unsupervised ensemble of deep and conventional image-segmentation methods that localizes vitiligo lesions in skin images.',
    links: [{ label: 'PubMed', href: 'https://pubmed.ncbi.nlm.nih.gov/32662570/' }],
    bibtex: String.raw`@article{khatibi2021sedcis,
  author  = {Khatibi, Toktam and Rezaei, Niloofar and Ataei Fashtami, Leila and Totonchi, Mehdi},
  title   = {Proposing a novel unsupervised stack ensemble of deep and conventional image segmentation ({SEDCIS}) method for localizing vitiligo lesions in skin images},
  journal = {Skin Research and Technology},
  volume  = {27},
  number  = {2},
  pages   = {126--137},
  year    = {2021},
  doi     = {10.1111/srt.12920}
}`,
  },
  {
    id: 'afres-review',
    group: 'review',
    authors: [
      { name: 'DeLoach, R.' },
      { name: 'Floyd, A. C.' },
      { name: 'Halloran, H.' },
      { name: 'Heydarzade, A.' },
      { name: 'Singh, A.' },
      me,
      { name: 'Valiate, B. K.' },
      { name: 'Wagner, B.' },
      { name: 'Morkos, B.' },
    ],
    year: null,
    title:
      'Comprehensive characterization of an end-to-end pecan cracking system for optimal crack quality assessment',
    venue: 'Applied Food Research',
    detail: 'Under review.',
    status: 'in-review',
    role: 'Co-author',
    takeaway: 'Characterizes an end-to-end pecan cracking system to assess crack quality.',
    project: 'pecan',
  },
];
