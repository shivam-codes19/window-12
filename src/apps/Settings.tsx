import { useState } from "react";
import { Monitor, Bluetooth, Wifi, Palette, User, Info, LayoutGrid, Check } from "lucide-react";
import { useOS, WIDGET_REGISTRY } from "@/store/os";
import { WALLPAPERS } from "@/lib/wallpapers";

const SECTIONS = [
  { id: "system", name: "System", icon: Monitor },
  { id: "personalize", name: "Personalization", icon: Palette },
  { id: "widgets", name: "Widgets", icon: LayoutGrid },
  { id: "devices", name: "Bluetooth & devices", icon: Bluetooth },
  { id: "network", name: "Network & internet", icon: Wifi },
  { id: "accounts", name: "Accounts", icon: User },
  { id: "about", name: "About", icon: Info },
];

export function Settings() {
  const [active, setActive] = useState("personalize");
  const section = SECTIONS.find((s) => s.id === active)!;
  return (
    <div className="flex h-full">
      <aside className="w-60 shrink-0 overflow-auto border-r border-border/60 p-2">
        <div className="px-3 py-3 text-lg font-semibold">Settings</div>
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
              active === s.id ? "bg-primary/20" : "hover:bg-white/5"
            }`}
          >
            <s.icon className="size-4" />
            {s.name}
          </button>
        ))}
      </aside>
      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-semibold">{section.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure your {section.name.toLowerCase()} preferences.
        </p>

        <div className="mt-6">
          {active === "personalize" && <PersonalizationPanel />}
          {active === "widgets" && <WidgetsSettings />}
          {active !== "personalize" && active !== "widgets" && <PlaceholderPanel name={section.name} />}
        </div>
      </div>
    </div>
  );
}

function PersonalizationPanel() {
  const { wallpaper, setWallpaper } = useOS();
  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-3 text-sm font-semibold">Background</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {WALLPAPERS.map((w) => {
            const selected = w.id === wallpaper;
            return (
              <button
                key={w.id}
                onClick={() => setWallpaper(w.id)}
                className={`group relative overflow-hidden rounded-lg border-2 transition ${
                  selected ? "border-primary" : "border-transparent hover:border-white/30"
                }`}
              >
                <img
                  src={w.url}
                  alt={w.name}
                  loading="lazy"
                  className="aspect-video w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5 text-xs">
                  <span>{w.name}</span>
                  {selected && <Check className="size-3.5 text-primary" />}
                </div>
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Click a thumbnail to apply it as your desktop background.
        </p>
      </section>
    </div>
  );
}

function WidgetsSettings() {
  const { enabledWidgets, toggleWidget, toggleWidgets } = useOS();
  return (
    <div className="space-y-3">
      <button
        onClick={() => toggleWidgets(true)}
        className="rounded-md bg-primary/30 px-3 py-1.5 text-sm hover:bg-primary/40"
      >
        Open widgets panel
      </button>
      <div className="surface-mica space-y-1 rounded-lg p-2">
        {WIDGET_REGISTRY.map((w) => (
          <div
            key={w.id}
            className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-white/5"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{w.icon}</span>
              <div>
                <div className="text-sm font-medium">{w.name}</div>
                <div className="text-xs text-muted-foreground">
                  Show {w.name.toLowerCase()} in the widgets panel
                </div>
              </div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={enabledWidgets[w.id]}
                onChange={() => toggleWidget(w.id)}
                className="peer sr-only"
              />
              <div className="h-6 w-11 rounded-full bg-white/15 transition peer-checked:bg-primary" />
              <div className="absolute left-0.5 top-0.5 size-5 rounded-full bg-white transition peer-checked:translate-x-5" />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlaceholderPanel({ name }: { name: string }) {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="surface-mica flex items-center justify-between rounded-lg p-4"
        >
          <div>
            <div className="text-sm font-medium">Option {i}</div>
            <div className="text-xs text-muted-foreground">
              A configurable setting for {name}
            </div>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input type="checkbox" defaultChecked={i % 2 === 0} className="peer sr-only" />
            <div className="h-6 w-11 rounded-full bg-white/15 transition peer-checked:bg-primary" />
            <div className="absolute left-0.5 top-0.5 size-5 rounded-full bg-white transition peer-checked:translate-x-5" />
          </label>
        </div>
      ))}
    </div>
  );
}
