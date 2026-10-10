import type { ComponentProps } from "react";

type Variant = "primary" | "secondary";

const base =
  "group inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 text-sm font-medium transition-[background-color,border-color,color,transform] duration-200 ease-out active:translate-y-px";

const styles: Record<Variant, string> = {
  primary: "bg-accent text-on-accent hover:bg-accent-strong",
  secondary: "border border-line-strong text-fg hover:border-accent hover:text-accent-text",
};

type ButtonLinkProps = ComponentProps<"a"> & { variant?: Variant };

export function ButtonLink({ variant = "primary", className = "", ...props }: ButtonLinkProps) {
  return <a className={`${base} ${styles[variant]} ${className}`} {...props} />;
}
