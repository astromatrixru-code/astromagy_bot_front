import { PageContent } from "@/components/layout/main-layout";

export default function HelpPage() {
    return (
        <PageContent>
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-8 bg-primary rounded-full" />
                    <h1 className="text-2xl font-bold tracking-tight">Help</h1>
                </div>
                <p className="text-muted-foreground">
                    Help and support information will appear here.
                </p>
            </div>
        </PageContent>
    );
}
