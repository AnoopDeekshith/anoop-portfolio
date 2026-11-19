export interface Link {
  label: string;
  href: string;
  /** Short display form, e.g. "linkedin.com/in/anoopdeekshithr" */
  display?: string;
}

export interface Profile {
  name: string;
  /** One-line headline shown under the name */
  headline: string;
  /** Focus areas, e.g. ["RTL Design", "Physical Design"] */
  roles: string[];
  location: string;
  /** e.g. "Open to relocation" */
  availability?: string;
  email: string;
  /** Path served from each app's /public folder */
  resumePath: string;
  /** One sentence shown under the name in a hero */
  tagline: string;
  /** Short paragraph for a summary/about section (plain text) */
  summary: string;
  /** Heading for the about/intro section */
  introHeading: string;
  /** Longer bio paragraphs (plain text) */
  bio: string[];
  interests: string[];
  links: Link[];
}

export interface Experience {
  role: string;
  company: string;
  /** e.g. "2021 – 2025". Kept as free text so you control formatting. */
  period: string;
  duration?: string;
  location?: string;
  highlights: string[];
  tools?: string[];
}

export interface Education {
  school: string;
  degree: string;
  period: string;
  location?: string;
  notes?: string[];
}

export type ProjectStatus = "complete" | "in-progress";

export interface Metric {
  label: string;
  value: string;
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  /** e.g. "Fall 2026 – Present" */
  period?: string;
  status: ProjectStatus;
  /** 0–100, used by the portfolio's progress bars */
  progress?: number;
  summary: string;
  /** Resume-style bullet points */
  highlights?: string[];
  stack: string[];
  metrics: Metric[];
  /** Set to false to hide from the job-application site */
  featured: boolean;
  links?: Link[];
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Article {
  title: string;
  excerpt: string;
  tag: string;
  /** Free text, e.g. "Coming soon" or "Mar 2026" */
  date: string;
  readTime?: string;
  href: string;
  published: boolean;
}

export interface FocusArea {
  title: string;
  description: string;
}

export interface Publication {
  title: string;
  /** Journal, conference, or kind of work */
  venue: string;
  /** e.g. "Accepted", "Manuscript in preparation" */
  status: string;
  href?: string;
}

export interface TeachingRole {
  /** e.g. "Teaching Assistant" */
  role: string;
  /** Course code and name, e.g. "CSE 120 — Computer Architecture" */
  course: string;
  /** Department or program offering the course */
  department?: string;
  institution: string;
  /** e.g. "Fall 2025" */
  term: string;
  /** True for a role you hold now */
  current?: boolean;
  /** Instructor, if you'd like to credit them */
  instructor?: string;
  /** Class size, sections, etc. — e.g. "120 students · 2 lab sections" */
  scope?: string;
  /** What you did, in detail */
  highlights: string[];
  topics?: string[];
}
