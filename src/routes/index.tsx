import { createFileRoute } from "@tanstack/react-router";
import { Desktop } from "@/components/os/Desktop";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Windows 12 Web" },
      { name: "description", content: "A browser-based Windows 12 shell — desktop, taskbar, start menu, and windowed apps." },
      { property: "og:title", content: "Windows 12 Web" },
      { property: "og:description", content: "A browser-based Windows 12 shell built with React." },
    ],
  }),
  component: Index,
});

function Index() {
  return <Desktop />;
}
