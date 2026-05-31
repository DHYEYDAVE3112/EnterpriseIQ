import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Github, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in — EnterpriseIQ" }, { name: "description", content: "Sign in to your EnterpriseIQ account." }] }),
  component: LoginPage,
});

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
type FormValues = z.infer<typeof schema>;

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    toast.success("Welcome back");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen grid place-items-center px-6 bg-background">
      <div className="w-full max-w-[400px]">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="h-7 w-7 rounded bg-brand grid place-items-center"><Sparkles className="h-4 w-4 text-primary-foreground" /></div>
          <span className="font-semibold tracking-tight text-lg">EnterpriseIQ</span>
        </Link>

        <div className="rounded-lg border border-border bg-card p-6">
          <h1 className="text-xl font-semibold">Sign in</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back. Continue to your workspaces.</p>

          <button onClick={() => { toast.success("Signed in with GitHub"); navigate({ to: "/dashboard" }); }} className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-md border border-border bg-elevated hover:border-border-hover px-4 py-2.5 text-sm font-medium active:scale-95 transition">
            <Github className="h-4 w-4" /> Sign in with GitHub
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex-1 border-t border-border" /> or <div className="flex-1 border-t border-border" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1.5">Email</label>
              <input {...register("email")} type="email" placeholder="you@company.com" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand" />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium">Password</label>
                <button type="button" className="text-xs text-muted-foreground hover:text-foreground">Forgot password?</button>
              </div>
              <input {...register("password")} type="password" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand" />
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
            </div>
            <button disabled={loading} className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-brand hover:bg-brand-hover text-primary-foreground px-4 py-2.5 text-sm font-medium active:scale-95 transition disabled:opacity-60">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />} {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don't have an account? <Link to="/register" className="text-brand hover:text-brand-hover">Register</Link>
        </p>
      </div>
    </div>
  );
}
