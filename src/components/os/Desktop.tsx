import { useEffect } from "react";
import {
  RefreshCw,
  Monitor,
  Image as ImageIcon,
  Settings as SettingsIcon,
  FolderPlus,
  ExternalLink,
  Eye,
  ArrowUpDown,
  Info,
  LayoutGrid,
} from "lucide-react";
import { getWallpaperUrl, WALLPAPERS } from "@/lib/wallpapers";
import { useOS, APP_REGISTRY, type AppId } from "@/store/os";
import { Window } from "./Window";
import { Taskbar } from "./Taskbar";
import { StartMenu } from "./StartMenu";
import { ContextMenuProvider, useContextMenu } from "./ContextMenu";
import { WidgetsPanel } from "./Widgets";
import { FileExplorer } from "@/apps/FileExplorer";
import { Notepad } from "@/apps/Notepad";
import { Settings } from "@/apps/Settings";
import { About } from "@/apps/About";
import { Edge } from "@/apps/Edge";

const APP_COMPONENTS: Record<AppId, () => React.JSX.Element> = {
  "file-explorer": FileExplorer,
  notepad: Notepad,
  settings: Settings,
  about: About,
  edge: Edge,
};

const DESKTOP_ICONS: AppId[] = ["file-explorer", "edge", "notepad", "about"];

export function Desktop() {
  return (
    <ContextMenuProvider>
      <DesktopInner />
    </ContextMenuProvider>
  );
}

function DesktopInner() {
  const {
    windows,
    openApp,
    toggleStart,
    startOpen,
    refreshKey,
    refreshDesktop,
    wallpaper,
    setWallpaper,
    toggleWidgets,
  } = useOS();
  const { open: openMenu } = useContextMenu();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && startOpen) toggleStart(false);
      if (e.key === "F5") {
        e.preventDefault();
        refreshDesktop();
      }
      // Win+W style shortcut: Alt+W toggles widgets
      if (e.altKey && (e.key === "w" || e.key === "W")) {
        e.preventDefault();
        toggleWidgets();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [startOpen, toggleStart, refreshDesktop, toggleWidgets]);

  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-cover bg-center transition-[background-image] duration-500"
      style={{ backgroundImage: `url(${getWallpaperUrl(wallpaper)})` }}
      onContextMenu={(e) => {
        // Only fire for the desktop itself (not children that called stopPropagation)
        e.preventDefault();
        openMenu(e, [
          {
            label: "View",
            icon: <Eye className="size-4" />,
            disabled: true,
          },
          {
            label: "Sort by",
            icon: <ArrowUpDown className="size-4" />,
            disabled: true,
          },
          {
            label: "Refresh",
            icon: <RefreshCw className="size-4" />,
            shortcut: "F5",
            onSelect: refreshDesktop,
          },
          { separator: true },
          {
            label: "New folder",
            icon: <FolderPlus className="size-4" />,
            disabled: true,
          },
          {
            label: "Open in Explorer",
            icon: <ExternalLink className="size-4" />,
            onSelect: () => openApp("file-explorer"),
          },
          { separator: true },
          {
            label: "Widgets",
            icon: <LayoutGrid className="size-4" />,
            shortcut: "Alt+W",
            onSelect: () => toggleWidgets(true),
          },
          {
            label: "Next background",
            icon: <ImageIcon className="size-4" />,
            onSelect: () => {
              const idx = WALLPAPERS.findIndex((w) => w.id === wallpaper);
              const next = WALLPAPERS[(idx + 1) % WALLPAPERS.length];
              setWallpaper(next.id);
            },
          },
          { separator: true },
          {
            label: "Display settings",
            icon: <Monitor className="size-4" />,
            onSelect: () => openApp("settings"),
          },
          {
            label: "Personalize",
            icon: <ImageIcon className="size-4" />,
            onSelect: () => openApp("settings"),
          },
          {
            label: "Settings",
            icon: <SettingsIcon className="size-4" />,
            onSelect: () => openApp("settings"),
          },
          { separator: true },
          {
            label: "About this PC",
            icon: <Info className="size-4" />,
            onSelect: () => openApp("about"),
          },
        ]);
      }}
    >
      {/* Desktop icons */}
      <div className="grid w-28 grid-cols-1 gap-2 p-4">
        {DESKTOP_ICONS.map((id) => {
          const app = APP_REGISTRY.find((a) => a.id === id)!;
          return (
            <button
              key={id}
              onDoubleClick={() => openApp(id)}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openMenu(e, [
                  {
                    label: "Open",
                    icon: <ExternalLink className="size-4" />,
                    onSelect: () => openApp(id),
                  },
                  { separator: true },
                  { label: "Rename", disabled: true },
                  { label: "Properties", disabled: true },
                ]);
              }}
              className="group flex flex-col items-center gap-1 rounded-md p-2 text-center text-xs text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] hover:bg-white/10 focus:bg-white/15"
            >
              <span className="text-3xl leading-none">{app.icon}</span>
              <span className="leading-tight">{app.name}</span>
            </button>
          );
        })}
      </div>

      {/* Windows — refreshKey remounts the window layer */}
      <div key={refreshKey}>
        {windows.map((w) => {
          const Comp = APP_COMPONENTS[w.appId];
          return (
            <Window key={w.id} win={w}>
              <Comp />
            </Window>
          );
        })}
      </div>

      <StartMenu />
      <Taskbar />
    </div>
  );
}
