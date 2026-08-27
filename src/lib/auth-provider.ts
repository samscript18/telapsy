export interface AuthProviderAccount {
  googleSub?: unknown;
  authProvider?: "password" | "google" | "both";
}

export function isGoogleAccount(account: AuthProviderAccount | null | undefined) {
  return Boolean(account?.googleSub) || account?.authProvider === "google" || account?.authProvider === "both";
}

export function canUsePasswordAuthentication(account: AuthProviderAccount | null | undefined) {
  return Boolean(account) && !isGoogleAccount(account) && account?.authProvider === "password";
}
