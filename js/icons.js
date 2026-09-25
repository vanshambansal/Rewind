/**
 * icons.js — SVG icon data URIs for the desktop environment.
 * All icons are self-contained SVGs encoded as data URIs.
 */

function svg(str) {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(str.trim());
}

// ── Desktop / Application Icons (32×32) ──────────────────────────

const myComputer = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
  <rect x="4" y="2" width="24" height="17" fill="#d4d0c8"/>
  <rect x="4" y="2" width="24" height="1" fill="#fff"/>
  <rect x="4" y="2" width="1" height="17" fill="#fff"/>
  <rect x="27" y="2" width="1" height="17" fill="#808080"/>
  <rect x="4" y="18" width="24" height="1" fill="#808080"/>
  <rect x="6" y="4" width="20" height="13" fill="#000080"/>
  <rect x="8" y="6" width="7" height="5" fill="#c0c0c0"/>
  <rect x="8" y="6" width="7" height="2" fill="#0a246a"/>
  <rect x="16" y="8" width="7" height="6" fill="#c0c0c0"/>
  <rect x="16" y="8" width="7" height="2" fill="#0a246a"/>
  <rect x="12" y="19" width="8" height="2" fill="#808080"/>
  <rect x="10" y="21" width="12" height="3" fill="#d4d0c8"/>
  <rect x="10" y="21" width="12" height="1" fill="#fff"/>
  <circle cx="26" cy="16" r="1" fill="#00ff00" shape-rendering="auto"/>
</svg>`);

const myDocuments = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
  <rect x="3" y="7" width="10" height="3" fill="#d4a017"/>
  <rect x="3" y="10" width="26" height="17" fill="#ffd700"/>
  <rect x="3" y="10" width="26" height="1" fill="#fff68f"/>
  <rect x="3" y="10" width="1" height="17" fill="#fff68f"/>
  <rect x="28" y="10" width="1" height="17" fill="#b8860b"/>
  <rect x="3" y="26" width="26" height="1" fill="#b8860b"/>
  <rect x="9" y="14" width="14" height="1" fill="#c8a000"/>
  <rect x="9" y="17" width="14" height="1" fill="#c8a000"/>
  <rect x="9" y="20" width="9" height="1" fill="#c8a000"/>
</svg>`);

const notepad = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
  <rect x="6" y="2" width="20" height="28" fill="#fffff0"/>
  <rect x="6" y="2" width="20" height="1" fill="#fff"/>
  <rect x="6" y="2" width="1" height="28" fill="#fff"/>
  <rect x="25" y="2" width="1" height="28" fill="#808080"/>
  <rect x="6" y="29" width="20" height="1" fill="#808080"/>
  <rect x="7" y="2" width="18" height="4" fill="#00007b"/>
  <rect x="9" y="8" width="14" height="1" fill="#000080"/>
  <rect x="9" y="11" width="14" height="1" fill="#000080"/>
  <rect x="9" y="14" width="10" height="1" fill="#000080"/>
  <rect x="9" y="17" width="14" height="1" fill="#aaa"/>
  <rect x="9" y="20" width="12" height="1" fill="#aaa"/>
  <rect x="9" y="23" width="8" height="1" fill="#aaa"/>
</svg>`);

const paint = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="auto">
  <ellipse cx="16" cy="17" rx="13" ry="11" fill="#f5deb3" stroke="#8b7355" stroke-width="1"/>
  <circle cx="9" cy="11" r="3" fill="#ff0000"/>
  <circle cx="17" cy="9" r="3" fill="#0000ff"/>
  <circle cx="24" cy="13" r="3" fill="#008000"/>
  <circle cx="23" cy="21" r="3" fill="#ffff00"/>
  <circle cx="13" cy="23" r="2.5" fill="#800080"/>
  <ellipse cx="9" cy="17" rx="2" ry="3" fill="#f5deb3" stroke="#8b7355" stroke-width="0.5"/>
</svg>`);

