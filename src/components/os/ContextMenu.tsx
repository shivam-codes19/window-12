import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export interface MenuItem {
  label?: string;
  icon?: ReactNode;
  shortcut?: string;
  onSelect?: () => void;
  disabled?: boolean;
  danger?: boolean;
  separator?: boolean;
}

interface MenuState {
  x: number;
  y: number;
  items: MenuItem[];
}

interface Ctx {
  open: (e: { clientX: number; clientY: number }, items: MenuItem[]) => void;
  close: () => void;
}

const ContextMenuContext = createContext<Ctx | null>(null);

export function useContextMenu() {
  const ctx = useContext(ContextMenuContext);
  if (!ctx) throw new Error("useContextMenu must be used within ContextMenuProvider");
  return ctx;
}

export function ContextMenuProvider({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState<MenuState | null>(null);

  const open: Ctx["open"] = useCallback((e, items) => {
    const maxX = window.innerWidth - 240;
    const maxY = window.innerHeight - items.length * 32 - 20;
    setMenu({ x: Math.min(e.clientX, maxX), y: Math.min(e.clientY, maxY), items });
  }, []);
  const close = useCallback(() => setMenu(null), []);

  useEffect(() => {
    if (!menu) return;
    const onDown = () => close();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    window.addEventListener("blur", close);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("blur", close);
    };
  }, [menu, close]);

  return (
    <ContextMenuContext.Provider value={{ open, close }}>
      {children}
      {menu && (
        <div
          className="surface-acrylic shadow-window fixed z-[100] min-w-56 rounded-lg p-1 text-sm"
          style={{ left: menu.x, top: menu.y }}
          onMouseDown={(e) => e.stopPropagation()}
          onContextMenu={(e) => e.preventDefault()}
        >
          {menu.items.map((item, i) =>
            item.separator ? (
              <div key={i} className="my-1 h-px bg-border" />
            ) : (
              <button
                key={i}
                disabled={item.disabled}
                onClick={() => {
                  item.onSelect?.();
                  close();
                }}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-1.5 text-left transition disabled:opacity-40 ${
                  item.danger
                    ? "hover:bg-destructive hover:text-destructive-foreground"
                    : "hover:bg-white/10"
                }`}
              >
                <span className="grid size-4 place-items-center opacity-80">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.shortcut && (
                  <span className="text-xs text-muted-foreground">{item.shortcut}</span>
                )}
              </button>
            ),
          )}
        </div>
      )}
    </ContextMenuContext.Provider>
  );
}
