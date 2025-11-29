import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const NotFoundPage = () => (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6 text-center">
        <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Page not found</h1>
            <p className="text-muted-foreground">
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
        </div>
        <Button asChild>
            <Link to="/">Back to dashboard</Link>
        </Button>
    </div>
);