const mediaPlayer = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
  <rect x="3" y="3" width="26" height="26" fill="#1a1a2e"/>
  <rect x="3" y="3" width="26" height="3" fill="#0a246a"/>
  <rect x="5" y="8" width="22" height="14" fill="#000"/>
  <polygon points="13,11 13,20 22,15.5" fill="#00cc00" shape-rendering="auto"/>
  <rect x="5" y="24" width="22" height="3" fill="#2a2a3e"/>
  <rect x="7" y="25" width="10" height="1" fill="#00cc00"/>
</svg>`);

const calculator = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
  <rect x="6" y="2" width="20" height="28" fill="#d4d0c8"/>
  <rect x="6" y="2" width="20" height="1" fill="#fff"/>
  <rect x="6" y="2" width="1" height="28" fill="#fff"/>
  <rect x="25" y="2" width="1" height="28" fill="#808080"/>
  <rect x="6" y="29" width="20" height="1" fill="#808080"/>
  <rect x="8" y="4" width="16" height="6" fill="#8fbc8f"/>
  <rect x="8" y="4" width="16" height="1" fill="#b0d0b0"/>
  <rect x="9" y="12" width="4" height="3" fill="#fff"/>
  <rect x="14" y="12" width="4" height="3" fill="#fff"/>
  <rect x="19" y="12" width="4" height="3" fill="#ff8c00"/>
  <rect x="9" y="17" width="4" height="3" fill="#fff"/>
  <rect x="14" y="17" width="4" height="3" fill="#fff"/>
  <rect x="19" y="17" width="4" height="3" fill="#ff8c00"/>
  <rect x="9" y="22" width="4" height="3" fill="#fff"/>
  <rect x="14" y="22" width="4" height="3" fill="#fff"/>
  <rect x="19" y="22" width="6" height="3" fill="#ff8c00"/>
</svg>`);

const snake = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
  <rect x="2" y="2" width="28" height="28" fill="#003300"/>
  <rect x="2" y="2" width="28" height="1" fill="#005500"/>
  <rect x="2" y="2" width="1" height="28" fill="#005500"/>
  <rect x="29" y="2" width="1" height="28" fill="#001a00"/>
  <rect x="2" y="29" width="28" height="1" fill="#001a00"/>
  <rect x="6" y="8" width="4" height="4" fill="#00ff00"/>
  <rect x="10" y="8" width="4" height="4" fill="#00cc00"/>
  <rect x="14" y="8" width="4" height="4" fill="#00ff00"/>
  <rect x="14" y="12" width="4" height="4" fill="#00cc00"/>
  <rect x="14" y="16" width="4" height="4" fill="#00ff00"/>
  <rect x="10" y="16" width="4" height="4" fill="#00cc00"/>
  <rect x="10" y="20" width="4" height="4" fill="#00ff00"/>
  <circle cx="8" cy="10" r="1" fill="#003300" shape-rendering="auto"/>
  <rect x="22" y="20" width="4" height="4" fill="#ff0000"/>
</svg>`);

const recycleBin = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
  <rect x="8" y="4" width="16" height="2" fill="#808080"/>
  <rect x="12" y="2" width="8" height="2" fill="#808080"/>
  <rect x="12" y="2" width="8" height="1" fill="#c0c0c0"/>
  <rect x="6" y="6" width="20" height="3" fill="#d4d0c8"/>
  <rect x="6" y="6" width="20" height="1" fill="#fff"/>
  <rect x="7" y="9" width="18" height="19" fill="#d4d0c8"/>
  <rect x="7" y="9" width="1" height="19" fill="#fff"/>
  <rect x="24" y="9" width="1" height="19" fill="#808080"/>
  <rect x="7" y="27" width="18" height="1" fill="#808080"/>
  <rect x="11" y="11" width="1" height="14" fill="#808080"/>
  <rect x="16" y="11" width="1" height="14" fill="#808080"/>
  <rect x="20" y="11" width="1" height="14" fill="#808080"/>
</svg>`);

