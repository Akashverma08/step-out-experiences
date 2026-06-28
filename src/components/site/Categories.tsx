import { Palette, Coffee, Hammer, Users, Scissors, CalendarHeart, UsersRound, LayoutGrid } from "lucide-react";

const items = [
  { icon: Palette, label: "Art & Creativity" },
  { icon: Coffee, label: "Food & Drinks" },
  { icon: Hammer, label: "Workshops" },
  { icon: Users, label: "Social Gatherings" },
  { icon: Scissors, label: "DIY & Craft" },
  { icon: CalendarHeart, label: "Seasonal Specials" },
  { icon: UsersRound, label: "Community Meetups" },
  { icon: LayoutGrid, label: "View All" },
];

export function Categories() {
  return (
    <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-10">
      <div className="grid grid-cols-4 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {items.map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="group flex flex-col items-center gap-3 rounded-2xl bg-card p-4 text-center transition hover:-translate-y-1 hover:shadow-card-soft"
          >
            <span className="grid h-12 w-12 place-items-center rounded-full bg-rose-soft/60 text-primary transition group-hover:bg-rose-gradient group-hover:text-primary-foreground">
              <Icon className="h-5 w-5" />
            </span>
            <span className="text-xs font-medium leading-tight text-foreground">{label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
