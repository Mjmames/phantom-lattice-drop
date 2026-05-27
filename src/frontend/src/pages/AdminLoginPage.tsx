import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdmin } from "@/hooks/useAdmin";
import { Lock, LogIn } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(password);
    if (success) {
      toast.success("Logged in successfully");
      navigate("/admin");
    } else {
      toast.error("Invalid password");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-20">
      <Card className="glow-accent-hover border-border">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="font-display text-xl">Admin Access</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password" className="sr-only">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input border-border focus:ring-primary"
                data-ocid="admin.login.password_input"
              />
            </div>
            <Button
              type="submit"
              className="w-full glow-accent-hover"
              data-ocid="admin.login.submit_button"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
