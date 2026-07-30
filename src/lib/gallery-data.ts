export type GalleryItem = {
  id: number;
  src: string;
  title: string;
  category: string;
  location: string;
  date: string;
  height: "sm" | "md" | "lg" | "xl";
};

// Import all images from src/assets/gallery
const imageModules = import.meta.glob("../assets/gallery/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}", {
  eager: true,
  import: "default",
});

const images = Object.values(imageModules) as string[];

const titles = [
  "Sip, Paint & Unwind",
  "Bedazzle Art Experience",
  "Mirror Clay Creations",
  "Tote Bag Art Studio",
  "Canvas & Coffee Escape",
  "Creative Paint Party",
  "Clay Date Experience",
  "Weekend Art Retreat",
  "DIY Tote Bag Workshop",
  "Brushes & Brews Social",
];

const cities = [
  "Khan Market",
  "CP",
  "Noida Sector 62",
  "Preet vihar"
];

const cats = [
  "Art",
  "Food",
  "Workshop",
  "Social",
  "Wellness",
  "Music",
];

const heights: GalleryItem["height"][] = ["sm", "md", "lg", "xl"];

export const GALLERY: GalleryItem[] = images.map((img, i) => ({
  id: i + 1,
  src: img,
  title: titles[i % titles.length],
  category: cats[i % cats.length],
  location: cities[i % cities.length],
  date: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i % 6] + " 2026",
  height: heights[i % heights.length],
}));