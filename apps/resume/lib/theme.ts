export const THEME_STORAGE_KEY = "theme";

/** Runs in <head> before first paint so a saved choice never flashes the wrong theme. */
export const themeInitScript = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;
