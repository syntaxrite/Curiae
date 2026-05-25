// hello
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { StandardSearch } from "@/components/standard-search";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RIGHTS_CATEGORIES, COUNTRIES } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

const featureCards = [
  {
    title: "Structured answers",
    description: "Curiae turns legal questions into plain-English guidance with jurisdiction-aware context."
  },
  {
    title: "Document analysis",
    description: "Upload notices, agreements, or letters and get a clear breakdown of legal risk and next steps."
  },
  {
    title: "Rights hub",
    description: "Browse free, programmatic rights pages by country and common legal situation."
  }
] as const;

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Navbar />
      <main className="mx-auto grid w-full max-w-7xl gap-16 px-6 py-12">
        <section className="grid gap-8 border-b border-border pb-10">
          <div className="grid max-w-3xl gap-5">
            <Badge tone="muted" className="w-fit">
              Free and open source
            </Badge>
            <h1 className="text-5xl leading-tight tracking-tight">
              Legal guidance that feels calm, clear, and jurisdiction-aware.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-text-secondary">
              Curiae explains legal questions, highlights risk, and maps practical next steps without
              hiding the important caveats.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-[1.25fr_0.75fr]">
            <StandardSearch />
            <Card>
              <CardHeader>
                <CardTitle>Supported countries</CardTitle>
                <CardDescription>Jurisdiction-aware guidance for launch markets.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                {COUNTRIES.map((country) => (
                  <div key={country.code} className="rounded-2xl border border-border bg-surface p-3 text-sm">
                    {country.label}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-6">
          <h2 className="text-3xl tracking-tight">Why people use Curiae</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {featureCards.map((card) => (
              <Card key={card.title}>
                <CardHeader>
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-6">
          <h2 className="text-3xl tracking-tight">Popular rights topics</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {RIGHTS_CATEGORIES.map((category) => (
              <Link
                key={category.key}
                href={`/rights/uk/${category.key}`}
                className="rounded-3xl border border-border bg-white p-5 shadow-soft transition-transform hover:-translate-y-0.5"
              >
                <p className="text-lg font-semibold">{category.label}</p>
                <p className="mt-2 text-sm leading-6 text-text-secondary">{category.summary}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-border bg-surface p-8">
          <div className="grid gap-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Ready to try Curiae</p>
            <h2 className="text-3xl tracking-tight">Ask a question, review a document, or browse rights pages.</h2>
            <p className="max-w-3xl text-base leading-7 text-text-secondary">
              The first release stays free. Sign in to use the dashboard, history, jurisdiction settings, and document
              analysis tools.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/sign-up" className="rounded-2xl bg-accent px-5 py-3 text-sm font-medium text-white">
              Get started
            </Link>
            <Link href="/rights" className="rounded-2xl border border-border bg-white px-5 py-3 text-sm font-medium text-text-primary">
              Explore rights
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
      }
