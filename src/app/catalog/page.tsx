import { AppShell } from "@/components/AppShell";

const PLACEHOLDERS = Array.from({ length: 6 }, (_, i) => i + 1);

export default function CatalogPage() {
  return (
    <AppShell>
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">Каталог продуктов</h1>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PLACEHOLDERS.map((slot) => (
            <div key={slot} className="product-slot" aria-label={`Слот продукта ${slot}`}>
              Место для продукта
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
