export function rotate(v, { x, y, z }) {
    let { x: px, y: py, z: pz } = v;

    let y1 = py * Math.cos(x) - pz * Math.sin(x);
    let z1 = py * Math.sin(x) + pz * Math.cos(x);
    py = y1;
    pz = z1;

    let x1 = px * Math.cos(y) + pz * Math.sin(y);
    z1 = -px * Math.sin(y) + pz * Math.cos(y);
    px = x1;
    pz = z1;

    x1 = px * Math.cos(z) - py * Math.sin(z);
    y1 = px * Math.sin(z) + py * Math.cos(z);
    px = x1;
    py = y1;

    return { x: px, y: py, z: pz };
}

export function project(v) {
    const scale = 1 / (2 - v.z);
    const x = v.x * scale;
    const y = v.y * scale;

    return {
        x: isFinite(x) ? x : 0,
        y: isFinite(y) ? y : 0,
        z: v.z,
    };
}

/* export function calcNormal(a, b, c) {
    const U = {
        x: b.x - a.x,
        y: b.y - a.y,
        z: b.z - a.z,
    };
    const V = {
        x: c.x - a.x,
        y: c.y - a.y,
        z: c.z - a.z,
    };

    return {
        x: U.y * V.z - U.z * V.y,
        y: U.z * V.x - U.x * V.z,
        z: U.x * V.y - U.y * V.x,
    };
}

export function dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}
 */
