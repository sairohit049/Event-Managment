const local = ["localhost", "127.0.0.1"].includes(location.hostname) && location.port !== "3000";
export const API_URL = local ? "http://localhost:3000" : location.origin;

// Escape text before putting it into innerHTML (prevents broken markup / XSS)
export function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, c => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
}

// "14:30" -> "02:30 PM"; values already in 12h format are returned unchanged
export function formatTime(t) {
    if (!t) return "TBA";
    let m = /^(\d{1,2}):(\d{2})$/.exec(t);
    if (!m) return t;
    let h = Number(m[1]);
    return `${String(h % 12 || 12).padStart(2, "0")}:${m[2]} ${h >= 12 ? "PM" : "AM"}`;
}

// "02:30 PM" -> "14:30" (needed to fill <input type="time">)
export function to24h(t) {
    let m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(t || "");
    if (!m) return t || "";
    let h = Number(m[1]) % 12;
    if (m[3].toUpperCase() === "PM") h += 12;
    return `${String(h).padStart(2, "0")}:${m[2]}`;
}
