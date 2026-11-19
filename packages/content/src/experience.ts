import type { Education, Experience } from "./types";

export const experience: Experience[] = [
  {
    role: "Post-Silicon Validation Engineer II",
    company: "Anora Semiconductor Labs",
    period: "October 2021 – August 2025",
    duration: "4 years",
    location: "Bengaluru, KA",
    highlights: [
      "Led silicon bring-up and functional validation of mixed-signal SoCs across 3 product generations — from first-silicon power-on through production release",
      "Developed and maintained automated test programs on Teradyne UltraFLEX ATE covering digital IO, PLL lock, ADC/DAC linearity, and power domain sequencing",
      "Owned JTAG and SPI-based register-level debug flows; authored 200+ bench scripts in Python and C++ for automated fault isolation and margining sweeps",
      "Performed root-cause analysis on post-silicon failures by correlating ATE vectors, JTAG traces, and IR-drop simulations — interfacing daily with RTL and physical design teams",
      "Drove wafer sort to final test correlation studies; identified systematic process-induced failure modes that improved yield by ~4% across two lots",
      "Designed pattern-based fault coverage analysis flows for stuck-at and transition faults; improved overall DFT coverage from 87% to 96% across mixed-signal blocks",
      "Classified post-silicon test escapes and authored failure mode libraries used across three product lines for accelerated debug on future tapeouts",
      "Collaborated with the DFT team on BIST architecture review and scan chain debug during bring-up, reducing first-silicon debug time by 30%",
    ],
    tools: ["Teradyne ATE", "JTAG", "SPI", "Post-Si Debug", "Yield Analysis"],
  },
  {
    role: "Physical Design Engineer Intern",
    company: "Entuple Technologies",
    period: "April 2020 – June 2020",
    location: "Bengaluru, KA",
    highlights: [
      "Completed a solo amplifier-device placement and routing project during physical design methodology training.",
    ],
  },
];

export const education: Education[] = [
  {
    school: "University of California, Santa Cruz",
    degree: "M.S. in Electrical & Computer Engineering",
    period: "September 2025 – June 2027 (expected)",
    location: "Santa Cruz, CA",
    notes: [
      "Courses: Computer Architecture, VLSI Design, ASIC Design, Brain Inspired ML (AI Hardware Design), Device Electronics",
    ],
  },
  {
    school: "Visvesvaraya Technological University",
    degree: "B.E. in Electronics & Communication Engineering",
    period: "August 2017 – August 2021",
    location: "Bengaluru, KA",
    notes: ["GPA: 3.45"],
  },
];
