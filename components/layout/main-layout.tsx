"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { TabNavigation } from "./tab-navigation";

interface PageContextType {
    [key: string]: unknown;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

export function usePage() {
    const context = useContext(PageContext);
    if (context === undefined) {
        throw new Error("usePage must be used within a PageProvider");
    }
    return context;
}

interface PageProviderProps {
    children: ReactNode;
}

export function PageProvider({ children }: PageProviderProps) {
    const pathname = usePathname();
    const value = {};

    // Hide navigation on setup page
    const shouldShowNavigation = pathname !== "/setup";

    return (
        <PageContext.Provider value={value}>
            <div className="relative min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
                {children}
                {shouldShowNavigation && <TabNavigation />}
            </div>
        </PageContext.Provider>
    );
}

interface PageContentProps {
    children: ReactNode;
    className?: string;
}

export function PageContent({ children, className }: PageContentProps) {
    const pathname = usePathname();

    // No bottom padding on setup page since navigation is hidden
    const shouldHaveBottomPadding = pathname !== "/setup";

    return (
        <main
            className={cn(
                "flex-1 w-full max-w-md mx-auto px-4 pt-4 transition-all duration-300",
                shouldHaveBottomPadding ? "pb-24" : "pb-4",
                className
            )}
        >
            {children}
        </main>
    );
}
