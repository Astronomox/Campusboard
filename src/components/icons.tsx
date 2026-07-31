import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 24, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
  };
}

export function HomeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9" />
      <path d="M10 20v-5h4v5" />
    </svg>
  );
}

export function FlameIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3c1.2 3 3.8 4.2 3.8 7.6a3.8 3.8 0 0 1-7.6 0C8.2 8.8 9.4 8 10 6.8c.6 2 2 2.4 2 4.8" />
      <path d="M12 21a5.4 5.4 0 0 0 5.4-5.4c0-2.6-1.6-4.4-2.6-6-.2 3-2.4 3.6-2.8 5.6-.4-1.4-1.4-1.8-1.4-3.4-1 1.4-2 2.8-2 4.2A5.4 5.4 0 0 0 12 21Z" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="8.5" r="3.8" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function ChevronUpIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m6 15 6-6 6 6" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function SendIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4.5 12 20 5l-4.5 15-3.5-6-6-2Z" />
      <path d="m12 13.5 3.5-4" />
    </svg>
  );
}

export function SwitchIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 8h13l-3-3M20 16H7l3 3" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}

/** Reaction glyphs — filled two-tone marks rather than emoji. */
export function ReactionGlyph({
  kind,
  size = 22,
}: {
  kind: "fire" | "skull" | "laugh" | "hundred";
  size?: number;
}) {
  const common = { width: size, height: size, viewBox: "0 0 24 24" };
  switch (kind) {
    case "fire":
      return (
        <svg {...common} fill="none">
          <path
            d="M12 2.5c1.4 3.4 4.3 4.7 4.3 8.4a4.3 4.3 0 0 1-8.6 0C7.7 8.6 9 8 9.7 6.6c.7 2.3 2.3 2.7 2.3 5.3"
            fill="#ff7a1a"
          />
          <path
            d="M12 21.5a4 4 0 0 0 4-4c0-2-1.2-3.3-2-4.5-.2 2.2-1.8 2.7-2.1 4.2-.3-1-1-1.3-1-2.5-.8 1-1.5 2-1.5 3A4 4 0 0 0 12 21.5Z"
            fill="#ffd21a"
          />
        </svg>
      );
    case "skull":
      return (
        <svg {...common} fill="none">
          <path
            d="M12 3c-4.4 0-7 3-7 6.6 0 2.3 1.2 3.6 2.3 4.6.5.4.7.8.7 1.4v1.1c0 .7.6 1.3 1.3 1.3h5.4c.7 0 1.3-.6 1.3-1.3v-1.1c0-.6.2-1 .7-1.4 1.1-1 2.3-2.3 2.3-4.6C19 6 16.4 3 12 3Z"
            fill="#e6e8ee"
          />
          <circle cx="9" cy="10.5" r="1.7" fill="#22262e" />
          <circle cx="15" cy="10.5" r="1.7" fill="#22262e" />
          <path d="M11 19.5v1.6M13 19.5v1.6" stroke="#e6e8ee" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "laugh":
      return (
        <svg {...common} fill="none">
          <circle cx="12" cy="12" r="9" fill="#ffd21a" />
          <path d="M8 10.5c.6-.9 1.6-.9 2.2 0M13.8 10.5c.6-.9 1.6-.9 2.2 0" stroke="#22262e" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M7.5 14.5c1 2 7 2 8 0-.5 1.8-2.2 3-4 3s-3.5-1.2-4-3Z" fill="#22262e" />
        </svg>
      );
    case "hundred":
      return (
        <svg {...common} fill="none">
          <text
            x="12"
            y="15.5"
            textAnchor="middle"
            fontSize="9.5"
            fontWeight="800"
            fill="#ff2d55"
            fontFamily="system-ui, sans-serif"
          >
            100
          </text>
          <path d="M4 17.5h16" stroke="#ff2d55" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
  }
}

export function FlagIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 21V4M5 5h12l-2.5 3.5L17 12H5" />
    </svg>
  );
}

export function BookmarkIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 3h14a1 1 0 0 1 1 1v17l-8-4-8 4V4a1 1 0 0 1 1-1Z" />
    </svg>
  );
}
"// v1.0"  
