interface LogoProps {
  class?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Logo({ class: className, size = "md" }: LogoProps) {
  const sizes = {
    sm: "h-8",
    md: "h-10",
    lg: "h-14",
    xl: "h-20",
  };

  return (
    <img
      src="/logos/snivel-logo.svg"
      alt="SNIVEL"
      class={`${sizes[size]} w-auto ${className || ""}`}
    />
  );
}
