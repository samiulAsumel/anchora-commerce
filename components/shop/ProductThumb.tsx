function hueFromString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

export function ProductThumb({ name, className }: { name: string; className?: string }) {
  const hue = hueFromString(name);

  return (
    <div
      className={className}
      style={{ background: `linear-gradient(135deg, hsl(${hue} 45% 88%), hsl(${hue} 45% 78%))` }}
    >
      <span className="flex h-full w-full items-center justify-center text-2xl font-semibold text-black/30">
        {name
          .split(' ')
          .slice(0, 2)
          .map((w) => w[0])
          .join('')}
      </span>
    </div>
  );
}
