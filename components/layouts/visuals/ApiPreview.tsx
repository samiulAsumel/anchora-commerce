const lines = [
  { indent: 0, text: 'POST /api/v1/products', tone: 'text-orange' },
  { indent: 1, text: '"name": "Field Jacket",', tone: 'text-foreground/70' },
  { indent: 1, text: '"priceCents": 12900,', tone: 'text-foreground/70' },
  { indent: 1, text: '"inventory": 40', tone: 'text-foreground/70' },
  { indent: 0, text: '201 Created', tone: 'text-navy dark:text-navy-light' },
];

export function ApiPreview() {
  return (
    <div className="aspect-[4/3] rounded-xl bg-navy p-5 font-mono text-xs text-white/90 dark:bg-background">
      <div className="flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
      </div>
      <pre className="mt-5 space-y-1.5 whitespace-pre-wrap">
        {lines.map((line, i) => (
          <div key={i} style={{ paddingLeft: `${line.indent * 16}px` }} className={line.tone}>
            {line.text}
          </div>
        ))}
      </pre>
    </div>
  );
}
