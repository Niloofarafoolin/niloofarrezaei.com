/**
 * Teaching and mentoring content, adapted from the November 2026 teaching and advising statement and CV.
 */

export const teaching = {
  title: 'Teaching engineering systems with hardware, real data, and the people inside them',
  philosophy: [
    'Engineering students learn best when every model they build describes a real system with real people inside it. A line-balancing solution assigns work to operators. An assembly-fixture choice determines how many motions a technician repeats each shift. A noisy sensor stream triggers a decision an engineer must defend with evidence.',
    'My teaching connects quantitative fundamentals (modeling, statistics, instrumentation and production-system analysis) directly to physical hardware, imperfect data and human factors.',
  ],
  principles: [
    {
      title: 'Decisions before derivations, grounded in real sensor logs',
      text: 'Each topic opens with a concrete engineering decision, such as where to place buffer capacity on an unbalanced line or how to separate fixture drift from operator overload, before the mathematics that resolves it. Assignments use real datasets from instrumented assembly stations and processing machinery, so students meet missing timestamps, sensor noise and calibration firsthand.',
    },
    {
      title: 'Human factors as an engineering constraint, and AI as a tool that must be checked',
      text: 'Ergonomic load, cognitive workload and worker privacy appear inside quantitative design problems alongside throughput and cost, not in a separate lecture. Students may use AI coding and writing assistants openly on designated assignments, provided they document their workflow, verify every output against first-principle bounds or hand calculations, and explain where an automated output failed.',
    },
    {
      title: 'Clear expectations and continuous assessment',
      text: 'I completed my B.S. and M.S. in Iran before starting a Ph.D. in a new academic system and a second language, so I design courses in which effort and reasoning, not insider familiarity, predict success. I define notation explicitly, present ideas in several representations, post rubrics when assignments are released, build revision opportunities into major projects, and rotate technical roles so every student works with both hardware and analysis.',
    },
  ],
  course: {
    role: 'Co-Instructor, with Dr. Jaime A. Camelio',
    title: 'MCHE 4440: Design and Control of Production Systems',
    meta: 'Fall 2025 · University of Georgia · upper-level undergraduate elective, about 42 students',
    points: [
      'Co-designed and delivered two 75-minute lectures on facility layout, Systematic Layout Planning and digital manufacturing.',
      'Wrote homework and exam problems, graded with rubrics I developed, and coordinated guest speakers and accommodations.',
      'Built and ran short comprehension quizzes embedded in the slides across regular class sessions, with 33 to 37 student responses per session, plus a mid-semester feedback survey with 22 responses.',
    ],
    example:
      'When a live layout check showed students computing material-flow totals correctly while confusing relationship charts with physical block-layout constraints, we paused to work a paired aisle-and-bottleneck counterexample before moving on.',
  },
  earlier:
    'Undergraduate Teaching Assistant in Industrial Engineering, Islamic Azad University, Arak (2012–2014). Supported problem sessions and grading in Maintenance Planning and Quality Management.',
  canTeach: {
    undergraduate: [
      'Production and Manufacturing Systems',
      'Human Factors and Ergonomics',
      'Facility Layout',
      'Statistical Quality Control',
      'Senior Capstone Design',
    ],
    graduate: [
      'Smart Manufacturing Systems',
      'Human-Robot Collaboration and Cognitive Ergonomics',
      'Multimodal Sensor Analytics',
    ],
    proposed: 'Human-Centered Smart Manufacturing, a graduate elective I will propose.',
  },
  mentoring: {
    summary:
      'Research mentoring is where I have taught most consistently: 25 students across B.S., M.S. and Ph.D. levels over five years at UGA.',
    groups: [
      {
        when: '2021–2025',
        what: 'USDA Smart Pecan Processing, Cracking sub-team',
        detail:
          'As graduate lead I mentored six undergraduates, one M.S. student and two first-year Ph.D. students in experimental design, sensor calibration, laboratory safety, data collection and technical reporting.',
      },
      {
        when: '2022–2023',
        what: 'Price Industries Innovation Factory',
        detail: 'Mentored four undergraduate researchers on laboratory instrumentation and computer-vision prototyping.',
      },
      {
        when: '2023–2024',
        what: 'Capstone Design, co-supervised with Dr. Luis Eduardo Izquierdo',
        detail:
          'Co-supervised a four-student senior design team, sponsored by SMI Composites, on an Automated Guided Vehicle concept to reduce high-risk manual material transport on the plant floor.',
      },
      {
        when: 'Fall 2025–present',
        what: 'Innovation Factory VIPR (Vertically Integrated Projects in Research)',
        detail:
          'Mentored eight undergraduates across three consecutive semesters on computer-vision and wearable-sensing projects, guiding one team to a poster at the Spring 2026 UGA CURO Symposium.',
      },
    ],
    advising:
      'In my lab, new members will complete a structured onboarding sequence in sensing, data quality, safety and human-subject ethics, work from reproducible written protocols, and agree on contribution-based authorship criteria and milestones when a project starts. Weekly meetings will weigh ideas on the strength of the evidence, not seniority. For undergraduates and for international or first-generation graduate students, I will make academic and industry pathways explicit.',
  },
} as const;
