import { useEffect, useState } from "react";
import { Settings as SettingsIcon, X } from "lucide-react";
import { useOS, WIDGET_REGISTRY, type WidgetId } from "@/store/os";

function ClockWidget() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);
  return (
    <WidgetCard title="Clock" span={1}>
      <div className="text-4xl font-light tabular-nums">
        {now ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}
      </div>
      <div className="text-xs text-muted-foreground">
        {now ? now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" }) : ""}
      </div>
    </WidgetCard>
  );
}

function WeatherWidget() {
  return (
    <WidgetCard title="Weather" span={1}>
      <div className="flex items-center gap-3">
        <div className="text-4xl">⛅</div>
        <div>
          <div className="text-3xl font-light">21°</div>
          <div className="text-xs text-muted-foreground">Partly cloudy · Seattle</div>
        </div>
      </div>
    </WidgetCard>
  );
}

function CalendarWidget() {
  const today = new Date();
  const day = today.getDate();
  return (
    <WidgetCard title="Calendar" span={1}>
      <div className="text-xs uppercase tracking-wider text-primary">
        {today.toLocaleDateString([], { month: "short" })}
      </div>
      <div className="text-4xl font-light leading-none">{day}</div>
      <div className="mt-2 text-xs text-muted-foreground">No events today</div>
    </WidgetCard>
  );
}

function SystemWidget() {
  const [stats, setStats] = useState({ cpu: 12, ram: 38, net: 4 });
  useEffect(() => {
    const i = setInterval(
      () =>
        setStats({
          cpu: Math.round(8 + Math.random() * 30),
          ram: Math.round(30 + Math.random() * 25),
          net: Math.round(1 + Math.random() * 12),
        }),
      1500,
    );
    return () => clearInterval(i);
  }, []);
  return (
    <WidgetCard title="System" span={2}>
      <div className="space-y-2">
        {[
          { label: "CPU", value: stats.cpu, suffix: "%" },
          { label: "Memory", value: stats.ram, suffix: "%" },
          { label: "Network", value: stats.net, suffix: " MB/s" },
        ].map((row) => (
          <div key={row.label}>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{row.label}</span>
              <span className="tabular-nums">
                {row.value}
                {row.suffix}
              </span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${Math.min(100, row.value * (row.suffix === "%" ? 1 : 8))}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}

function NotesWidget() {
  const [text, setText] = useState("");
  useEffect(() => {
    setText(localStorage.getItem("win12-notes") ?? "Jot something down...");
  }, []);
  return (
    <WidgetCard title="Quick Notes" span={2}>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          localStorage.setItem("win12-notes", e.target.value);
        }}
        className="h-24 w-full resize-none rounded-md bg-white/5 p-2 text-sm outline-none focus:bg-white/10"
      />
    </WidgetCard>
  );
}

const WIDGET_COMPONENTS: Record<WidgetId, () => React.JSX.Element> = {
  clock: ClockWidget,
  weather: WeatherWidget,
  calendar: CalendarWidget,
  system: SystemWidget,
  notes: NotesWidget,
};

function WidgetCard({
  title,
  span,
  children,
}: {
  title: string;
  span: 1 | 2;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`surface-mica rounded-xl p-4 ${span === 2 ? "col-span-2" : ""}`}
    >
      <div className="mb-2 text-xs font-medium text-muted-foreground">{title}</div>
      {children}
    </div>
  );
}

export function WidgetsPanel() {
  const { widgetsOpen, toggleWidgets, enabledWidgets, toggleWidget, openApp } = useOS();

  return (
    <AnimatePresence>
      {widgetsOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={() => toggleWidgets(false)}
          />
          <motion.aside
            initial={{ x: -420, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -420, opacity: 0 }}
            transition={{ type: "spring", damping: 24, stiffness: 240 }}
            className="surface-acrylic fixed bottom-16 left-3 top-3 z-50 w-[400px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="text-sm font-semibold">Widgets</div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openApp("settings")}
                  className="grid size-8 place-items-center rounded-md hover:bg-white/10"
                  title="Widget settings"
                >
                  <SettingsIcon className="size-4" />
                </button>
                <button
                  onClick={() => toggleWidgets(false)}
                  className="grid size-8 place-items-center rounded-md hover:bg-white/10"
                  title="Close"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 overflow-auto p-3"
              style={{ maxHeight: "calc(100% - 110px)" }}>
              {WIDGET_REGISTRY.filter((w) => enabledWidgets[w.id]).map((w) => {
                const Comp = WIDGET_COMPONENTS[w.id];
                return <Comp key={w.id} />;
              })}
              {WIDGET_REGISTRY.every((w) => !enabledWidgets[w.id]) && (
                <div className="col-span-2 p-6 text-center text-sm text-muted-foreground">
                  No widgets enabled. Toggle some below.
                </div>
              )}
            </div>

            <div className="border-t border-white/10 p-3">
              <div className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                Add widgets
              </div>
              <div className="flex flex-wrap gap-1.5">
                {WIDGET_REGISTRY.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => toggleWidget(w.id)}
                    className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs transition ${
                      enabledWidgets[w.id]
                        ? "bg-primary/30 text-white"
                        : "bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <span>{w.icon}</span>
                    {w.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
