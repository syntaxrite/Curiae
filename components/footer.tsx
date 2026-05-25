// hello
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-text-secondary">
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/about" className="hover:text-text-primary">
            About
          </Link>
          <Link href="/rights" className="hover:text-text-primary">
            Rights hub
          </Link>
          <Link href="/sign-in" className="hover:text-text-primary">
            Sign in
          </Link>
          <Link href="/sign-up" className="hover:text-text-primary">
            Sign up
          </Link>
        </div>
        <p>
          Curiae provides legal information, not legal advice. For serious matters, deadlines, or safety concerns,
          speak with a qualified lawyer.
        </p>
      </div>
    </footer>
  );
}
