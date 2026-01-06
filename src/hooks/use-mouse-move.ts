"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export function useMouseMove() {
    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        setMouseX(e.clientX - rect.left);
        setMouseY(e.clientY - rect.top);
    }, []);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        element.addEventListener("mousemove", handleMouseMove);
        return () => element.removeEventListener("mousemove", handleMouseMove);
    }, [handleMouseMove]);

    return { ref, mouseX, mouseY };
}
