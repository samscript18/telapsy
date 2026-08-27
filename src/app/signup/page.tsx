import { AuthForm } from "@/components/auth-form";
import { GoogleAuthButton } from "@/components/google-auth-button";
const messages: Record<string, string> = { google_not_configured: "Google signup needs GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET configuration.", google_state: "Google signup expired. Please try again.", google_account_exists: "That Google account already belongs to Telapsy. Login with Google instead.", google_email_exists: "That email already has a Telapsy account. Use its original login method.", google_failed: "Google signup could not be completed." };
export default async function SignupPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  const { error, next } = await searchParams;
  return (
    <div className="shell grid min-h-[680px] place-items-center py-12">
      <section className="rounded-xl border border-[var(--line)] bg-[var(--surface)] w-full max-w-md p-8 sm:p-10 shadow-2xl">
        <p className="eyebrow">Join Telapsy</p>
        <h1 className="mt-2 text-3xl font-extralight tracking-[-0.04em] text-[var(--ink)]">Create an Account</h1>
        <p className="mt-3 text-xs leading-relaxed font-light text-[var(--muted)]">
          Every new registration receives an instant <span className="font-mono text-[var(--accent)]">$1,000.00</span> in Telapsy credits applied to your account.
        </p>

        {error && messages[error] && <p role="alert" className="mt-5 rounded-lg border border-[var(--retired)]/30 bg-[var(--retired)]/10 p-3 text-xs font-mono text-[var(--retired)]">{messages[error]}</p>}

        <div className="mt-6">
          <GoogleAuthButton next={next} intent="signup" />
          <div className="my-5 flex items-center gap-3 text-[10px] font-mono tracking-widest text-[var(--faint)] uppercase">
            <span className="h-px flex-1 bg-[var(--line)]" />
            or email
            <span className="h-px flex-1 bg-[var(--line)]" />
          </div>
        </div>

        <AuthForm mode="signup" next={next} />
      </section>
    </div>
  );
}
