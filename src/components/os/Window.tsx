import { useEffect, useRef, useState, type ReactNode } from "react";
import { Minus, Square, X, Copy } from "lucide-react";
import { useOS, type WindowState } from "@/store/os";

export function Window({ win, children }: { win: WindowState; children: ReactNode }) {
  const { focusWindow, closeWindow, minimizeWindow, toggleMaximize, moveWindow, resizeWindow } =
    useOS();
  const dragRef = useRef<{ startX: number; startY: number; winX: number; winY: number } | null>(
    null,
  );
  const resizeRef = useRef<{ startX: number; startY: number; w: number; h: number } | null>(null);
  const [, force] = useState(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dragRef.current) {
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;
        moveWindow(win.id, dragRef.current.winX + dx, Math.max(0, dragRef.current.winY + dy));
      } else if (resizeRef.current) {
        const dx = e.clientX - resizeRef.current.startX;
        const dy = e.clientY - resizeRef.current.startY;
        resizeWindow(win.id, resizeRef.current.w + dx, resizeRef.current.h + dy);
      }
    };
    const onUp = () => {
      dragRef.current = null;
      resizeRef.current = null;
      force((n) => n + 1);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [win.id, moveWindow, resizeWindow]);

  if (win.minimized) return null;

  const style: React.CSSProperties = win.maximized
    ? { left: 0, top: 0, width: "100vw", height: "calc(100vh - 56px)", zIndex: win.zIndex }
    : {
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
      };

  return (
    <div
      className="surface-mica shadow-window absolute flex flex-col overflow-hidden rounded-xl text-foreground"
      style={style}
      onMouseDown={() => focusWindow(win.id)}
    >
      {/* Title bar */}
      <div
        className="flex h-10 shrink-0 items-center justify-between pl-3 select-none"
        style={{ background: "var(--color-titlebar)" }}
        onMouseDown={(e) => {
          if ((e.target as HTMLElement).closest("[data-window-control]")) return;
          dragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            winX: win.x,
            winY: win.y,
          };
        }}
        onDoubleClick={() => toggleMaximize(win.id)}
      >
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="text-xs opacity-80">{win.title}</span>
        </div>
        <div className="flex" data-window-control>
          <button
            className="grid h-10 w-12 place-items-center hover:bg-white/10"
            onClick={() => minimizeWindow(win.id)}
            aria-label="Minimize"
          >
            <Minus className="size-4" />
          </button>
          <button
            className="grid h-10 w-12 place-items-center hover:bg-white/10"
            onClick={() => toggleMaximize(win.id)}
            aria-label="Maximize"
          >
            {win.maximized ? <Copy className="size-3.5" /> : <Square className="size-3.5" />}
          </button>
          <button
            className="grid h-10 w-12 place-items-center hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => closeWindow(win.id)}
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto bg-background/40">{children}</div>

      {/* Resize handle */}
      {!win.maximized && (
        <div
          className="absolute right-0 bottom-0 h-4 w-4 cursor-nwse-resize"
          onMouseDown={(e) => {
            e.stopPropagation();
            resizeRef.current = {
              startX: e.clientX,
              startY: e.clientY,
              w: win.width,
              h: win.height,
            };
          }}
        />
      )}
    </div>
  );
}
