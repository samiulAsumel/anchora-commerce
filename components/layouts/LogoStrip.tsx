import { Container } from '@/components/ui/Container';

const demoBrands = ['Northlane', 'Fernbridge Goods', 'Cobalt & Co', 'Driftwood Supply', 'Amberly'];

export function LogoStrip() {
  return (
    <div className="border-y border-border bg-surface py-10">
      <Container>
        <p className="text-center text-xs font-medium tracking-wide text-foreground/60 uppercase">
          Demo storefronts built on Anchora
        </p>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {demoBrands.map((brand) => (
            <li key={brand} className="text-lg font-semibold text-foreground/40">
              {brand}
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
