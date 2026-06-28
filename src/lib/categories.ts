import painting from "@/assets/exp-painting.jpg";
import food from "@/assets/exp-food.jpg";
import social from "@/assets/exp-social.jpg";
import candles from "@/assets/exp-candles.jpg";

export const CATEGORIES = [
  { slug: "art", label: "Art & Creativity", icon: "Palette", img: painting, blurb: "Painting, pottery, sketch jams and artist-led sessions." },
  { slug: "food", label: "Food & Drinks", icon: "Coffee", img: food, blurb: "Coffee tastings, pizza nights, supper clubs and chef tables." },
  { slug: "workshop", label: "DIY Workshops", icon: "Hammer", img: candles, blurb: "Candles, perfumery, journaling, terrariums and more." },
  { slug: "social", label: "Social Gatherings", icon: "Users", img: social, blurb: "Mixers, meetups, game nights and book clubs." },
  { slug: "seasonal", label: "Seasonal Specials", icon: "CalendarHeart", img: candles, blurb: "Diwali, Holi, Christmas, New Year experiences." },
  { slug: "community", label: "Community Meetups", icon: "UsersRound", img: social, blurb: "Curated gatherings around shared passions." },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export function imageForCategory(category: string): string {
  return CATEGORIES.find((c) => c.slug === category)?.img ?? painting;
}

export function imageForExperience(image_url: string | null | undefined, category: string): string {
  if (image_url && image_url.startsWith("http")) return image_url;
  return imageForCategory(category);
}
