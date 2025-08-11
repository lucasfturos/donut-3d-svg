import { Torus } from "@lib/Torus";
import { formatPoint, getShadeColor } from "@lib/Util";
import { getVertex, project, rotate } from "@lib/Vec3";

const torus = new Torus(0.5, 1, 20);
const { indices, vertices } = torus.sources();

const TOTAL_FRAMES = 40;
const ROTATION_SPEED = (2 * Math.PI) / TOTAL_FRAMES;
const FRAME_DURATION = 0.1;
const DURATION = TOTAL_FRAMES * FRAME_DURATION;

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
        svg = generateTorusSVG(color, theta);
    } else {
        svg = generateAnimatedTorusSVG(color);
    }

    res.setHeader("Cache-Control", "s-maxage=20, stale-while-revalidate");
    res.setHeader("Content-Type", "image/svg+xml");
    res.status(200).send(svg);
}

function createTriangles(indices, vertices) {
    const triangles = [];
    for (let i = 0; i < indices.length; i += 3) {
        const a = getVertex(vertices, indices[i + 0]);
        const b = getVertex(vertices, indices[i + 1]);
        const c = getVertex(vertices, indices[i + 2]);
        const zAvg = (a.z + b.z + c.z) / 3;
        triangles.push({
            a,
            b,
            c,
            z: zAvg,
            aIndex: indices[i + 0],
            bIndex: indices[i + 1],
            cIndex: indices[i + 2],
        });
    }
    return triangles;
}

function generateTorusSVG(color, rotation) {
    const rotated = [...Array(vertices.length / 3).keys()].map((i) => {
        return rotate(
            {
                x: vertices[i * 3 + 0],
                y: vertices[i * 3 + 1],
                z: vertices[i * 3 + 2],
            },
            rotation
        );
    });

    const projected = rotated.map(project);

    const baseTriangles = createTriangles(indices, vertices);
    baseTriangles.sort((t1, t2) => t1.z - t2.z);

    const paths = baseTriangles.map((tri) => {
        const a = projected[tri.aIndex];
        const b = projected[tri.bIndex];
        const c = projected[tri.cIndex];

        const shade = getShadeColor((a.z + b.z + c.z) / 3, color);
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

function generateAnimatedTorusSVG(color) {
    const baseTriangles = createTriangles(indices, vertices);
    baseTriangles.sort((t1, t2) => t1.z - t2.z);

    const framesVertices = [];
    for (let f = 0; f < TOTAL_FRAMES; f++) {
        const angle = f * ROTATION_SPEED;
        const theta = {
            x: 0.8 * Math.sin(angle),
            y: angle,
            z: 0.6 * Math.sin(angle),
        };

        const rotated = [...Array(vertices.length / 3).keys()].map((i) => {
            return rotate(
                {
                    x: vertices[i * 3 + 0],
                    y: vertices[i * 3 + 1],
                    z: vertices[i * 3 + 2],
                },
                theta
            );
        });
        const projected = rotated.map(project);
        framesVertices.push(projected);
    }

    let polygonsSVG = "";
    for (let triIndex = 0; triIndex < baseTriangles.length; triIndex++) {
        const pointsFrames = [];
        const colorsFrames = [];
        const tri = baseTriangles[triIndex];

        for (let f = 0; f < TOTAL_FRAMES; f++) {
            const projected = framesVertices[f];
            const a = projected[tri.aIndex];
            const b = projected[tri.bIndex];
            const c = projected[tri.cIndex];

            pointsFrames.push(
                `${formatPoint(a)} ${formatPoint(b)} ${formatPoint(c)}`
            );
            const zAvg = (a.z + b.z + c.z) / 3;
            colorsFrames.push(getShadeColor(zAvg, color));
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
  </polygon>\n`;
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="220" height="220" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
  <rect x="8" y="8" width="204" height="204" fill="#222" stroke="#999" stroke-width="8" rx="20" ry="20"/>
  <g transform="translate(110,110) scale(80,-80)">
    ${polygonsSVG}
  </g>
</svg>`;
}
