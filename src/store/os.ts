import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { ReactNode } from "react";

export type AppId = "file-explorer" | "settings" | "notepad" | "edge" | "about";

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
  immer((set) => ({
    windows: [],
    zCounter: 10,
    startOpen: false,

    openApp: (appId) =>
      set((s) => {
        // If already open & not minimized, focus it; else create new
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
      }),
  })),
);

export const APP_REGISTRY: Array<{ id: AppId; name: string; icon: string }> = [
  { id: "file-explorer", name: "File Explorer", icon: "📁" },
  { id: "edge", name: "Edge", icon: "🌐" },
  { id: "notepad", name: "Notepad", icon: "📝" },
  { id: "settings", name: "Settings", icon: "⚙️" },
  { id: "about", name: "About PC", icon: "💻" },
];

export type { ReactNode };