const controlPanel = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
  <rect x="3" y="3" width="26" height="26" fill="#d4d0c8"/>
  <rect x="3" y="3" width="26" height="1" fill="#fff"/>
  <rect x="3" y="3" width="1" height="26" fill="#fff"/>
  <rect x="28" y="3" width="1" height="26" fill="#808080"/>
  <rect x="3" y="28" width="26" height="1" fill="#808080"/>
  <rect x="6" y="6" width="8" height="8" fill="#fff"/>
  <rect x="18" y="6" width="8" height="8" fill="#fff"/>
  <rect x="6" y="18" width="8" height="8" fill="#fff"/>
  <rect x="18" y="18" width="8" height="8" fill="#fff"/>
  <rect x="8" y="8" width="4" height="3" fill="#0a246a"/>
  <rect x="20" y="8" width="4" height="3" fill="#008000"/>
  <rect x="8" y="20" width="4" height="3" fill="#b22222"/>
  <rect x="20" y="20" width="4" height="3" fill="#daa520"/>
</svg>`);


// ── UI Icons ─────────────────────────────────────────────────────

const startIcon = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges">
  <rect x="1" y="1" width="6" height="6" fill="#ff4500"/>
  <rect x="9" y="1" width="6" height="6" fill="#4169e1"/>
  <rect x="1" y="9" width="6" height="6" fill="#228b22"/>
  <rect x="9" y="9" width="6" height="6" fill="#ffd700"/>
</svg>`);

const soundOn = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
  <rect x="1" y="5" width="4" height="6" fill="#000" shape-rendering="crispEdges"/>
  <polygon points="5,5 9,2 9,14 5,11" fill="#000"/>
  <path d="M11,5 Q13.5,8 11,11" fill="none" stroke="#000" stroke-width="1.5"/>
</svg>`);

const shutdownIcon = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" shape-rendering="auto">
  <path d="M10,5 A6,6 0 1,0 10.001,5" fill="none" stroke="#800000" stroke-width="2"/>
  <line x1="10" y1="3" x2="10" y2="11" stroke="#800000" stroke-width="2"/>
</svg>`);


// ── Explorer / Filesystem Icons ──────────────────────────────────

const hardDrive = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
  <rect x="4" y="10" width="24" height="14" fill="#d4d0c8"/>
  <rect x="4" y="10" width="24" height="1" fill="#fff"/>
  <rect x="4" y="10" width="1" height="14" fill="#fff"/>
  <rect x="27" y="10" width="1" height="14" fill="#808080"/>
  <rect x="4" y="23" width="24" height="1" fill="#808080"/>
  <rect x="7" y="14" width="18" height="4" fill="#808080"/>
  <rect x="7" y="14" width="18" height="1" fill="#000"/>
  <rect x="7" y="14" width="1" height="4" fill="#000"/>
  <rect x="24" y="14" width="1" height="4" fill="#fff"/>
  <rect x="7" y="17" width="18" height="1" fill="#fff"/>
  <circle cx="8" cy="20" r="1.5" fill="#00ff00" shape-rendering="auto"/>
  <rect x="13" y="19" width="10" height="2" fill="#808080"/>
</svg>`);

const floppyDrive = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
  <rect x="5" y="8" width="22" height="16" fill="#d4d0c8"/>
  <rect x="5" y="8" width="22" height="1" fill="#fff"/>
  <rect x="5" y="8" width="1" height="16" fill="#fff"/>
  <rect x="26" y="8" width="1" height="16" fill="#808080"/>
  <rect x="5" y="23" width="22" height="1" fill="#808080"/>
  <rect x="8" y="14" width="16" height="3" fill="#000"/>
  <rect x="10" y="18" width="4" height="2" fill="#000"/>
  <circle cx="22" cy="19" r="1" fill="#00ff00" shape-rendering="auto"/>
</svg>`);

const folder = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
  <rect x="4" y="6" width="10" height="4" fill="#d4a017"/>
  <rect x="4" y="9" width="24" height="16" fill="#ffd700"/>
  <rect x="4" y="9" width="24" height="1" fill="#fff68f"/>
  <rect x="4" y="9" width="1" height="16" fill="#fff68f"/>
  <rect x="27" y="9" width="1" height="16" fill="#b8860b"/>
  <rect x="4" y="24" width="24" height="1" fill="#b8860b"/>
  <rect x="6" y="12" width="20" height="1" fill="#e6b800"/>
