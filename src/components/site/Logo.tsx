import logo from "@/assets/an-logo.asset.json";

export function Logo({ size = 56, className = "" }: { size?: number; className?: string }) {
  return (
    <div
      className={`rounded-full bg-cream shadow-card-soft overflow-hidden shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <img src={logo.url} alt="AN Out & About — Events & Experiences" className="h-full w-full object-cover" />
    </div>
  );
}
