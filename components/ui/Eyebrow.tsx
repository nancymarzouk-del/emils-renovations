type EyebrowProps = {
  children: React.ReactNode
  as?: "span" | "p"
  className?: string
}

// Small-caps, letter-spaced label with a short gold rule. Gold is accent-only.
export default function Eyebrow({ children, as = "span", className }: EyebrowProps) {
  const Tag = as
  return (
    <Tag className={`eyebrow${className ? ` ${className}` : ""}`}>
      <span className="eyebrow-rule" aria-hidden="true" />
      {children}
    </Tag>
  )
}