</svg>`);

const folderOpen = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
  <rect x="4" y="6" width="10" height="4" fill="#d4a017"/>
  <rect x="4" y="9" width="22" height="6" fill="#e6b800"/>
  <polygon points="2,25 6,13 28,13 24,25" fill="#ffd700" shape-rendering="auto"/>
  <line x1="6" y1="13" x2="28" y2="13" stroke="#fff68f" stroke-width="1"/>
  <line x1="2" y1="25" x2="24" y2="25" stroke="#b8860b" stroke-width="1"/>
</svg>`);

const fileText = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
  <polygon points="6,3 20,3 26,9 26,29 6,29" fill="#fff" shape-rendering="auto"/>
  <polyline points="6,3 20,3 26,9 26,29 6,29 6,3" fill="none" stroke="#808080" stroke-width="1" shape-rendering="auto"/>
  <polygon points="20,3 20,9 26,9" fill="#d4d0c8" shape-rendering="auto"/>
  <line x1="9" y1="12" x2="23" y2="12" stroke="#000" stroke-width="1"/>
  <line x1="9" y1="15" x2="23" y2="15" stroke="#000" stroke-width="1"/>
  <line x1="9" y1="18" x2="23" y2="18" stroke="#000" stroke-width="1"/>
  <line x1="9" y1="21" x2="19" y2="21" stroke="#000" stroke-width="1"/>
  <line x1="9" y1="24" x2="15" y2="24" stroke="#000" stroke-width="1"/>
</svg>`);

const fileImage = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
  <rect x="5" y="4" width="22" height="24" fill="#fff"/>
  <rect x="5" y="4" width="22" height="24" fill="none" stroke="#808080" stroke-width="1"/>
  <rect x="7" y="6" width="18" height="13" fill="#87ceeb"/>
  <circle cx="11" cy="10" r="2" fill="#ffd700" shape-rendering="auto"/>
  <polygon points="7,19 14,13 18,17 21,14 25,19" fill="#2e8b57" shape-rendering="auto"/>
  <rect x="8" y="22" width="16" height="2" fill="#000080"/>
</svg>`);

const fileAudio = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
  <polygon points="6,3 20,3 26,9 26,29 6,29" fill="#fff" shape-rendering="auto"/>
  <polyline points="6,3 20,3 26,9 26,29 6,29 6,3" fill="none" stroke="#808080" stroke-width="1" shape-rendering="auto"/>
  <polygon points="20,3 20,9 26,9" fill="#d4d0c8" shape-rendering="auto"/>
  <circle cx="12" cy="22" r="3" fill="#000080" shape-rendering="auto"/>
  <circle cx="20" cy="20" r="3" fill="#000080" shape-rendering="auto"/>
  <line x1="15" y1="22" x2="15" y2="12" stroke="#000080" stroke-width="2"/>
  <line x1="23" y1="20" x2="23" y2="10" stroke="#000080" stroke-width="2"/>
  <line x1="15" y1="12" x2="23" y2="10" stroke="#000080" stroke-width="3"/>
</svg>`);

const fileGeneric = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
  <polygon points="6,3 20,3 26,9 26,29 6,29" fill="#fff" shape-rendering="auto"/>
  <polyline points="6,3 20,3 26,9 26,29 6,29 6,3" fill="none" stroke="#808080" stroke-width="1" shape-rendering="auto"/>
  <polygon points="20,3 20,9 26,9" fill="#d4d0c8" shape-rendering="auto"/>
  <rect x="10" y="16" width="12" height="2" fill="#808080"/>
  <rect x="10" y="20" width="8" height="2" fill="#808080"/>
</svg>`);

const navUp = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
  <polygon points="8,2 3,8 6,8 6,14 10,14 10,8 13,8" fill="#000"/>
</svg>`);

const navBack = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
  <polygon points="3,8 9,2 9,5 14,5 14,11 9,11 9,14" fill="#000"/>
</svg>`);

