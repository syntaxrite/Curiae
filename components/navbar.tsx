// hello
"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-surface text-xl">
            ⚖️
          </div>
          <div>
            <div className="text-lg font-semibold tracking-tight text-text-primary">Curiae</div>
            <div className="text-xs text-text-muted">Curiae legal guidance</div>
          </div>
        </Link>

        <nav className="flex items-center gap-3">
          <Link href="/rights" className="text-sm text-text-secondary hover:text-text-primary">
            Rights hub
          </Link>
          <Link href="/about" className="text-sm text-text-secondary hover:text-text-primary">
            About
          </Link>
          <SignedOut>
            <Link href="/sign-in">
              <Button variant="secondary" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm">Get started</Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <Button variant="secondary" size="sm">
                Dashboard
              </Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
}
