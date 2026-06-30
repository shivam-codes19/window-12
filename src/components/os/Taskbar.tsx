import { useEffect, useState } from "react";
import {
  Search,
  LayoutGrid,
  Wifi,
  Volume2,
  BatteryFull,
  X,
  Minimize2,
  RefreshCw,
  Pin,
} from "lucide-react";
import { APP_REGISTRY, useOS } from "@/store/os";
import startLogo from "@/assets/wallpaper.jpg";
import { useContextMenu } from "./ContextMenu";

const PINNED = APP_REGISTRY;

export function Taskbar() {
  const {
    windows,
    openApp,
    focusWindow,
    minimizeWindow,
    closeWindow,
    minimizeAll,
    closeAll,
    toggleStart,
    startOpen,
    refreshDesktop,
  } = useOS();
  const { open: openMenu } = useContextMenu();
  // Start as null to avoid SSR/CSR hydration mismatch on locale-formatted time.
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const i = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(i);
  }, []);

  const timeStr = now
    ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";
  const dateStr = now
    ? now.toLocaleDateString([], { month: "numeric", day: "numeric", year: "numeric" })
    : "";

  return (
    <div
      className="surface-taskbar fixed inset-x-0 bottom-0 z-30 flex h-14 items-center justify-between px-3"
      onContextMenu={(e) => {
        e.preventDefault();
        openMenu(e, [
          {
            label: "Task view",
            icon: <LayoutGrid className="size-4" />,
            onSelect: () => {},
          },
          {
            label: "Show desktop",
            icon: <Minimize2 className="size-4" />,
            onSelect: minimizeAll,
          },
          { separator: true },
          {
            label: "Close all windows",
            icon: <X className="size-4" />,
            onSelect: closeAll,
            disabled: windows.length === 0,
            danger: true,
          },
          { separator: true },
          {
            label: "Taskbar settings",
            icon: <Wifi className="size-4" />,
            onSelect: () => openApp("settings"),
          },
        ]);
      }}
    >
      <div className="w-40" />

      <div className="flex items-center gap-1">
        <button
          onClick={() => toggleStart()}
          className={`grid size-10 place-items-center rounded-md transition ${
            startOpen ? "bg-white/15" : "hover:bg-white/10"
          }`}
          aria-label="Start"
        >
          <img
            src={startLogo}
            alt=""
            className="size-6 rounded-sm object-cover"
            width={24}
            height={24}
          />
        </button>
        <button
          className="grid size-10 place-items-center rounded-md hover:bg-white/10"
          aria-label="Search"
        >
          <Search className="size-4" />
        </button>
        <button
          className="grid size-10 place-items-center rounded-md hover:bg-white/10"
          aria-label="Task view"
        >
          <LayoutGrid className="size-4" />
        </button>

        <div className="mx-1 h-6 w-px bg-white/10" />

        {PINNED.map((app) => {
          const open = windows.find((w) => w.appId === app.id);
          return (
            <button
              key={app.id}
              onClick={() => {
                if (open) {
                  if (open.minimized) focusWindow(open.id);
                  else minimizeWindow(open.id);
                } else openApp(app.id);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openMenu(e, [
                  {
                    label: `Open ${app.name}`,
                    icon: <span>{app.icon}</span>,
                    onSelect: () => openApp(app.id),
                  },
                  ...(open
                    ? [
                        {
                          label: open.minimized ? "Restore" : "Minimize",
                          icon: <Minimize2 className="size-4" />,
                          onSelect: () =>
                            open.minimized ? focusWindow(open.id) : minimizeWindow(open.id),
                        },
                        {
                          label: "Close window",
                          icon: <X className="size-4" />,
                          danger: true,
                          onSelect: () => closeWindow(open.id),
                        },
                      ]
                    : []),
                  { separator: true },
                  {
                    label: "Unpin from taskbar",
                    icon: <Pin className="size-4" />,
                    disabled: true,
                  },
                ]);
              }}
              className={`group relative grid size-10 place-items-center rounded-md transition hover:bg-white/10 ${
                open && !open.minimized ? "bg-white/10" : ""
              }`}
              title={app.name}
            >
              <span className="text-xl leading-none">{app.icon}</span>
              {open && (
                <span
                  className={`absolute -bottom-0.5 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-primary transition-all ${
                    open.minimized ? "w-1" : "w-4"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex w-40 items-center justify-end gap-1">
        <button
          onClick={refreshDesktop}
          className="grid size-9 place-items-center rounded-md hover:bg-white/10"
          aria-label="Refresh desktop"
          title="Refresh"
        >
          <RefreshCw className="size-4" />
        </button>
        <div className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-white/10">
          <Wifi className="size-4" />
          <Volume2 className="size-4" />
          <BatteryFull className="size-4" />
        </div>
        <div
          className="rounded-md px-2 py-1 text-right text-[11px] leading-tight hover:bg-white/10"
          suppressHydrationWarning
        >
          <div>{timeStr || "\u00A0"}</div>
          <div>{dateStr || "\u00A0"}</div>
        </div>
      </div>
    </div>
  );
}
