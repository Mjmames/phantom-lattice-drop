import { ArrowRight, Hexagon, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const NFT_CONTRACT = "0x8dc40ec3b371879b43cc4c6b13198ff091eaacad";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-card border-b border-border shadow-subtle">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 group"
            data-ocid="nav.home_link"
          >
            <Hexagon className="w-6 h-6 text-primary group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-display text-lg font-semibold text-foreground tracking-tight">
              Phantom Lattice
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/choose"
              className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors duration-200 font-medium"
              data-ocid="nav.register_link"
            >
              <span className="hidden sm:inline">Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/admin/login"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              data-ocid="nav.admin_link"
            >
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 pb-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-mono bg-muted/50 px-2 py-0.5 rounded border border-border truncate">
              {NFT_CONTRACT}
            </span>
            <span className="shrink-0">Polygon</span>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-muted/40 border-t border-border mt-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>
            &copy; {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </span>
          <span className="font-mono text-xs">
            {NFT_CONTRACT.slice(0, 12)}…
          </span>
        </div>
      </footer>
    </div>
  );
}
