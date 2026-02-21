"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, FileText, Gift, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
    {
        label: "Reports",
        icon: FileText,
        href: "/reports",
    },
    {
        label: "Bonuses",
        icon: Gift,
        href: "/bonuses",
    },
    {
        label: "Profile",
        icon: User,
        href: "/profile",
    },
    {
        label: "Help",
        icon: HelpCircle,
        href: "/help",
    },
];

export function TabNavigation() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-muted/30 pb-safe">
            <div className="flex items-center justify-around h-16 max-w-md mx-auto px-4">
                {items.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 transition-all duration-300 group",
                                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <div
                                className={cn(
                                    "p-1 rounded-xl transition-all duration-300",
                                    isActive ? "bg-primary/10 scale-110" : "group-hover:bg-muted"
                                )}
                            >
                                <Icon
                                    className={cn(
                                        "w-6 h-6 transition-all",
                                        isActive ? "stroke-[2.5px]" : "stroke-[2px]"
                                    )}
                                />
                            </div>
                            <span className="text-[10px] font-medium tracking-tight uppercase">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
