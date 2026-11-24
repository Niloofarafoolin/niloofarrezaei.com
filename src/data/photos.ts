/**
 * Photos shown on the site. Every entry must also have a row in MEDIA-RIGHTS.md.
 * Captions state only what the owner has confirmed or what the owner's photos show.
 */
import type { ImageMetadata } from 'astro';
import namrc53 from '../assets/photos/namrc-53-conference-hall.jpg';
import poster from '../assets/photos/idetc-2025-poster.jpg';
import iiseTalk from '../assets/photos/iise-2025-talk.jpg';
import iiseSpeaking from '../assets/photos/iise-2025-talk-speaking.jpg';
import pecanSymposium from '../assets/photos/pecan-symposium.jpg';
import assemblyLine from '../assets/photos/assembly-line-2025.jpg';
import blueSkyTalk from '../assets/photos/recognition/bluesky-talk.jpg';
import blueSkyAnnouncement from '../assets/photos/recognition/bluesky-announcement.jpg';
import blueSkyTeam from '../assets/photos/recognition/bluesky-team.jpg';
import dornfeldGala from '../assets/photos/recognition/dornfeld-award-gala.jpg';
import essayGroup from '../assets/photos/recognition/essay-idetc-group.jpg';
import essaySlide from '../assets/photos/recognition/essay-slide-entry.jpg';
import iaapAnnouncement from '../assets/photos/recognition/iaap-announcement.jpg';
import reviewerAward from '../assets/photos/recognition/namrc54-reviewer-award.jpg';

export type SitePhoto = {
  src: ImageMetadata;
  alt: string;
  caption: string;
  /** Who to credit. Left out when the owner took the photo. */
  credit?: string;
  /** When it was taken, as shown beside the caption. */
  when?: string;
};

export const photos = {
  namrc53: {
    src: namrc53,
    alt: 'Niloofar Rezaei smiling in a conference hall, wearing a black Innovation Factory polo shirt and a lanyard. The stage screen behind shows the NAMRC 53 banner.',
    caption: 'At NAMRC 53 in Greenville, South Carolina, June 2025, the conference that hosted the Blue Sky Competition.',
  },
  poster: {
    src: poster,
    alt: 'Niloofar Rezaei standing beside a research poster titled “The Sentient Factory”, wearing a red University of Georgia polo shirt and a conference badge.',
    caption: 'With the poster for “The Sentient Factory” at ASME IDETC/CIE 2025, Anaheim, California, August 2025.',
  },
  iiseSpeaking: {
    src: iiseSpeaking,
    alt: 'Niloofar Rezaei speaking beside a lectern, gesturing toward a projected slide titled “Understanding Cognitive Load: The Mental Effort of Work”. Audience members are seen from behind.',
    caption: 'Presenting this study at the IISE Annual Conference & Expo, Atlanta, June 2025.',
  },
  iiseTalk: {
    src: iiseTalk,
    alt: 'Niloofar Rezaei at a lectern, pointing to a projected slide titled “Our Experiment: Simulating the Assembly Line”. Audience members are seen from behind.',
    caption: 'The same talk: the three-station experiment on screen.',
  },
  pecanSymposium: {
    src: pecanSymposium,
    alt: 'Niloofar Rezaei standing between two easels in a hotel corridor. One holds the symposium agenda. The other reads “Welcome, The American Pecan Promotion Board Research Symposium”.',
    caption: 'At the American Pecan Promotion Board Research Symposium in Chicago, July 2025, where our team presented its work.',
  },
  // The lab is named because another of the owner's photos shows this room with the lab's name on a screen.
  assemblyLine: {
    src: assemblyLine,
    alt: 'Six assembly workstations in a row. Each has an overhead camera, a screen showing work instructions, red parts bins and a stool.',
    caption: 'The six-station assembly line in the Price Industries Innovation Factory, with a camera and an instruction screen at each station. September 2025.',
  },
  // ---- Recognition, on the home page. Other people in these photos are never named. ----
  blueSkyTalk: {
    src: blueSkyTalk,
    when: 'June 2025',
    alt: 'Niloofar Rezaei speaking into a lectern microphone, wearing a red University of Georgia polo shirt and a conference lanyard.',
    caption: 'Presenting the finalist talk at NAMRC 53 in Greenville, South Carolina.',
    credit: 'Photo © Jason Loudermilk Photography',
  },
  blueSkyAnnouncement: {
    src: blueSkyAnnouncement,
    when: 'June 2025',
    alt: 'Eleven people in a row on a stage, most of them holding certificates, in front of a banner reading NAMRC 53 and MSEC 2025. Niloofar Rezaei is third from the right, in a red polo shirt.',
    caption: 'On stage at the Blue Sky announcement. I represented the UGA team.',
    credit: 'Photo © Jason Loudermilk Photography',
  },
  blueSkyTeam: {
    src: blueSkyTeam,
    when: 'June 2025',
    alt: 'Seven people standing in front of the NAMRC 53 and MSEC 2025 banner, five of them in red University of Georgia polo shirts. Niloofar Rezaei is third from the left.',
    caption: 'With the University of Georgia group at NAMRC 53.',
  },
  dornfeldGala: {
    src: dornfeldGala,
    when: 'October 2025',
    alt: 'Niloofar Rezaei, in a green dress, holds a glass trophy together with a man in a grey suit. Two more people in formal dress stand beside them, in front of an SME Fall Gala backdrop.',
    caption: 'Receiving the David Dornfeld Manufacturing Vision Award at the SME Fall Gala.',
    credit: 'Photo © Jason Loudermilk Photography',
  },
  essayGroup: {
    src: essayGroup,
    when: 'August 2025',
    alt: 'Fourteen people standing in a row in front of a screen that reads ASME IDETC-CIE 2025, Hilton Anaheim, Anaheim, California. Niloofar Rezaei is at the far right, in a red polo shirt.',
    caption: 'The group photo at ASME IDETC/CIE 2025 in Anaheim, California.',
  },
  essaySlide: {
    src: essaySlide,
    when: 'August 2025',
    alt: 'A line cut from a projected slide: Rezaei, Niloofar. The Sentient Factory: Cultivating Human Agency and Purpose in AI-Driven Manufacturing of 2040. University of Georgia.',
    caption: 'My entry on the competition slide.',
  },
  iaapAnnouncement: {
    src: iaapAnnouncement,
    when: '2025',
    alt: 'A projection screen that reads 2025 Cycle, Niloofar Rezaei, in Engineering (Electrical and Computer Engineering), University of Georgia. A woman in a red jacket speaks at a microphone in front of it.',
    caption: 'My name on screen at the announcement, which I joined online.',
  },
  reviewerAward: {
    src: reviewerAward,
    when: 'June 2026',
    alt: 'Six people stand in a row on a stage. The four in the middle hold dark award plaques marked NAMRI and SME. Niloofar Rezaei is third from the left, dressed in black.',
    caption: 'On stage at NAMRC 54 with the three other Outstanding Reviewers.',
    credit: 'Photo © Jason Loudermilk Photography',
  },
} satisfies Record<string, SitePhoto>;
