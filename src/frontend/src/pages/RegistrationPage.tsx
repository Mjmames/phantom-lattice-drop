import { FreeRaffleSection } from "@/components/FreeRaffleSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useRegistration } from "@/hooks/useRegistration";
import { TIER_CONFIG, type Tier, getTierInfo } from "@/types";
import { AlertCircle, CheckCircle, Sparkles, Wallet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function RegistrationPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [walletAddress, setWalletAddress] = useState("");
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
  const [duplicateError, setDuplicateError] = useState(false);
  const register = useRegistration();

  const isValidWallet = (addr: string) =>
    /^0x[a-fA-F0-9]{40}$/.test(addr.trim());

  const handleNextFromWallet = () => {
    if (isValidWallet(walletAddress)) {
      setDuplicateError(false);
      setStep(2);
    }
  };

  const handleNextFromTier = () => {
    if (selectedTier !== null) {
      setDuplicateError(false);
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    if (!walletAddress.trim() || selectedTier === null) return;
    setDuplicateError(false);
    try {
      await register.mutateAsync({
        walletAddress: walletAddress.trim(),
        tier: selectedTier,
      });
      setStep(4);
    } catch (err) {
      if (err instanceof Error && err.message.includes("already registered")) {
        setDuplicateError(true);
      } else {
        toast.error("Registration failed", {
          description: err instanceof Error ? err.message : "Please try again.",
        });
      }
    }
  };

  const handleReset = () => {
    setWalletAddress("");
    setSelectedTier(null);
    setDuplicateError(false);
    setStep(1);
  };

  const tierInfo = selectedTier !== null ? getTierInfo(selectedTier) : null;

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12">
      <div className="text-center mb-8 sm:mb-10">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
          Airdrop Registration
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Register your Polygon wallet to claim your Phantom Lattice NFT airdrop
          allocation.
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                step >= s
                  ? "bg-primary text-primary-foreground glow-accent"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`w-8 h-0.5 rounded transition-all duration-300 ${
                  step > s ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Wallet Address */}
      {step === 1 && (
        <div className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wallet className="w-5 h-5 text-primary" />
                Wallet Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label
                  htmlFor="wallet"
                  className="text-sm text-muted-foreground mb-1.5 block"
                >
                  Polygon Wallet Address
                </Label>
                <Input
                  id="wallet"
                  placeholder="0x..."
                  value={walletAddress}
                  onChange={(e) => {
                    setWalletAddress(e.target.value);
                    setDuplicateError(false);
                  }}
                  className="font-mono bg-input border-border focus:ring-primary"
                  data-ocid="registration.wallet_input"
                />
                {walletAddress && !isValidWallet(walletAddress) && (
                  <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Please enter a valid 0x address (42 characters)
                  </p>
                )}
              </div>
              <Button
                type="button"
                size="lg"
                className="w-full glow-accent-hover"
                disabled={!isValidWallet(walletAddress)}
                onClick={handleNextFromWallet}
                data-ocid="registration.wallet_next_button"
              >
                Next
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 2: Tier Selection */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Select Your Tier
            </h2>
            <div className="flex flex-col gap-3">
              {TIER_CONFIG.map((tier) => {
                const isSelected = selectedTier === tier.id;
                return (
                  <div
                    key={tier.id}
                    onClick={() => setSelectedTier(tier.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedTier(tier.id);
                      }
                    }}
                    className={`relative text-left rounded-xl border p-4 transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary/10 glow-accent"
                        : "border-border bg-card hover:border-primary/50 hover:bg-muted/30"
                    }`}
                    data-ocid={`registration.tier.${tier.id}.button`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant={isSelected ? "default" : "secondary"}
                        className="text-xs"
                      >
                        Tier {tier.id}
                      </Badge>
                      {isSelected && (
                        <CheckCircle className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground text-sm mb-1">
                      {tier.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      {tier.description}
                    </p>
                    <div className="text-lg font-bold text-primary">
                      ${tier.usdValue} USD
                    </div>
                    <a
                      href={tier.stripeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center justify-center w-full mt-3 px-4 py-2 rounded-lg bg-primary/15 border border-primary/40 text-primary text-sm font-semibold hover:bg-primary/25 hover:glow-accent-hover transition-smooth"
                      data-ocid={`registration.tier.${tier.id}.buy_now_button`}
                    >
                      Buy Now
                    </a>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setStep(1)}
              data-ocid="registration.tier_back_button"
            >
              Back
            </Button>
            <Button
              type="button"
              size="lg"
              className="flex-1 glow-accent-hover"
              disabled={selectedTier === null}
              onClick={handleNextFromTier}
              data-ocid="registration.tier_next_button"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && tierInfo && (
        <div className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle className="w-5 h-5 text-primary" />
                Confirm Your Registration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    Wallet Address
                  </span>
                  <span className="font-mono text-sm text-foreground break-all">
                    {walletAddress.trim()}
                  </span>
                </div>
                <Separator />
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    Selected Tier
                  </span>
                  <span className="text-sm text-foreground font-medium">
                    {tierInfo.name}
                  </span>
                </div>
                <Separator />
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    Allocation Value
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    ${tierInfo.usdValue} USD
                  </span>
                </div>
              </div>

              {duplicateError && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">
                    This wallet address is already registered.
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep(2)}
                  data-ocid="registration.confirm_back_button"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  size="lg"
                  className="flex-1 glow-accent-hover"
                  disabled={register.isPending}
                  onClick={handleSubmit}
                  data-ocid="registration.confirm_submit_button"
                >
                  {register.isPending ? "Registering…" : "Confirm & Submit"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 4: Success */}
      {step === 4 && tierInfo && (
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 glow-accent mb-4">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              Registration Complete
            </h2>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Your wallet has been successfully registered for the Phantom
              Lattice airdrop.
            </p>
          </div>
          <Card className="border-border bg-card max-w-sm mx-auto">
            <CardContent className="py-5 space-y-3">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Wallet
                </span>
                <span className="font-mono text-sm text-foreground break-all">
                  {walletAddress.trim()}
                </span>
              </div>
              <Separator />
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Tier
                </span>
                <span className="text-sm text-foreground font-medium">
                  {tierInfo.name}
                </span>
              </div>
              <Separator />
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Allocation
                </span>
                <span className="text-2xl font-bold text-primary">
                  ${tierInfo.usdValue} USD
                </span>
              </div>
            </CardContent>
          </Card>
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            data-ocid="registration.success_reset_button"
          >
            Register Another Wallet
          </Button>
        </div>
      )}

      {/* Free Raffle Entry Section */}
      <div className="mt-12 pt-8 border-t border-border">
        <FreeRaffleSection />
      </div>
    </div>
  );
}
