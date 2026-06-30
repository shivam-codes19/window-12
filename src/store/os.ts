import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import type { ReactNode } from "react";
import type { WallpaperId } from "@/lib/wallpapers";

export type AppId = "file-explorer" | "settings" | "notepad" | "edge" | "about";

export type WidgetId = "clock" | "weather" | "calendar" | "system" | "notes";

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  prev?: { x: number; y: number; width: number; height: number };
}

interface OSState {
  windows: WindowState[];
  zCounter: number;
  startOpen: boolean;
  refreshKey: number;
  // Personalization (persisted)
  wallpaper: WallpaperId;
  // Widgets (persisted)
  widgetsOpen: boolean;
  enabledWidgets: Record<WidgetId, boolean>;

  openApp: (appId: AppId) => void;
  closeWindow: (id: string) => void;
  closeAll: () => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  minimizeAll: () => void;
  toggleMaximize: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  resizeWindow: (id: string, w: number, h: number) => void;
  toggleStart: (force?: boolean) => void;
  refreshDesktop: () => void;

  setWallpaper: (id: WallpaperId) => void;
  toggleWidgets: (force?: boolean) => void;
  toggleWidget: (id: WidgetId) => void;
}

const APP_TITLES: Record<AppId, string> = {
  "file-explorer": "File Explorer",
  settings: "Settings",
  notepad: "Notepad",
  edge: "Microsoft Edge",
  about: "About this PC",
};

let idCounter = 0;
const nextId = () => `w_${++idCounter}`;

export const useOS = create<OSState>()(
  persist(
    immer((set) => ({
      windows: [],
      zCounter: 10,
      startOpen: false,
      refreshKey: 0,
      wallpaper: "bloom",
      widgetsOpen: false,
      enabledWidgets: {
        clock: true,
        weather: true,
        calendar: true,
        system: true,
        notes: false,
      },

      openApp: (appId) =>
        set((s) => {
          const existing = s.windows.find((w) => w.appId === appId);
          if (existing) {
            existing.minimized = false;
            s.zCounter += 1;
            existing.zIndex = s.zCounter;
            s.startOpen = false;
            return;
          }
          s.zCounter += 1;
          const offset = (s.windows.length % 6) * 28;
          s.windows.push({
            id: nextId(),
            appId,
            title: APP_TITLES[appId],
            x: 140 + offset,
            y: 90 + offset,
            width: 880,
            height: 560,
            zIndex: s.zCounter,
            minimized: false,
            maximized: false,
          });
          s.startOpen = false;
        }),

      closeWindow: (id) =>
        set((s) => {
          s.windows = s.windows.filter((w) => w.id !== id);
        }),

      closeAll: () =>
        set((s) => {
          s.windows = [];
        }),

      focusWindow: (id) =>
        set((s) => {
          const w = s.windows.find((w) => w.id === id);
          if (!w) return;
          s.zCounter += 1;
          w.zIndex = s.zCounter;
          w.minimized = false;
        }),

      minimizeWindow: (id) =>
        set((s) => {
          const w = s.windows.find((w) => w.id === id);
          if (w) w.minimized = !w.minimized;
        }),

      minimizeAll: () =>
        set((s) => {
          s.windows.forEach((w) => (w.minimized = true));
        }),

      toggleMaximize: (id) =>
        set((s) => {
          const w = s.windows.find((w) => w.id === id);
          if (!w) return;
          if (w.maximized && w.prev) {
            w.x = w.prev.x;
            w.y = w.prev.y;
            w.width = w.prev.width;
            w.height = w.prev.height;
            w.maximized = false;
            w.prev = undefined;
          } else {
            w.prev = { x: w.x, y: w.y, width: w.width, height: w.height };
            w.maximized = true;
          }
        }),

      moveWindow: (id, x, y) =>
        set((s) => {
          const w = s.windows.find((w) => w.id === id);
          if (w && !w.maximized) {
            w.x = x;
            w.y = y;
          }
        }),

      resizeWindow: (id, width, height) =>
        set((s) => {
          const w = s.windows.find((w) => w.id === id);
          if (w && !w.maximized) {
            w.width = Math.max(360, width);
            w.height = Math.max(240, height);
          }
        }),

      toggleStart: (force) =>
        set((s) => {
          s.startOpen = force ?? !s.startOpen;
          if (s.startOpen) s.widgetsOpen = false;
        }),

      refreshDesktop: () =>
        set((s) => {
          s.refreshKey += 1;
        }),

      setWallpaper: (id) =>
        set((s) => {
          s.wallpaper = id;
        }),

      toggleWidgets: (force) =>
        set((s) => {
          s.widgetsOpen = force ?? !s.widgetsOpen;
          if (s.widgetsOpen) s.startOpen = false;
        }),

      toggleWidget: (id) =>
        set((s) => {
          s.enabledWidgets[id] = !s.enabledWidgets[id];
        }),
    })),
    {
      name: "win12-os",
      partialize: (s) => ({
        wallpaper: s.wallpaper,
        enabledWidgets: s.enabledWidgets,
      }),
    },
  ),
);

export const APP_REGISTRY: Array<{ id: AppId; name: string; icon: string }> = [
  { id: "file-explorer", name: "File Explorer", icon: "📁" },
  { id: "edge", name: "Edge", icon: "🌐" },
  { id: "notepad", name: "Notepad", icon: "📝" },
  { id: "settings", name: "Settings", icon: "⚙️" },
  { id: "about", name: "About PC", icon: "💻" },
];

export const WIDGET_REGISTRY: Array<{ id: WidgetId; name: string; icon: string }> = [
  { id: "clock", name: "Clock", icon: "🕒" },
  { id: "weather", name: "Weather", icon: "⛅" },
  { id: "calendar", name: "Calendar", icon: "📅" },
  { id: "system", name: "System", icon: "📊" },
  { id: "notes", name: "Quick Notes", icon: "🗒️" },
];

export type { ReactNode };
