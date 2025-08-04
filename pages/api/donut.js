import { Torus } from "@lib/Torus";
import { VecTransformer } from "@lib/VecTransformer";

export default function handler(req, res) {
    const color = { r: 0, g: 0, b: 255 };
    const theta = {
        x: parseFloat(req.query.rx || "0"),
        y: parseFloat(req.query.ry || "0"),
        z: parseFloat(req.query.rz || "0"),
    };

    const svg = generateDonutSVG(color, theta);

    res.setHeader("Content-Type", "image/svg+xml");
    res.status(200).send(svg);
}

function formatPoint(p) {
    const x = p.x.toFixed(4);
    const y = p.y.toFixed(4);
    return `${x},${y}`;
}

function getShadeColor(z, base) {
    const shade = Math.max(0, Math.min(1, (1 - z) * 0.5 + 0.5));
    const r = Math.floor(base.r * shade);
    const g = Math.floor(base.g * shade);
    const b = Math.floor(base.b * shade);
    return `rgb(${r},${g},${b})`;
}

function generateDonutSVG(color, rotation) {
    const torus = new Torus(0.5, 1, 30);
    const { indices, vertices } = torus.sources();

    const rotated = vertices.map((v) => VecTransformer.rotate(v, rotation));
    const projected = rotated.map(VecTransformer.project);

    const triangles = [];
    for (let i = 0; i < indices.length; i += 3) {
        const a = projected[indices[i]];
        const b = projected[indices[i + 1]];
        const c = projected[indices[i + 2]];
        const zAvg = (a.z + b.z + c.z) / 3;
        triangles.push({ a, b, c, z: zAvg });
    }

    triangles.sort((t1, t2) => t1.z - t2.z);

    const paths = triangles.map(({ a, b, c }) => {
        const shade = getShadeColor((a.z + b.z + c.z) / 3, color);
        return `<polygon points="${formatPoint(a)} ${formatPoint(
            b
        )} ${formatPoint(c)}" fill="${shade}" stroke="none" />`;
    });

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="220" height="220" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" >
  <rect x="8" y="8" width="204" height="204" fill="#222" stroke="#999" stroke-width="8" rx="20" ry="20" />
  <g transform="translate(110,110) scale(80,-80)">
    ${paths.join("\n    ")}
  </g>
</svg>`;
}
