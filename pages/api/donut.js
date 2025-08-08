import { Torus } from "@lib/Torus";
import { formatPoint, getShadeColor } from "@lib/Util";
import { project, rotate } from "@lib/Vec3";

const torus = new Torus(0.5, 1, 30);
const { indices, vertices } = torus.sources();

export const config = {
    api: {
        responseLimit: false,
    },
};

export default function handler(req, res) {
    const color = { r: 0, g: 0, b: 255 };
    const hasRotationParams =
        "rx" in req.query || "ry" in req.query || "rz" in req.query;

    let svg;
    if (hasRotationParams) {
        const theta = {
            x: parseFloat(req.query.rx || "0"),
            y: parseFloat(req.query.ry || "0"),
            z: parseFloat(req.query.rz || "0"),
        };
        svg = generateDonutSVG(color, theta);
    } else {
        svg = generateAnimatedDonutSVG(color);
    }

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
    res.setHeader("Content-Type", "image/svg+xml");
    res.status(200).send(svg);
}

function createTriangles(indices, vertices) {
    const triangles = [];
    for (let i = 0; i < indices.length; i += 3) {
        const a = vertices[indices[i + 0]];
        const b = vertices[indices[i + 1]];
        const c = vertices[indices[i + 2]];
        const zAvg = (a.z + b.z + c.z) / 3;
        triangles.push({ a, b, c, z: zAvg });
    }
    return triangles;
}

function generateDonutSVG(color, rotation) {
    const rotated = vertices.map((v) => rotate(v, rotation));
    const projected = rotated.map(project);

    const triangles = createTriangles(indices, projected);
    triangles.sort((t1, t2) => t1.z - t2.z);

    const paths = triangles.map(({ a, b, c, z }) => {
        const shade = getShadeColor(z, color);
        return `<polygon points="${formatPoint(a)} ${formatPoint(
            b
        )} ${formatPoint(c)}" fill="${shade}" stroke="none" />`;
    });

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="220" height="220" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
  <rect x="8" y="8" width="204" height="204" fill="#222" stroke="#999" stroke-width="8" rx="20" ry="20" />
  <g transform="translate(110,110) scale(80,-80)">
    ${paths.join("\n    ")}
  </g>
</svg>`;
}

function generateAnimatedDonutSVG(color) {
    const TOTAL_FRAMES = 60;
    const ROTATION_SPEED = (2 * Math.PI) / TOTAL_FRAMES;
    const FRAME_DURATION = 0.1;
    const DURATION = TOTAL_FRAMES * FRAME_DURATION;

    const baseTriangles = createTriangles(indices, vertices);
    baseTriangles.sort((t1, t2) => t1.z - t2.z);

    const frames = [];
    for (let f = 0; f < TOTAL_FRAMES; f++) {
        const theta = {
            x: 0.8 * Math.sin(f * ROTATION_SPEED),
            y: f * ROTATION_SPEED,
            z: 0.6 * Math.cos(f * ROTATION_SPEED),
        };
        const rotated = vertices.map((v) => rotate(v, theta));
        const projected = rotated.map(project);
        frames.push(
            baseTriangles.map((tri) => {
                const pa = projected[vertices.indexOf(tri.a)];
                const pb = projected[vertices.indexOf(tri.b)];
                const pc = projected[vertices.indexOf(tri.c)];
                const zAvg = (tri.z * (pa.z + pb.z + pc.z)) / 3;
                return {
                    a: pa,
                    b: pb,
                    c: pc,
                    z: zAvg,
                };
            })
        );
    }

    let polygonsSVG = "";
    for (let index = 0; index < frames[0].length; index++) {
        const pointsFrames = [];
        const colorsFrames = [];

        for (let f = 0; f < TOTAL_FRAMES; f++) {
            const t = frames[f][index];
            pointsFrames.push(
                `${formatPoint(t.a)} ${formatPoint(t.b)} ${formatPoint(t.c)}`
            );
            const shade = getShadeColor(t.z, color);
            colorsFrames.push(shade);
        }

        polygonsSVG += `<polygon points="${pointsFrames[0]}" fill="${
            colorsFrames[0]
        }" stroke="none">
            <animate attributeName="points" values="${pointsFrames.join(
                ";"
            )}" dur="${DURATION}s" repeatCount="indefinite" />
            <animate attributeName="fill" values="${colorsFrames.join(
                ";"
            )}" dur="${DURATION}s" repeatCount="indefinite" />
        </polygon>\n    `;
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="220" height="220" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
  <rect x="8" y="8" width="204" height="204" fill="#222" stroke="#999" stroke-width="8" rx="20" ry="20"/>
  <g transform="translate(110,110) scale(80,-80)">
    ${polygonsSVG}
  </g>
</svg>`;
}
