export function StorefrontPreview() {
  return (
    <div className="aspect-[4/3] rounded-xl bg-background p-5">
      <div className="h-2.5 w-32 rounded-full bg-navy/20" />
      <div className="mt-5 grid grid-cols-3 gap-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rounded-lg border border-border p-2">
            <div className={i === 1 ? 'aspect-square rounded-md bg-orange/25' : 'aspect-square rounded-md bg-navy/10'} />
            <div className="mt-2 h-1.5 w-3/4 rounded-full bg-foreground/15" />
            <div className="mt-1.5 h-1.5 w-1/2 rounded-full bg-foreground/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
