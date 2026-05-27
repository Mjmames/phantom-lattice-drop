import { Button } from "@/components/ui/button";
import { Hexagon, Link2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const NFT_CONTRACT = "0x8dc40ec3b371879b43cc4c6b13198ff091eaacad";

export function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-card border-b border-border">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Decentralized Presence Protocol</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-4">
            Phantom Lattice
          </h1>

          <p className="text-xl sm:text-2xl text-muted-foreground font-light max-w-2xl mx-auto">
            Where Physical Presence Meets On-Chain Identity
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="bg-background py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 space-y-8">
          <div className="prose prose-invert max-w-none space-y-6">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              About Phantom Lattice
            </h2>

            <p className="text-lg text-foreground leading-relaxed">
              Phantom Lattice is a sovereign, post-blockchain distributed
              network — built for a world where decentralization shouldn't cost
              a fortune or require a chain.
            </p>

            <p className="text-base text-muted-foreground leading-relaxed">
              Where traditional blockchain systems depend on gas fees, miners,
              and slow consensus layers, Phantom Lattice encodes data into the
              phase relationships between nodes — a fundamentally different
              architecture designed to be safer, cheaper, and more scalable than
              anything that came before it. This is not a fork. This is not a
              Layer 2. This is a new foundation.
            </p>

            <h3 className="font-display text-xl sm:text-2xl font-semibold text-foreground pt-2">
              The ORB System
            </h3>

            <p className="text-base text-muted-foreground leading-relaxed">
              Phantom Lattice is governed by a three-tier ORB credential system
              — the proof of your place in the network. Each tier is capped,
              making early participation a finite opportunity:
            </p>

            <ul className="list-disc list-inside space-y-2 text-base text-muted-foreground leading-relaxed">
              <li>
                <span className="text-foreground font-medium">
                  Tier 1 — Testnet Node Operator (500 holders max)
                </span>{" "}
                — The earliest believers and active node runners who maintained
                phase coherence during the Phantom Lattice testnet phase
              </li>
              <li>
                <span className="text-foreground font-medium">
                  Tier 2 — Genesis Node Operator (2,000 holders max)
                </span>{" "}
                — Infrastructure contributors who helped bootstrap the genesis
                layer of the network
              </li>
              <li>
                <span className="text-foreground font-medium">
                  Tier 3 — Community Contributor (10,000 holders max)
                </span>{" "}
                — The broader lattice community powering growth, adoption, and
                decentralization
              </li>
            </ul>

            <p className="text-base text-muted-foreground leading-relaxed">
              Phantom Lattice exists because blockchain, for all its promise,
              was never meant to scale to the world. Gas fees exclude the many.
              Chain dependency creates single points of fragility. ORBs are not
              on-chain — they live on the lattice itself. Payments can be made
              in USD or Polygon, lowering the barrier for anyone who wants to
              participate without needing deep crypto knowledge.
            </p>

            <p className="text-base text-foreground font-medium leading-relaxed">
              One contract. Three tiers. One lattice.
            </p>
          </div>

          {/* NFT Contract Trust Signal */}
          <div className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
            <Hexagon className="w-5 h-5 text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                Verified NFT Contract
              </p>
              <p className="font-mono text-sm text-foreground truncate">
                {NFT_CONTRACT}
              </p>
            </div>
            <a
              href={`https://polygonscan.com/address/${NFT_CONTRACT}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto shrink-0 text-muted-foreground hover:text-primary transition-colors"
              aria-label="View on Polygonscan"
            >
              <Link2 className="w-4 h-4" />
            </a>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4 pt-4 pb-8">
            <Button
              asChild
              size="lg"
              className="glow-accent-hover text-base px-8 py-6 h-auto font-semibold"
              data-ocid="about.register_button"
            >
              <Link to="/choose">Register Your Wallet</Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              Join the Lattice and claim your ORB allocation
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
