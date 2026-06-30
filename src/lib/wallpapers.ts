import wp1 from "@/assets/wallpaper.jpg";
import wp2 from "@/assets/wallpaper-aurora.jpg";
import wp3 from "@/assets/wallpaper-sunset.jpg";
import wp4 from "@/assets/wallpaper-emerald.jpg";

export type WallpaperId = "bloom" | "aurora" | "sunset" | "emerald";

export const WALLPAPERS: Array<{ id: WallpaperId; name: string; url: string }> = [
  { id: "bloom", name: "Bloom", url: wp1 },
  { id: "aurora", name: "Aurora", url: wp2 },
  { id: "sunset", name: "Sunset", url: wp3 },
  { id: "emerald", name: "Emerald", url: wp4 },
];

export const getWallpaperUrl = (id: WallpaperId) =>
  (WALLPAPERS.find((w) => w.id === id) ?? WALLPAPERS[0]).url;
