export function formatPoint(p) {
    const x = p.x.toFixed(3);
    const y = p.y.toFixed(3);
    return `${x},${y}`;
}

export function getShadeColor(z, base) {
    const shade = Math.max(0, Math.min(1, (1 - z) * 0.5 + 0.5));
    const r = Math.floor(base.r * shade);
    const g = Math.floor(base.g * shade);
    const b = Math.floor(base.b * shade);
    return `rgb(${r},${g},${b})`;
}
