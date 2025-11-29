import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva(
    "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-1px] [&>svg+div]:space-y-1 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
    {
        variants: {
            variant: {
                default: "bg-background text-foreground",
                destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
                success: "border-green-500/50 text-green-700 dark:border-green-500 [&>svg]:text-green-500",
                info: "border-blue-500/50 text-blue-700 dark:border-blue-500 [&>svg]:text-blue-500"
            }
        },
        defaultVariants: {
            variant: "default"
        }
    }
);

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
    ({ className, variant, ...props }, ref) => (
        <div
            ref={ref}
            role="alert"
            className={cn(alertVariants({ variant }), className)}
            {...props}
        />
    )
);
Alert.displayName = "Alert";

const AlertTitle = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5 className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props} />
);

const AlertDescription = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
    <div className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
);

export { Alert, AlertTitle, AlertDescription };
