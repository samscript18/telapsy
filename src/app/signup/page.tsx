import { AuthForm } from "@/components/auth-form";
import { GoogleAuthButton } from "@/components/google-auth-button";
export default function SignupPage() {
  return (
    <div className="shell grid min-h-[680px] place-items-center py-12">
      <section className="rounded-xl border border-[var(--line)] bg-[var(--surface)] w-full max-w-md p-8 sm:p-10 shadow-2xl">
        <p className="eyebrow">Join Telapsy</p>
        <h1 className="mt-2 text-3xl font-extralight tracking-[-0.04em] text-[var(--ink)]">Create an Account</h1>
        <p className="mt-3 text-xs leading-relaxed font-light text-[var(--muted)]">
          Every new registration receives an instant <span className="font-mono text-[var(--accent)]">$1,000.00</span> in Telapsy Member Credits applied to your account.
        </p>

        <div className="mt-6">
          <GoogleAuthButton />
          <div className="my-5 flex items-center gap-3 text-[10px] font-mono tracking-widest text-[var(--faint)] uppercase">
            <span className="h-px flex-1 bg-[var(--line)]" />
            or email
            <span className="h-px flex-1 bg-[var(--line)]" />
          </div>
        </div>

        <AuthForm mode="signup" />
      </section>
    </div>
  );
}
