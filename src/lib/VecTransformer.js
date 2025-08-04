export class VecTransformer {
    static rotate(v, { x, y, z }) {
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

    static project(v) {
        const scale = 1 / (2 - v.z);
        const x = v.x * scale;
        const y = v.y * scale;

        return {
            x: isFinite(x) ? x : 0,
            y: isFinite(y) ? y : 0,
            z: v.z,
        };
    }
}
