export const THEME_STORAGE_KEY = "theme";

/** Runs in <head> before first paint so a saved choice never flashes the wrong theme. */
export const themeInitScript = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

/**
 * Runs in <head> before first paint: enables the scroll-reveal hiding rule
 * (globals.css). If the page's scripts haven't started within 4s, a fallback
 * class shows everything so content can never stay hidden.
 */
export const revealInitScript = `document.documentElement.classList.add("js-reveal");window.__revealFallback=setTimeout(function(){document.documentElement.classList.add("reveal-fallback")},4000);`;
