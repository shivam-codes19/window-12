export function About() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold">Windows 12</h1>
      <p className="mt-2 text-sm text-muted-foreground">Web Edition · Build 26100.web</p>

      <div className="surface-mica mt-6 rounded-lg p-5 text-sm">
        <dl className="grid grid-cols-[160px_1fr] gap-y-2">
          <dt className="text-muted-foreground">Device name</dt>
          <dd>LOVABLE-PC</dd>
          <dt className="text-muted-foreground">Processor</dt>
          <dd>Virtual WebCore @ 3.2 GHz</dd>
          <dt className="text-muted-foreground">Installed RAM</dt>
          <dd>16.0 GB</dd>
          <dt className="text-muted-foreground">System type</dt>
          <dd>64-bit web operating system</dd>
          <dt className="text-muted-foreground">Edition</dt>
          <dd>Windows 12 Web Pro</dd>
        </dl>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        © Lovable. A faithful Windows 12 shell rebuilt for the browser.
      </p>
    </div>
  );
}
