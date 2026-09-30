import type { SVGProps } from "react";

type XoLockupProps = {
  decorative?: boolean;
  title?: string;
} & Omit<SVGProps<SVGSVGElement>, "children">;

export function XoLockup({ decorative = false, title = "XO", className, ...rest }: XoLockupProps) {
  return (
    <svg
      {...rest}
      className={className}
      viewBox="0 0 64 24"
      fill="currentColor"
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : title}
      focusable="false"
    >
      <text x="0" y="19" fontFamily="Inter, system-ui, sans-serif" fontSize="22" fontWeight="700" letterSpacing="1">
        XO
      </text>
    </svg>
  );
}
