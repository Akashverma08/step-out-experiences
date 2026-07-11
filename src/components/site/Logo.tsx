import logo from "@/assets/Logo.jpeg";

export function Logo({ size = 56, className = "" }: { size?: number; className?: string }) {
  return (
    <div
      className={`rounded-full bg-cream shadow-card-soft overflow-hidden shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <img src={logo} alt="AN Out & About — Events & Experiences" className="h-full w-full object-cover" />
    </div>
  );
}
