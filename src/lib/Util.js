export function formatPoint(p) {
    const x = Number(p.x).toFixed(3);
    const y = Number(p.y).toFixed(3);
    return `${x},${y}`;
}

export function getShadeColor(z, base) {
    const shade = Math.max(0.6, Math.min(1, (1 - z) * 0.8 + 0.2));
    const r = Math.floor(base.r * shade);
    const g = Math.floor(base.g * shade);
    const b = Math.floor(base.b * shade);
    return `rgb(${r},${g},${b})`;
}