const navForward = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
  <polygon points="13,8 7,2 7,5 2,5 2,11 7,11 7,14" fill="#000"/>
</svg>`);

const recycleBinFull = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
  <polygon points="10,2 14,0 18,3 12,5" fill="#fff"/>
  <polygon points="16,1 21,3 19,7 14,5" fill="#ffd700"/>
  <rect x="8" y="5" width="16" height="2" fill="#808080"/>
  <rect x="12" y="3" width="8" height="2" fill="#808080"/>
  <rect x="6" y="7" width="20" height="3" fill="#d4d0c8"/>
  <rect x="6" y="7" width="20" height="1" fill="#fff"/>
  <rect x="7" y="10" width="18" height="19" fill="#d4d0c8"/>
  <rect x="7" y="10" width="1" height="19" fill="#fff"/>
  <rect x="24" y="10" width="1" height="19" fill="#808080"/>
  <rect x="7" y="28" width="18" height="1" fill="#808080"/>
  <rect x="10" y="12" width="2" height="12" fill="#808080"/>
  <rect x="15" y="12" width="2" height="12" fill="#808080"/>
  <rect x="20" y="12" width="2" height="12" fill="#808080"/>
  <polygon points="9,8 14,6 16,11 11,12" fill="#fff"/>
</svg>`);

const cmd = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
  <rect x="2" y="4" width="28" height="24" fill="#000"/>
  <rect x="2" y="4" width="28" height="1" fill="#fff"/>
  <rect x="2" y="4" width="1" height="24" fill="#fff"/>
  <rect x="29" y="4" width="1" height="24" fill="#808080"/>
  <rect x="2" y="27" width="28" height="1" fill="#808080"/>
  <rect x="3" y="5" width="26" height="4" fill="#0a246a"/>
  <polygon points="6,13 10,16 6,19" fill="#fff" shape-rendering="auto"/>
  <rect x="12" y="18" width="6" height="2" fill="#fff"/>
</svg>`);

const run = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
  <rect x="4" y="6" width="24" height="20" fill="#d4d0c8"/>
  <rect x="4" y="6" width="24" height="1" fill="#fff"/>
  <rect x="4" y="6" width="1" height="20" fill="#fff"/>
  <rect x="27" y="6" width="1" height="20" fill="#808080"/>
  <rect x="4" y="25" width="24" height="1" fill="#808080"/>
  <rect x="8" y="10" width="16" height="12" fill="#000"/>
  <polygon points="12,12 20,16 12,20" fill="#00ff00" shape-rendering="auto"/>
</svg>`);

const calendar = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
  <rect x="4" y="4" width="24" height="24" fill="#fff"/>
  <rect x="4" y="4" width="24" height="6" fill="#b22222"/>
  <rect x="4" y="4" width="24" height="1" fill="#fff"/>
  <rect x="4" y="4" width="1" height="24" fill="#fff"/>
  <rect x="27" y="4" width="1" height="24" fill="#808080"/>
  <rect x="4" y="27" width="24" height="1" fill="#808080"/>
  <rect x="8" y="14" width="3" height="3" fill="#000"/>
  <rect x="14" y="14" width="3" height="3" fill="#000"/>
  <rect x="20" y="14" width="3" height="3" fill="#000"/>
  <rect x="8" y="19" width="3" height="3" fill="#000"/>
  <rect x="14" y="19" width="3" height="3" fill="#b22222"/>
  <rect x="20" y="19" width="3" height="3" fill="#000"/>
</svg>`);

// ── Export ────────────────────────────────────────────────────────

export const Icons = {
    myComputer,
    myDocuments,
    notepad,
    paint,
    mediaPlayer,
    calculator,
    snake,
    recycleBin,
    recycleBinFull,
    controlPanel,
    cmd,
    run,
    calendar,
    startIcon,
    soundOn,
    shutdownIcon,
    hardDrive,
    floppyDrive,
    folder,
    folderOpen,
    fileText,
    fileImage,
    fileAudio,
    fileGeneric,
    navUp,
    navBack,
    navForward
};


