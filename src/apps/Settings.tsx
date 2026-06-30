import { useState } from "react";
import { Monitor, Bluetooth, Wifi, Palette, User, Info } from "lucide-react";

const SECTIONS = [
  { id: "system", name: "System", icon: Monitor },
  { id: "devices", name: "Bluetooth & devices", icon: Bluetooth },
  { id: "network", name: "Network & internet", icon: Wifi },
  { id: "personalize", name: "Personalization", icon: Palette },
  { id: "accounts", name: "Accounts", icon: User },
  { id: "about", name: "About", icon: Info },
];

export function Settings() {
  const [active, setActive] = useState("system");
  const section = SECTIONS.find((s) => s.id === active)!;
  return (
    <div className="flex h-full">
      <aside className="w-60 shrink-0 border-r border-border/60 p-2">
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

        <div className="mt-6 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="surface-mica flex items-center justify-between rounded-lg p-4"
            >
              <div>
                <div className="text-sm font-medium">Option {i}</div>
                <div className="text-xs text-muted-foreground">
                  A configurable setting for {section.name}
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" defaultChecked={i % 2 === 0} className="peer sr-only" />
                <div className="h-6 w-11 rounded-full bg-white/15 peer-checked:bg-primary transition" />
                <div className="absolute left-0.5 top-0.5 size-5 rounded-full bg-white transition peer-checked:translate-x-5" />
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
