import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Loader2, Sparkles, Check, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create your account — EnterpriseIQ" }, { name: "description", content: "Create your free EnterpriseIQ account." }] }),
  component: RegisterPage,
});

const schema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  password: z.string()
    .min(8, "At least 8 characters")
    .regex(/[A-Z]/, "Must include an uppercase letter")
    .regex(/[0-9]/, "Must include a number"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });
type FormValues = z.infer<typeof schema>;

function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema), mode: "onChange" });
  const pwd = watch("password") ?? "";

  const reqs = [
    { ok: pwd.length >= 8, label: "8+ characters" },
    { ok: /[A-Z]/.test(pwd), label: "1 uppercase letter" },
    { ok: /[0-9]/.test(pwd), label: "1 number" },
  ];

  const onSubmit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    toast.success("Account created");
    navigate({ to: "/onboarding" });
  };

  return (
    <div className="min-h-screen grid place-items-center px-6 py-10 bg-background">
      <div className="w-full max-w-[400px]">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="h-7 w-7 rounded bg-brand grid place-items-center"><Sparkles className="h-4 w-4 text-primary-foreground" /></div>
          <span className="font-semibold tracking-tight text-lg">EnterpriseIQ</span>
        </Link>

        <div className="rounded-lg border border-border bg-card p-6">
          <h1 className="text-xl font-semibold">Create your account</h1>
          <p className="text-sm text-muted-foreground mt-1">Start free. No credit card required.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-3">
            <Field label="Full Name" error={errors.fullName?.message}>
              <input {...register("fullName")} className="input" />
            </Field>
            <Field label="Email" error={errors.email?.message}>
              <input {...register("email")} type="email" className="input" />
            </Field>
            <Field label="Password" error={errors.password?.message}>
              <input {...register("password")} type="password" className="input" />
              <ul className="mt-2 space-y-1 text-xs">
                {reqs.map((r) => (
                  <li key={r.label} className={r.ok ? "text-success flex items-center gap-1.5" : "text-muted-foreground flex items-center gap-1.5"}>
                    {r.ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />} {r.label}
                  </li>
                ))}
              </ul>
            </Field>
            <Field label="Confirm Password" error={errors.confirmPassword?.message}>
              <input {...register("confirmPassword")} type="password" className="input" />
            </Field>
            <button disabled={loading} className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-brand hover:bg-brand-hover text-primary-foreground px-4 py-2.5 text-sm font-medium active:scale-95 transition disabled:opacity-60">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />} Create Account
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="text-brand hover:text-brand-hover">Sign in</Link>
        </p>
      </div>
      <style>{`.input{width:100%;border-radius:0.375rem;border:1px solid var(--border);background:var(--background);padding:0.5rem 0.75rem;font-size:0.875rem;outline:none}.input:focus{box-shadow:0 0 0 2px var(--brand)}`}</style>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
