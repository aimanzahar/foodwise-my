import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Shield, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export default function Auth() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!authLoading && user) {
    return <Navigate to="/" replace />;
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        toast.success("Berjaya log masuk!");
      } else {
        await signUp(email, password);
        toast.success("Akaun berjaya dicipta.");
      }
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Permintaan tidak berjaya.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Shield className="h-8 w-8 text-primary" strokeWidth={2.5} />
            <span className="text-xl font-bold tracking-tight text-foreground">
              MasakApa
              <span className="text-muted-foreground font-medium"> × FoodSecure</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {isLogin ? "Log masuk ke akaun anda" : "Cipta akaun baru"}
          </p>
        </div>
        <form onSubmit={handleEmailAuth} className="space-y-3">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full h-11 px-3 text-sm rounded-lg bg-card card-shadow border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kata laluan"
              required
              minLength={6}
              className="w-full h-11 px-3 text-sm rounded-lg bg-card card-shadow border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Mail className="h-4 w-4" />
            )}
            {isLogin ? "Log Masuk" : "Daftar"}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          {isLogin ? "Belum ada akaun?" : "Sudah ada akaun?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-accent font-semibold hover:underline"
          >
            {isLogin ? "Daftar" : "Log Masuk"}
          </button>
        </p>
      </div>
    </div>
  );
}
