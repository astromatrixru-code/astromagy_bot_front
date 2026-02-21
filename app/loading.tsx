export default function Loading() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background overflow-hidden relative">
            {/* Background Stars */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/4 left-1/4 h-1 w-1 bg-primary rounded-full animate-pulse [animation-duration:3s]"></div>
                <div className="absolute top-3/4 left-1/3 h-1 w-1 bg-primary/70 rounded-full animate-pulse [animation-duration:2s]"></div>
                <div className="absolute top-1/3 right-1/4 h-1.5 w-1.5 bg-primary/60 rounded-full animate-pulse [animation-duration:4s]"></div>
                <div className="absolute bottom-1/4 right-1/3 h-1 w-1 bg-primary/80 rounded-full animate-pulse [animation-duration:2.5s]"></div>
                <div className="absolute top-1/2 left-1/6 h-0.5 w-0.5 bg-primary rounded-full animate-pulse [animation-duration:3.5s]"></div>
                <div className="absolute bottom-1/3 right-1/6 h-0.5 w-0.5 bg-primary/50 rounded-full animate-pulse [animation-duration:4.5s]"></div>
            </div>

            <div className="relative flex h-64 w-64 items-center justify-center">
                {/* Outer Orbit */}
                <div className="absolute h-48 w-48 animate-[spin_8s_linear_infinite] rounded-full border border-primary/20">
                    <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]"></div>
                </div>

                {/* Middle Orbit */}
                <div className="absolute h-32 w-32 animate-[spin_5s_linear_infinite_reverse] rounded-full border border-primary/30">
                    <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-primary/80 shadow-[0_0_8px_var(--primary)]"></div>
                </div>

                {/* Inner glow & Central Star */}
                <div className="absolute h-16 w-16 animate-pulse rounded-full bg-primary/10 blur-xl"></div>
                <div className="relative h-12 w-12 animate-pulse rounded-full bg-primary shadow-[0_0_30px_var(--primary)] text-primary-foreground flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z" /></svg>
                </div>
            </div>
        </div>
    );
}