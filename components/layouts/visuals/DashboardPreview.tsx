export function DashboardPreview() {
  const bars = [40, 65, 50, 80, 60, 90, 70];

  return (
    <div className="aspect-[4/3] rounded-xl bg-background p-5">
      <div className="flex items-center justify-between">
        <div className="h-2.5 w-24 rounded-full bg-navy/20" />
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-orange" />
          <span className="h-2.5 w-2.5 rounded-full bg-navy/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-navy/20" />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {['Revenue', 'Orders', 'Conversion'].map((label) => (
          <div key={label} className="rounded-lg border border-border p-3">
            <p className="text-[10px] font-medium text-foreground/50">{label}</p>
            <p className="mt-1 h-2 w-10 rounded-full bg-navy/30" />
          </div>
        ))}
      </div>

      <div className="mt-5 flex h-32 items-end gap-2 rounded-lg border border-border p-4">
        {bars.map((h, i) => (
          <div
            key={i}
            style={{ height: `${h}%` }}
            className={i === bars.length - 2 ? 'flex-1 rounded-t bg-orange' : 'flex-1 rounded-t bg-navy/25'}
          />
        ))}
      </div>
    </div>
  );
}
