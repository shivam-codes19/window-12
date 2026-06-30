import { useState } from "react";

export function Notepad() {
  const [text, setText] = useState("Welcome to Notepad.\n\nStart typing...");
  return (
    <div className="flex h-full flex-col">
      <div className="flex gap-4 border-b border-border/60 px-3 py-1.5 text-xs text-muted-foreground">
        <button className="hover:text-foreground">File</button>
        <button className="hover:text-foreground">Edit</button>
        <button className="hover:text-foreground">View</button>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 resize-none bg-transparent p-4 font-mono text-sm outline-none"
        spellCheck={false}
      />
      <div className="flex justify-between border-t border-border/60 px-3 py-1 text-xs text-muted-foreground">
        <span>Ln 1, Col 1</span>
        <span>{text.length} chars · UTF-8</span>
      </div>
    </div>
  );
}
