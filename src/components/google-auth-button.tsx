export function GoogleAuthButton({ next, intent }: { next?: string; intent: "signin" | "signup" }) {
  const params = new URLSearchParams({ intent });
  if (next) params.set("next", next);
  return <a href={`/api/auth/google?${params.toString()}`} className="btn btn-secondary w-full"><svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5"><path fill="#4285F4" d="M22.6 12.2c0-.7-.1-1.5-.2-2.2H12v4.3h6a5.2 5.2 0 0 1-2.2 3.3v2.8h3.6c2.1-2 3.2-4.8 3.2-8.2Z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.4-2.6l-3.6-2.8c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2v2.9A11.2 11.2 0 0 0 12 23Z"/><path fill="#FBBC05" d="M5.7 14.1a6.7 6.7 0 0 1 0-4.2V7H2a11.1 11.1 0 0 0 0 10l3.7-2.9Z"/><path fill="#EA4335" d="M12 5.3c1.7 0 3.2.6 4.3 1.7l3.2-3.2A10.8 10.8 0 0 0 2 7l3.7 2.9C6.6 7.2 9.1 5.3 12 5.3Z"/></svg>{intent === "signup" ? "Sign up with Google" : "Login with Google"}</a>;
}
