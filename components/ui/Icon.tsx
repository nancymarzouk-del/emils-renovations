// Custom thin-line architectural icons — no external libraries, consistent
// stroke weight, colored via `currentColor` (set to gold by the consuming CSS).

export type IconName =
  | "home"
  | "kitchen"
  | "bathroom"
  | "flooring"
  | "finishes"
  | "custom"
  | "craftsmanship"
  | "communication"
  | "respect"
  | "detail"

type IconProps = {
  name: IconName
  className?: string
}

const PATHS: Record<IconName, React.ReactNode> = {
  // Home Renovations — house with door
  home: (
    <>
      <path d="M6 15 L16 6 L26 15" />
      <path d="M8.5 13 V26 H23.5 V13" />
      <path d="M13.5 26 V19 H18.5 V26" />
    </>
  ),
  // Kitchen Renovations — range / cooktop
  kitchen: (
    <>
      <rect x="7" y="7" width="18" height="18" rx="1.5" />
      <path d="M7 13.5 H25" />
      <circle cx="11.5" cy="10.2" r="1.4" />
      <circle cx="20.5" cy="10.2" r="1.4" />
      <path d="M11 16.5 H21" />
      <rect x="12" y="19" width="8" height="3.5" rx="0.5" />
    </>
  ),
  // Bathroom Renovations — tub + faucet
  bathroom: (
    <>
      <path d="M5 17 H27" />
      <path d="M7.5 17 V19.5 c0 1.7 1.3 3 3 3 H21.5 c1.7 0 3 -1.3 3 -3 V17" />
      <path d="M10.5 17 V13 c0 -1.7 1.3 -3 3 -3 H15" />
      <path d="M9.5 22.5 V25" />
      <path d="M22.5 22.5 V25" />
    </>
  ),
  // Flooring Installation — offset planks (plan view)
  flooring: (
    <>
      <rect x="6" y="8" width="20" height="16" rx="1" />
      <path d="M6 13.3 H26" />
      <path d="M6 18.6 H26" />
      <path d="M13 8 V13.3" />
      <path d="M20 8 V13.3" />
      <path d="M9.5 13.3 V18.6" />
      <path d="M16.5 13.3 V18.6" />
      <path d="M23 13.3 V18.6" />
      <path d="M13 18.6 V24" />
      <path d="M20 18.6 V24" />
    </>
  ),
  // Interior Finishes — paint roller
  finishes: (
    <>
      <rect x="6" y="8" width="12" height="4.5" rx="1.2" />
      <path d="M13 12.5 V15 H11 V17" />
      <path d="M11 17 V24" />
    </>
  ),
  // Custom Projects — architectural plan sheet with a pencil (custom design)
  custom: (
    <>
      {/* plan sheet */}
      <rect x="6" y="5.5" width="14" height="20" rx="1" />
      {/* floor-plan drawing: title lines + an L-shaped room */}
      <path d="M9 10 H17" />
      <path d="M9 13.5 H17" />
      <path d="M13 13.5 V21" />
      <path d="M9 21 H13" />
      {/* pencil drawing across the plan */}
      <path d="M15.5 25 L24.5 16 l2 2 l-9 9 l-3 1 Z" />
      <path d="M22 18.5 l2 2" />
      <path d="M15.5 25 l1.2 -1.2" />
    </>
  ),
  // Craftsmanship — trowel
  craftsmanship: (
    <>
      <path d="M6 16 L12 10 L16 14 L10 20 Z" />
      <path d="M14 12.5 L20.5 19" />
      <path d="M18.5 17.5 L22.5 20" />
    </>
  ),
  // Communication — speech bubble
  communication: (
    <>
      <path d="M7 9 H23 a2 2 0 0 1 2 2 V17 a2 2 0 0 1 -2 2 H14 L10 23 V19 H7 a2 2 0 0 1 -2 -2 V11 a2 2 0 0 1 2 -2 Z" />
      <circle cx="11.5" cy="14" r="0.9" />
      <circle cx="15" cy="14" r="0.9" />
      <circle cx="18.5" cy="14" r="0.9" />
    </>
  ),
  // Respect — shield with check
  respect: (
    <>
      <path d="M16 6 L25 9 V15 c0 5.5 -4 8.5 -9 10.5 c-5 -2 -9 -5 -9 -10.5 V9 Z" />
      <path d="M12 15 L15 18 L20.5 12" />
    </>
  ),
  // Attention to Detail — magnifier with crosshair
  detail: (
    <>
      <circle cx="14" cy="14" r="7" />
      <path d="M19.2 19.2 L25 25" />
      <path d="M14 11 V17" />
      <path d="M11 14 H17" />
    </>
  ),
}

export default function Icon({ name, className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  )
}
