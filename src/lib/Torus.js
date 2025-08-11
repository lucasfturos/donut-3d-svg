export class Torus {
    constructor(innerRadius, outerRadius, slices) {
        this.innerRadius = innerRadius;
        this.outerRadius = outerRadius;
        this.slices = slices;

        this.indices = new Uint16Array(slices * slices * 6);
        this.vertices = new Float32Array((slices + 1) * (slices + 1) * 3);

        this.generateIndices();
        this.generateVertices();
    }

    generateIndices() {
        const s = this.slices;
        let idx = 0;
        for (let i = 0; i < s; i++) {
            for (let j = 0; j < s; j++) {
                const p0 = i * (s + 1) + j;
                const p1 = p0 + s + 1;
                const p2 = p0 + 1;
                const p3 = p1 + 1;

                this.indices[idx++] = p0;
                this.indices[idx++] = p1;
                this.indices[idx++] = p2;

                this.indices[idx++] = p2;
                this.indices[idx++] = p1;
                this.indices[idx++] = p3;
            }
        }
    }

    generateVertices() {
        const s = this.slices;
        const TWO_PI = Math.PI * 2;
        let idx = 0;

        for (let i = 0; i <= s; i++) {
            const u = (i / s) * TWO_PI;
            const cosU = Math.cos(u);
            const sinU = Math.sin(u);

            for (let j = 0; j <= s; j++) {
                const v = (j / s) * TWO_PI;
                const cosV = Math.cos(v);
                const sinV = Math.sin(v);

                this.vertices[idx++] =
                    (this.outerRadius + this.innerRadius * cosV) * cosU;
                this.vertices[idx++] =
                    (this.outerRadius + this.innerRadius * cosV) * sinU;
                this.vertices[idx++] = this.innerRadius * sinV;
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
