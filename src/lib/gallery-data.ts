import g1 from "@/assets/gallery/g1-cafe.jpg";
import g2 from "@/assets/gallery/g2-pottery.jpg";
import g3 from "@/assets/gallery/g3-painting.jpg";
import g4 from "@/assets/gallery/g4-candles.jpg";
import g5 from "@/assets/gallery/g5-bookclub.jpg";
import g6 from "@/assets/gallery/g6-music.jpg";
import g7 from "@/assets/gallery/g7-picnic.jpg";
import g8 from "@/assets/gallery/g8-yoga.jpg";
import g9 from "@/assets/gallery/g9-brunch.jpg";
import g10 from "@/assets/gallery/g10-dance.jpg";

export type GalleryItem = {
  id: number;
  src: string;
  title: string;
  category: string;
  location: string;
  date: string;
  height: "sm" | "md" | "lg" | "xl";
};

const pool = [g1, g2, g3, g4, g5, g6, g7, g8, g9, g10];
const titles = [
  "Cafe Conversations",
  "Clay & Calm",
  "Canvas Sundays",
  "Candle Making Night",
  "Book Club Circle",
  "Acoustic Under Fairy Lights",
  "Sunset Picnic Social",
  "Sunrise Yoga Flow",
  "Boozy Brunch Meetup",
  "Contemporary Dance Jam",
  "Sketch Jam",
  "Terrarium Workshop",
  "Poetry Open Mic",
  "Coffee Tasting Lab",
  "Pizza & Vinyl Night",
  "Journaling Retreat",
  "Perfumery Class",
  "Board Games Social",
  "Watercolour Weekend",
  "Rooftop Community Meet",
];
const cities = ["Mumbai", "Bengaluru", "Delhi", "Pune", "Hyderabad", "Goa", "Jaipur"];
const cats = ["Art", "Food", "Workshop", "Social", "Wellness", "Music"];
const heights: GalleryItem["height"][] = ["md", "lg", "sm", "xl", "md", "lg", "sm", "md", "lg", "sm", "xl", "md", "sm", "lg", "md", "sm", "lg", "md", "xl", "md"];

export const GALLERY: GalleryItem[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  src: pool[i % pool.length],
  title: titles[i],
  category: cats[i % cats.length],
  location: cities[i % cities.length],
  date: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i % 6] + " 2026",
  height: heights[i],
}));
