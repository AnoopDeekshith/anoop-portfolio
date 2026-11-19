import type { TeachingRole } from "./types";

const UCSC = "University of California, Santa Cruz";

/** Teaching / TA roles, newest first. The /teaching page renders these. */
export const teaching: TeachingRole[] = [
  {
    role: "Teaching Assistant",
    course: "TIM 170 — Communicating with Industry Professionals",
    department: "Technology & Information Management",
    institution: UCSC,
    term: "Fall 2026 – Present",
    current: true,
    scope: "Bi-weekly industry sessions · office hours · async support",
    highlights: [
      "Facilitate bi-weekly sessions connecting students with industry professionals across tech, semiconductor, and startup sectors.",
      "Run office hours and async support to guide students through assignments and project deliverables.",
      "Address student questions on technology adoption, market strategy, and the interplay of engineering and business decision-making.",
    ],
    topics: ["Industry speaker sessions", "Technology adoption", "Market strategy", "Project deliverables"],
  },
  {
    role: "Teaching Assistant",
    course: "PHYS 6N — General Physics Laboratory",
    department: "Physics",
    institution: UCSC,
    term: "Summer 2026",
    scope: "Independent lab instruction · all sessions",
    highlights: [
      "Independently instructed a hands-on physics laboratory — delivering all sessions, facilitating discussion, and owning instruction from running experiments through assessment.",
      "Guided students through measurement, data analysis, and scientific reasoning.",
      "Graded every lab report to a consistent rubric, with individualized feedback for each student.",
    ],
    topics: ["Lab instruction", "Measurement & data analysis", "Scientific reasoning", "Rubric-based grading"],
  },
  {
    role: "Teaching Assistant",
    course: "ASTR 3 — Planetary Systems",
    department: "Astronomy & Astrophysics",
    institution: UCSC,
    term: "Summer 2026",
    scope: "Online, synchronous course",
    highlights: [
      "Supported an introductory astronomy course delivered online and synchronously.",
      "Guided students through assignments and planetary-science material in real time.",
    ],
    topics: ["Online instruction", "Planetary science", "Assignment support"],
  },
  {
    role: "Teaching Assistant",
    course: "TIM 170 — Communicating with Industry Professionals",
    department: "Technology & Information Management",
    institution: UCSC,
    term: "Spring 2026",
    scope: "Industry sessions · office hours · grading",
    highlights: [
      "Served as TA for a prior offering of the course, facilitating sessions with industry professionals.",
      "Held office hours and graded assignments and project deliverables.",
    ],
    topics: ["Industry speaker sessions", "Office hours", "Grading"],
  },
  {
    role: "Teaching Assistant",
    course: "TIM 172B — Management of Technology II: Supply Chain Management",
    department: "Technology & Information Management",
    institution: UCSC,
    term: "Winter 2026",
    scope: "Weekly office hours · assignment and midterm grading",
    highlights: [
      "Facilitated weekly office hours on supply chain optimization and network design.",
      "Graded assignments and a midterm with consistent rubrics and detailed feedback.",
      "Helped students integrate Management of Technology I concepts with supply chain principles and complex network-design problems.",
    ],
    topics: ["Supply chain optimization", "Network design", "Midterm grading"],
  },
];

/** TA training coursework */
export const teachingTraining = ["Tomorrow's Professor (TA Training) — UC Santa Cruz"];

/** Teaching & mentoring skills */
export const teachingSkills = [
  "Classroom facilitation",
  "Rubric design",
  "Lesson planning",
  "Office hours",
  "Public speaking",
  "Academic mentorship",
];
