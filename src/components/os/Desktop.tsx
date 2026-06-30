import { useEffect } from "react";
import wallpaper from "@/assets/wallpaper.jpg";
import { useOS, APP_REGISTRY, type AppId } from "@/store/os";
import { Window } from "./Window";
import { Taskbar } from "./Taskbar";
import { StartMenu } from "./StartMenu";
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
  const { windows, openApp, toggleStart, startOpen } = useOS();

  // Keyboard: Win/Meta key (or Escape) toggles start
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && startOpen) toggleStart(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [startOpen, toggleStart]);

  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${wallpaper})` }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Desktop icons */}
      <div className="grid w-28 grid-cols-1 gap-2 p-4">
        {DESKTOP_ICONS.map((id) => {
          const app = APP_REGISTRY.find((a) => a.id === id)!;
          return (
            <button
              key={id}
              onDoubleClick={() => openApp(id)}
              className="group flex flex-col items-center gap-1 rounded-md p-2 text-center text-xs text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] hover:bg-white/10 focus:bg-white/15"
            >
              <span className="text-3xl leading-none">{app.icon}</span>
              <span className="leading-tight">{app.name}</span>
            </button>
          );
        })}
      </div>

      {/* Windows */}
      {windows.map((w) => {
        const Comp = APP_COMPONENTS[w.appId];
        return (
          <Window key={w.id} win={w}>
            <Comp />
          </Window>
        );
      })}

      <StartMenu />
      <Taskbar />
    </div>
  );
}
