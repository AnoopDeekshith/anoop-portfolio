import RevealScope from "@/components/RevealScope";

/**
 * Unlike layout.tsx, a template is re-created on every navigation, so the
 * page fade and the word-by-word reveal (components/RevealScope.tsx) replay
 * each time you open a page.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <RevealScope>{children}</RevealScope>;
}
