// hello
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { COUNTRIES, RIGHTS_CATEGORIES } from "@/lib/constants";

export default function RightsHubPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-6 py-12">
        <div className="grid gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Rights hub</p>
          <h1 className="text-5xl tracking-tight">Browse free rights pages by country and issue</h1>
          <p className="max-w-3xl text-lg leading-8 text-text-secondary">
            Each page gives a calm, practical overview of common legal rights and the next steps people usually take.
          </p>
        </div>

        <div className="mt-10 grid gap-6">
          <section className="grid gap-4">
            <h2 className="text-3xl tracking-tight">Countries</h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {COUNTRIES.map((country) => (
                <Card key={country.code}>
                  <CardHeader>
                    <CardTitle>{country.label}</CardTitle>
                    <CardDescription>
                      {country.requiresSubdivision ? `Supports ${country.subdivisionLabel ?? "a subdivision"} selection.` : "General country overview."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-3">
                    {RIGHTS_CATEGORIES.slice(0, 3).map((category) => (
                      <Link
                        key={category.key}
                        href={`/rights/${country.code}/${category.key}`}
                        className="rounded-2xl border border-border bg-surface px-4 py-2 text-sm text-text-primary hover:bg-surface-elevated"
                      >
                        {category.label}
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="grid gap-4">
            <h2 className="text-3xl tracking-tight">Common legal topics</h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {RIGHTS_CATEGORIES.map((category) => (
                <Card key={category.key}>
                  <CardHeader>
                    <CardTitle>{category.label}</CardTitle>
                    <CardDescription>{category.summary}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
