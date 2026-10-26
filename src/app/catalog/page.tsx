import { Logo } from "@/components/Logo";
import { AppShell } from "@/components/AppShell";

const PLACEHOLDERS = Array.from({ length: 6 }, (_, i) => i + 1);

export default function CatalogPage() {
  return (
    <AppShell>
      <section className="space-y-8">
        <div>
          <Logo size="lg" />
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">
            Каталог продуктов
          </h1>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
