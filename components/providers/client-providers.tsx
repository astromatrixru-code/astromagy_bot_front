"use client";

import dynamic from "next/dynamic";

// Dynamically import WebAppSettings with SSR disabled to avoid window errors
const WebAppSettings = dynamic(
    () => import("@/components/providers/web-app-settings"),
    { ssr: false }
);

export function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <>
            <WebAppSettings />
            {children}
        </>
    );
}
