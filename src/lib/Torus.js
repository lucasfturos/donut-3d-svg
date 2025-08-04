export class Torus {
    constructor(innerRadius, outerRadius, slices) {
        this.innerRadius = innerRadius;
        this.outerRadius = outerRadius;
        this.slices = slices;
        this.indices = [];
        this.vertices = [];
        this.generateIndices();
        this.generateVertices();
    }

    generateIndices() {
        const s = this.slices;
        for (let i = 0; i < s; i++) {
            for (let j = 0; j < s; j++) {
                const p0 = i * (s + 1) + j;
                const p1 = p0 + s + 1;
                const p2 = p0 + 1;
                const p3 = p1 + 1;
                this.indices.push(p0, p1, p2);
                this.indices.push(p2, p1, p3);
            }
        }
    }

    generateVertices() {
        const s = this.slices;
        const TWO_PI = Math.PI * 2;
        for (let i = 0; i <= s; i++) {
            const u = (i / s) * TWO_PI;
            const cosU = Math.cos(u);
            const sinU = Math.sin(u);
            for (let j = 0; j <= s; j++) {
                const v = (j / s) * TWO_PI;
                const cosV = Math.cos(v);
                const sinV = Math.sin(v);
                const x = (this.outerRadius + this.innerRadius * cosV) * cosU;
                const y = (this.outerRadius + this.innerRadius * cosV) * sinU;
                const z = this.innerRadius * sinV;
                this.vertices.push({ x, y, z });
            }
        }
    }

    sources() {
        return {
            indices: this.indices,
            vertices: this.vertices,
        };
    }
}
