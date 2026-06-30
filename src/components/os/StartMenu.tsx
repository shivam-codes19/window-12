import { Search, Power } from "lucide-react";
import { APP_REGISTRY, useOS } from "@/store/os";

export function StartMenu() {
  const { startOpen, toggleStart, openApp } = useOS();
  if (!startOpen) return null;
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => toggleStart(false)} />
      <div
        className="surface-acrylic shadow-window fixed bottom-16 left-1/2 z-50 w-[640px] -translate-x-1/2 rounded-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
          <Search className="size-4 opacity-70" />
          <input
            placeholder="Search for apps, settings, and files"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="mt-5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Pinned
        </div>
        <div className="mt-3 grid grid-cols-6 gap-2">
          {APP_REGISTRY.map((app) => (
            <button
              key={app.id}
              onDoubleClick={() => openApp(app.id)}
              onClick={() => openApp(app.id)}
              className="group flex flex-col items-center gap-2 rounded-lg p-3 hover:bg-white/10"
            >
              <div className="grid size-12 place-items-center rounded-lg bg-white/10 text-2xl transition group-hover:scale-105">
                {app.icon}
              </div>
              <span className="text-xs">{app.name}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground font-semibold">
              L
            </div>
            Lovable User
          </div>
          <button className="rounded-md p-2 hover:bg-white/10" aria-label="Power">
            <Power className="size-4" />
          </button>
        </div>
      </div>
    </>
  );
}
