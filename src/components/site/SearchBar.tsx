import { Calendar, MapPin, Search, Tag } from "lucide-react";

export function SearchBar() {
  return (
    <div className="mx-auto -mt-10 max-w-6xl px-4 sm:px-6 lg:px-10">
      <div className="grid grid-cols-1 gap-3 rounded-3xl bg-card p-4 shadow-luxe md:grid-cols-[1.4fr_1fr_1fr_1fr_auto] md:gap-2 md:p-3">
        <Field icon={<Search className="h-4 w-4" />} label="What are you looking for?" placeholder="Search experiences, workshops..." />
        <Field icon={<Tag className="h-4 w-4" />} label="Category" placeholder="All Categories" />
        <Field icon={<MapPin className="h-4 w-4" />} label="Location" placeholder="All Locations" />
        <Field icon={<Calendar className="h-4 w-4" />} label="Date" placeholder="Pick a Date" />
        <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-gradient px-7 py-3 text-sm font-semibold text-primary-foreground shadow-luxe hover:opacity-95">
          Search <Search className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function Field({ icon, label, placeholder }: { icon: React.ReactNode; label: string; placeholder: string }) {
  return (
    <label className="rounded-2xl px-4 py-2 hover:bg-muted/60 transition cursor-text">
      <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 flex items-center gap-2 text-sm text-foreground">
        <span className="text-primary">{icon}</span>
        <input className="w-full bg-transparent outline-none placeholder:text-muted-foreground/70" placeholder={placeholder} />
      </div>
    </label>
  );
}
