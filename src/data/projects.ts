/**
 * Completed and ongoing work, in one fixed evidence template.
 * Text is adapted from the November 2026 research statement and CV.
 * A field is left out when those documents do not support it.
 */
import type { Status } from './program';
import { photos, type SitePhoto } from './photos';

export type Artifact = { label: string; href?: string };

export type FigureKey = 'session' | 'vision' | 'layers' | 'survey' | 'segment';

export type Project = {
  id: string;
  title: string;
  /** Two or three words, for the index of figures. */
  short: string;
  status: Status;
  where: string;
  question: string;
  contribution: string;
  system?: string;
  result: string;
  next?: string;
  /** What the work shows beyond its own setting. Shown as "What carries over". */
  carries?: string;
  artifacts: Artifact[];
  /** Optional. Each photo must have a row in MEDIA-RIGHTS.md. */
  photos?: SitePhoto[];
  /**
   * Optional interactive figure, drawn for this site (see src/components/figures).
   * A figure states only what a published paper reports. Unpublished work gets no figure of its details.
   */
  figure?: FigureKey;
};

export const projects: Project[] = [
  {
    id: 'multimodal-assembly',
    short: 'Cognitive-load study',
    title: 'Multimodal cognitive-load assessment in sequential assembly: a feasibility study',
    status: 'published',
    where: 'IISE Annual Conference 2025',
    question:
      'Can wearable physiology, station telemetry and self-report together track an operator’s cognitive load during assembly, and does the format of work instructions change it?',
    contribution: 'I designed and ran the study, and I am first author of the paper.',
    system:
      'A three-station sequential assembly line. I recorded wearable physiological signals (Empatica E4 and EmotiBit), station completion times and errors, and NASA-TLX ratings, under paper-based and tablet video instructions.',
    // Wording agreed with the owner. Check with the owner before adding further results.
    result:
      'In this feasibility study, video instructions shortened completion time for a novice operator and changed little for an experienced one. That suggests expertise moderates the effect, and that instruction format is a practical lever a plant can control. It is a feasibility result, not a general finding: it shows that physiological signals, station timing and self-report can be recorded together across a three-station line.',
    next: 'My dissertation extends this line across multi-station manual assembly, pairing motion-robust physiological sensing, station vision and workstation telemetry to evaluate adaptive digital work instructions.',
    artifacts: [{ label: 'Paper: Proceedings of the IISE Annual Conference & Expo 2025, pp. 1–6' }],
    photos: [photos.iiseSpeaking, photos.iiseTalk],
    figure: 'session',
  },
  {
    id: 'visual-framework',
    short: 'Camera framework',
    title: 'A non-contact visual framework for operator strain',
    status: 'published',
    where: 'Manufacturing Letters, 2024 (NAMRC 52)',
    question: 'Can a plant read signs of operator strain without wearables, on the edge hardware it already has?',
    contribution: 'I developed the framework, and I am first author of the paper.',
    system:
      'An IIoT-enabled dual-camera setup that combines facial-expression and body-posture recognition.',
    // A framework paper: it proposes and argues. It does not report a validation study.
    result:
      'The paper proposes a framework that maps affective and ergonomic indicators to line-level responses such as break scheduling, line balancing, procedure updates and targeted training. It argues that these cues can be processed on edge infrastructure plants already deploy, and explains why vision alone needs multimodal fusion under occlusion.',
    next: 'That limit led to the multimodal study above.',
    artifacts: [{ label: 'Paper: doi:10.1016/j.mfglet.2024.09.162', href: 'https://doi.org/10.1016/j.mfglet.2024.09.162' }],
    // The paper's own Fig. 1 shows this line, a year before this photo.
    photos: [photos.assemblyLine],
    figure: 'vision',
  },
  {
    id: 'production-model',
    short: 'Production system',
    title: 'From one operator to the production system',
    status: 'ongoing',
    where: 'Dissertation research',
    question: 'How does an estimate of one operator’s load enter a model of the whole line?',
    contribution:
      'I model operator cognitive load, stress and fatigue in state-space form across coupled assembly stations, as a function of task demand, instruction format, practice and line disturbances.',
    result:
      'The formulation was the subject of my comprehensive examination (passed Fall 2024) and is the core of my dissertation, “Estimating and Modeling Operator Cognitive Load Across Stations in Manual Assembly: A Multimodal State-Space Approach.” It builds on the multi-layer value-stream mapping framework I co-authored.',
    artifacts: [
      {
        label: 'Framework it builds on: doi:10.1016/j.mfglet.2025.06.023',
        href: 'https://doi.org/10.1016/j.mfglet.2025.06.023',
      },
    ],
    // The figure shows the published framework this work builds on, never the unpublished model itself.
    figure: 'layers',
  },
  {
    id: 'pecan',
    short: 'Pecan processing',
    title: 'Smart pecan processing: sensing on industrial machinery',
    status: 'published',
    where: 'USDA-supported project, 2021–2025',
    question: 'What does it take to instrument legacy industrial equipment and optimize it with data?',
    contribution:
      'I led the Cracking sub-team for four years. I instrumented industrial cracking machinery with high-speed imaging and process sensors, ran factorial process-optimization experiments, and led multimodal data curation and ablation analysis.',
    result:
      'A survey of 53 members of the pecan industry identified moisture conditioning and cracking efficiency as bottlenecks. A co-authored journal manuscript on the end-to-end cracking system is under review. This work grounds my human-centered research in real industrial hardware.',
    artifacts: [
      { label: 'Survey paper: doi:10.1115/DETC2023-117157', href: 'https://doi.org/10.1115/DETC2023-117157' },
      { label: 'Journal manuscript under review at Applied Food Research' },
    ],
    photos: [photos.pecanSymposium],
    figure: 'survey',
  },
  {
    id: 'computer-vision',
    short: 'Computer vision',
    // The owner asked for this paper to speak for computer-vision ability in general, whatever the use case.
    title: 'Computer vision, whatever the use case',
    status: 'published',
    where: 'Skin Research and Technology, 2021 · from my M.Sc. thesis',
    question: 'Can a region be outlined in an image when there are no labelled examples to learn from?',
    contribution:
      'Second author. With the first author I developed the method and its software, ran the analysis, made the figures and wrote the first draft.',
    system:
      'A two-layer stack ensemble. Four U-Net-style networks each learn one colour view of the image without labels. Adaptive thresholding, K-means and region growing then segment their outputs, and a consensus step merges all the results.',
    result:
      'On 877 photographs from 21 patients, the method localized vitiligo lesions with 97% accuracy, 98% sensitivity, 96% specificity and a Dice index of 97%, ahead of the methods it was compared with.',
    carries:
      'The paper is about skin images, but its core is general: colour views, networks that learn without labels, classical segmentation and a consensus step. The figure above runs that idea on three unrelated pictures. I bring the same practice to camera-based sensing on the assembly line.',
    artifacts: [
      { label: 'Paper: doi:10.1111/srt.12920', href: 'https://doi.org/10.1111/srt.12920' },
      { label: 'PubMed record', href: 'https://pubmed.ncbi.nlm.nih.gov/32662570/' },
    ],
    figure: 'segment',
  },
];
