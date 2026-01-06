"use client";

export function BackgroundMesh() {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
            <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] rounded-full bg-indigo-500/10 blur-[100px] animate-bounce-slow" />
            <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[130px] animate-float" />
        </div>
    );
}
