"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Check, PackageCheck, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import Link from "next/link";
import { AccountShell } from "@/components/account-shell";
import type { NotificationData } from "@/types";

const iconMap = { account: UserRound, order: PackageCheck, collection: Sparkles, security: ShieldCheck } as const;

function relativeTime(value: string) {
  const seconds = Math.round((new Date(value).getTime() - Date.now()) / 1000);
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (Math.abs(seconds) < 60) return formatter.format(seconds, "second");
  const minutes = Math.round(seconds / 60);
  if (Math.abs(minutes) < 60) return formatter.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return formatter.format(hours, "hour");
  return formatter.format(Math.round(hours / 24), "day");
}

export default function NotificationsPage() {
  const client = useQueryClient();
  const { data, isLoading } = useQuery<{ notifications: NotificationData[]; unreadCount: number }>({
    queryKey: ["notifications"],
    queryFn: async () => { const response = await fetch("/api/notifications"); if (!response.ok) throw new Error("Unable to load notifications"); return response.json(); },
  });
  const update = useMutation({
    mutationFn: async (body: { id?: string; all?: boolean }) => { const response = await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); if (!response.ok) throw new Error("Unable to update notification"); },
    onSuccess: () => client.invalidateQueries({ queryKey: ["notifications"] }),
  });
  const notifications = data?.notifications ?? [];

  return <AccountShell title="Notifications" eyebrow="Your updates">
    <section data-reveal className="mx-auto max-w-5xl">
      <div className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(232,185,106,.12),transparent_32%),rgba(255,255,255,.025)]">
        <div className="flex flex-col gap-5 border-b border-white/10 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-8">
          <div><p className="eyebrow">Personal activity</p><h2 className="mt-2 text-3xl font-light tracking-[-.04em] sm:text-5xl">Everything that matters.</h2><p className="mt-3 max-w-xl text-sm leading-7 text-[var(--muted)]">Account and order updates belong only to you. New activity appears here automatically.</p></div>
          {Boolean(data?.unreadCount) && <button type="button" onClick={() => update.mutate({ all: true })} disabled={update.isPending} className="btn btn-secondary shrink-0 !px-4 !py-2.5 text-xs"><Check size={14}/>Mark all read</button>}
        </div>
        <div className="p-3 sm:p-5">
          {isLoading ? <div className="grid gap-3">{[1,2,3].map((item) => <div key={item} className="h-24 animate-pulse rounded-2xl bg-white/[.035]" />)}</div> : notifications.length === 0 ? <div className="grid min-h-72 place-items-center text-center"><div><span className="mx-auto grid size-14 place-items-center rounded-2xl border border-white/10 bg-white/5 text-[var(--accent)]"><Bell size={22}/></span><h3 className="mt-5 text-xl font-light">You’re all caught up.</h3><p className="mt-2 text-sm text-[var(--muted)]">Order and account updates will appear here.</p></div></div> : <div className="grid gap-2">{notifications.map((notification) => {
            const Icon = iconMap[notification.type];
            const content = <><span className={`grid size-11 shrink-0 place-items-center rounded-2xl border ${notification.read ? "border-white/10 bg-white/[.035] text-[var(--muted)]" : "border-[var(--accent)]/25 bg-[var(--accent)]/10 text-[var(--accent)]"}`}><Icon size={18}/></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-start justify-between gap-2"><h3 className="text-sm font-medium text-[var(--ink)]">{notification.title}</h3><time className="font-mono text-[9px] uppercase tracking-[.12em] text-[var(--faint)]">{relativeTime(notification.createdAt)}</time></div><p className="mt-1 max-w-2xl text-xs leading-6 text-[var(--muted)]">{notification.message}</p></div>{!notification.read && <span className="mt-2 size-2 shrink-0 rounded-full bg-[var(--accent)] shadow-[0_0_12px_var(--accent)]" aria-label="Unread"/>}</>;
            const classes = `notification-card group relative ${notification.read ? "opacity-75" : "!border-[var(--accent)]/20"}`;
            return notification.actionUrl ? <Link key={notification.id} href={notification.actionUrl} onClick={() => !notification.read && update.mutate({ id: notification.id })} className={classes}>{content}</Link> : <button type="button" key={notification.id} onClick={() => !notification.read && update.mutate({ id: notification.id })} className={`${classes} w-full text-left`}>{content}</button>;
          })}</div>}
        </div>
      </div>
    </section>
  </AccountShell>;
}
