"use client";

import { useEffect, useState } from "react";

export default function Home() {
    const [svgContentStatic, setSvgContentStatic] = useState("");
    const [svgContentRotating, setSvgContentRotating] = useState("");

    useEffect(() => {
        fetch("/api/donut")
            .then((res) => res.text())
            .then((svg) => setSvgContentStatic(svg));
    }, []);

    useEffect(() => {
        fetch("/api/donut?rx=0.3&ry=0.3&rz=1.0")
            .then((res) => res.text())
            .then((svg) => setSvgContentRotating(svg));
    }, []);

    return (
        <main>
            <div
                className="svg-container"
                dangerouslySetInnerHTML={{ __html: svgContentStatic }}
            />
            <div
                className="svg-container"
                dangerouslySetInnerHTML={{ __html: svgContentRotating }}
            />
        </main>
    );
}
