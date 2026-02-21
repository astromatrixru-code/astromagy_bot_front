import { PageContent } from "@/components/layout/main-layout";

export default function ReportsPage() {
    return (
        <PageContent>
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-8 bg-primary rounded-full" />
                    <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
                </div>
                <p className="text-muted-foreground">
                    Your astrological reports will appear here.
                </p>
            </div>
        </PageContent>
    );
}
