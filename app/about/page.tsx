// hello
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-6 py-12">
        <div className="grid gap-6">
          <h1 className="text-5xl tracking-tight">About Curiae</h1>
          <p className="max-w-3xl text-lg leading-8 text-text-secondary">
            Curiae is an open-source legal guidance platform designed to make legal information easier to understand.
            Curiae explains laws in plain English, highlights risk, and encourages users to seek licensed help when a
            matter is serious.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Mission</CardTitle>
              <CardDescription>Build a calm, trustworthy starting point for legal questions.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-text-secondary">
              The goal is to reduce confusion, not to replace a lawyer. Curiae helps people understand what a rule
              might mean in a specific jurisdiction and what to do next.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How Curiae works</CardTitle>
              <CardDescription>Structured AI output with jurisdiction context.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-text-secondary">
              Users select a country and, where relevant, a state or province. Curiae then shapes the answer around that
              legal system and marks situations that need extra caution.
            </CardContent>
          </Card>
        </div>

        <Card className="mt-5 border-danger/20 bg-danger-soft">
          <CardHeader>
            <CardTitle>Disclaimer</CardTitle>
            <CardDescription>Important for every visitor.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-text-primary">
            <p>
              Curiae provides legal information only. It does not create a lawyer-client relationship and it does not
              provide legal representation, emergency support, or a guarantee of accuracy.
            </p>
            <p>
              If you are facing arrest, eviction, deadlines, immigration action, custody issues, domestic violence, or
              another time-sensitive legal problem, contact a licensed lawyer or local legal aid service right away.
            </p>
            <Link href="/sign-up" className="inline-flex rounded-2xl bg-accent px-5 py-3 font-medium text-white">
              Create an account
            </Link>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
