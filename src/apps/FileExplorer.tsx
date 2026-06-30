import { useState } from "react";
import { Folder, FileText, Image as ImageIcon, Music, Video, Download } from "lucide-react";

const SIDEBAR = [
  { name: "Home", icon: Folder },
  { name: "Documents", icon: FileText },
  { name: "Pictures", icon: ImageIcon },
  { name: "Music", icon: Music },
  { name: "Videos", icon: Video },
  { name: "Downloads", icon: Download },
];

const FILES = [
  { name: "Documents", type: "folder", size: "—" },
  { name: "Pictures", type: "folder", size: "—" },
  { name: "Projects", type: "folder", size: "—" },
  { name: "readme.txt", type: "file", size: "2 KB" },
  { name: "budget.xlsx", type: "file", size: "44 KB" },
  { name: "vacation.jpg", type: "file", size: "1.2 MB" },
];

export function FileExplorer() {
  const [active, setActive] = useState("Home");
  return (
    <div className="flex h-full">
      <aside className="w-48 shrink-0 border-r border-border/60 p-2 text-sm">
        {SIDEBAR.map((s) => (
          <button
            key={s.name}
            onClick={() => setActive(s.name)}
            className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition ${
              active === s.name ? "bg-primary/20 text-foreground" : "hover:bg-white/5"
            }`}
          >
            <s.icon className="size-4 opacity-80" />
            {s.name}
          </button>
        ))}
      </aside>
      <div className="flex-1 p-4">
        <div className="mb-3 text-xs text-muted-foreground">This PC › {active}</div>
        <div className="grid grid-cols-[1fr_120px_120px] gap-1 text-xs font-medium text-muted-foreground">
          <div>Name</div>
          <div>Type</div>
          <div>Size</div>
        </div>
        <div className="mt-1 divide-y divide-border/40">
          {FILES.map((f) => (
            <div
              key={f.name}
              className="grid cursor-default grid-cols-[1fr_120px_120px] items-center gap-1 rounded px-1 py-1.5 text-sm hover:bg-white/5"
            >
              <div className="flex items-center gap-2">
                {f.type === "folder" ? (
                  <Folder className="size-4 text-primary" />
                ) : (
                  <FileText className="size-4 opacity-80" />
                )}
                {f.name}
              </div>
              <div className="text-muted-foreground">{f.type}</div>
              <div className="text-muted-foreground">{f.size}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
