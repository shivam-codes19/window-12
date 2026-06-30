import { useState } from "react";
import { ArrowLeft, ArrowRight, RotateCw, Home } from "lucide-react";

export function Edge() {
  const [url, setUrl] = useState("https://start.lovable.dev");
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border/60 px-3 py-2">
        <button className="rounded p-1 hover:bg-white/10">
          <ArrowLeft className="size-4" />
        </button>
        <button className="rounded p-1 hover:bg-white/10">
          <ArrowRight className="size-4" />
        </button>
        <button className="rounded p-1 hover:bg-white/10">
          <RotateCw className="size-4" />
        </button>
        <button className="rounded p-1 hover:bg-white/10">
          <Home className="size-4" />
        </button>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="ml-2 flex-1 rounded-full bg-white/10 px-3 py-1 text-sm outline-none focus:bg-white/15"
        />
      </div>
      <div className="grid flex-1 place-items-center text-center">
        <div>
          <div className="text-6xl">🌐</div>
          <div className="mt-4 text-xl font-semibold">New Tab</div>
          <div className="mt-1 text-sm text-muted-foreground">
            Sandbox browser · navigation simulated
          </div>
        </div>
      </div>
    </div>
  );
}
