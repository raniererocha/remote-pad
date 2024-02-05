import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "danger" | "outline" | "link";
}
export default function Button({
    children,
    variant = "primary",
    ...props
}: ButtonProps) {
    const variantStyle = {
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        danger: "bg-red-500 text-white",
        outline: "border border-primary text-primary",
        link: "border-none text-primary underline hover:no-underline",
    };
    return (
        <button
            className={cn("p-2 rounded font-semibold", variantStyle[variant])}
            {...props}
        >
            {children}
        </button>
    );
}
