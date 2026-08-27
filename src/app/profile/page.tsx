"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AtSign,
  CalendarDays,
  Camera,
  Check,
  CheckCircle2,
  ImagePlus,
  KeyRound,
  Mail,
  PencilLine,
  ShieldCheck,
  UserRound,
  WalletCards,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AccountShell } from "@/components/account-shell";
import { formatMoney } from "@/lib/pricing";
import type { SessionUser } from "@/types";

export default function ProfilePage() {
  const client = useQueryClient();
  const { data } = useQuery<{ user: SessionUser }>({
    queryKey: ["me"],
    queryFn: () => fetch("/api/auth/me").then((response) => response.json()),
  });
  const [status, setStatus] = useState("");
  const [imageStatus, setImageStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingImage, setSavingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState("");

  async function update(body: object) {
    const response = await fetch("/api/auth/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? "Could not update profile.");
    client.setQueryData(["me"], result);
    return result;
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus("");
    try {
      const name = String(new FormData(event.currentTarget).get("name") ?? "");
      await update({ name });
      setStatus("Your profile details are now up to date.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not update profile.");
    }
    setSaving(false);
  }

  function chooseImage(file?: File) {
    setImageStatus("");
    if (!file) return;
    if (!(["image/jpeg", "image/png", "image/webp"] as string[]).includes(file.type)) {
      setImageStatus("Choose a JPEG, PNG, or WebP image.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setImageStatus("Choose an image smaller than 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(String(reader.result));
      setImageName(file.name);
    };
    reader.readAsDataURL(file);
  }

  async function saveImage() {
    if (!imagePreview) return;
    setSavingImage(true);
    setImageStatus("");
    try {
      await update({ profileImage: imagePreview });
      setImageStatus("Your profile image has been updated.");
      setImageName("");
    } catch (error) {
      setImageStatus(error instanceof Error ? error.message : "Could not update profile image.");
    }
    setSavingImage(false);
  }

  const user = data?.user;
  const provider = user?.authProvider === "google" ? "Google" : "Email and password";
  const joined = user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" }) : "Active account";
  const activeImage = imagePreview ?? user?.profileImage;

  return (
    <AccountShell title="Profile" eyebrow="Identity">
      {user && (
        <div className="account-page mx-auto max-w-6xl">
          <header className="account-page-header" data-reveal>
            <span>Your Telapsy identity</span>
            <h2>A profile built around your shopping experience.</h2>
            <p>Keep your account recognizable and the details attached to every order accurate.</p>
          </header>

          <section className="profile-identity-hero" data-reveal aria-labelledby="profile-name">
            <Avatar name={user.name} image={activeImage} className="profile-avatar overflow-hidden" />
            <div className="profile-identity-copy">
              <span><UserRound size={13} />Account profile</span>
              <h2 id="profile-name">{user.name}</h2>
              <p>{user.email}</p>
              <div><span data-tone="positive"><CheckCircle2 size={13} />Active</span><span><ShieldCheck size={13} />Verified account</span></div>
            </div>
            <div className="profile-hero-actions"><a href="#profile-photo"><Camera size={15} />Edit photo</a><Link href="/settings#security"><ShieldCheck size={15} />Security</Link></div>
          </section>

          <div className="profile-content-grid">
            <section className="account-panel" aria-labelledby="profile-details-title">
              <PanelHeader icon={<UserRound size={17} />} kicker="Account record" title="Your profile details" description="Identity and account information securely connected to Telapsy." id="profile-details-title" />
              <dl className="profile-detail-grid">
                <Detail icon={<Mail size={16} />} label="Email address" value={user.email} />
                <Detail icon={<AtSign size={16} />} label="Display name" value={user.name} />
                <Detail icon={<ShieldCheck size={16} />} label="Account status" value="Active and verified" />
                <Detail icon={<KeyRound size={16} />} label="Login method" value={provider} />
                <Detail icon={<CalendarDays size={16} />} label="Member since" value={joined} />
                <Detail icon={<WalletCards size={16} />} label="Available balance" value={formatMoney(user.balanceCents)} />
              </dl>
            </section>

            <section id="profile-photo" className="account-panel scroll-mt-24" aria-labelledby="profile-photo-title">
              <PanelHeader icon={<Camera size={17} />} kicker="Profile photo" title="Keep your account recognizable" description="Choose a clear image that will identify your Telapsy account." id="profile-photo-title" />
              <div className="mt-5 flex items-center gap-4 rounded-2xl border border-[var(--line)] bg-black/15 p-4">
                <Avatar name={user.name} image={activeImage} className="size-16 overflow-hidden rounded-2xl border border-[var(--line)]" />
                <div className="min-w-0"><strong className="block text-sm font-medium text-[var(--ink)]">Current account image</strong><span className="mt-1 block truncate text-xs text-[var(--faint)]">{imageName || "Shown across your profile and account."}</span></div>
              </div>
              <label className="mt-4 grid min-h-40 cursor-pointer place-items-center rounded-2xl border border-dashed border-[rgba(232,185,106,.24)] bg-[rgba(232,185,106,.035)] p-6 text-center transition hover:border-[rgba(232,185,106,.48)] hover:bg-[rgba(232,185,106,.06)]">
                <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => chooseImage(event.target.files?.[0])} />
                <span><ImagePlus className="mx-auto text-[var(--accent)]" size={24} /><strong className="mt-3 block text-sm font-medium text-[var(--ink)]">Choose an image</strong><small className="mt-1 block text-[10px] leading-5 text-[var(--faint)]">JPEG, PNG or WebP · Maximum 2 MB</small></span>
              </label>
              {imageStatus && <p role="status" className="account-form-status"><Check size={14} />{imageStatus}</p>}
              <button type="button" onClick={saveImage} disabled={!imagePreview || savingImage} className="btn btn-primary mt-4 w-full rounded-full py-3 text-xs disabled:cursor-not-allowed disabled:opacity-40">{savingImage ? "Updating image…" : "Update profile image"}</button>
            </section>
          </div>

          <form onSubmit={save} className="account-panel mt-5" aria-labelledby="edit-profile-title">
            <PanelHeader icon={<PencilLine size={17} />} kicker="Profile details" title="Present a clear identity" description="This name appears throughout your account and order history." id="edit-profile-title" />
            <fieldset className="account-fieldset"><legend>Personal identity</legend><p>Choose the full name you want Telapsy to use.</p><label><span>Full name</span><input key={user.name} name="name" defaultValue={user.name} required minLength={2} autoComplete="name" /></label><label><span>Email address</span><input value={user.email} disabled /><small>Your login email is locked for account security.</small></label></fieldset>
            {status && <p role="status" className="account-form-status"><Check size={14} />{status}</p>}
            <footer className="account-form-footer"><span>Changes apply across your Telapsy account.</span><button disabled={saving}>{saving ? "Saving profile…" : "Save profile"}</button></footer>
          </form>
        </div>
      )}
    </AccountShell>
  );
}

function Avatar({ name, image, className }: { name: string; image?: string | null; className: string }) {
  return image ? <span className={`relative block ${className}`}><Image src={image} alt={`${name} profile`} fill unoptimized className="object-cover" sizes="96px" /></span> : <span className={className}>{name.slice(0, 1).toUpperCase()}</span>;
}

function PanelHeader({ icon, kicker, title, description, id }: { icon: React.ReactNode; kicker: string; title: string; description: string; id: string }) { return <header className="account-panel-header"><span>{icon}</span><div><small>{kicker}</small><h3 id={id}>{title}</h3><p>{description}</p></div></header>; }
function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div><span>{icon}</span><div><dt>{label}</dt><dd>{value}</dd></div></div>; }
