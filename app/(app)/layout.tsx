// hello
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/ask", label: "Ask Curiae" },
  { href: "/documents", label: "Documents" },
  { href: "/history", label: "History" },
  { href: "/settings", label: "Settings" }
] as const;

export default function AppLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <div className="mx-auto grid min-h-screen w-full max-w-[1600px] grid-cols-[280px_1fr]">
        <aside className="border-r border-border bg-surface px-5 py-6">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-white text-xl">
              ⚖️
            </div>
            <div>
              <div className="text-lg font-semibold tracking-tight">Curiae</div>
              <div className="text-xs text-text-muted">Curiae workspace</div>
            </div>
          </Link>

          <Separator className="my-6" />

          <nav className="grid gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-2xl border border-transparent px-4 py-3 text-sm text-text-secondary hover:border-border hover:bg-white hover:text-text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8 rounded-3xl border border-border bg-white p-4 text-sm text-text-secondary">
            <p className="font-semibold text-text-primary">Curiae reminder</p>
            <p className="mt-2 leading-6">
              Use the dashboard for quick context, the ask page for structured answers, and the documents page for file
              analysis.
            </p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col">
          <header className="flex h-20 items-center justify-between border-b border-border bg-background px-8">
            <div>
              <p className="text-sm text-text-muted">Curiae workspace</p>
              <h1 className="text-xl font-semibold tracking-tight text-text-primary">Curiae</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/rights" className="text-sm text-text-secondary hover:text-text-primary">
                Rights hub
              </Link>
              <UserButton afterSignOutUrl="/" />
            </div>
          </header>
          <main className="flex-1 px-8 py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
