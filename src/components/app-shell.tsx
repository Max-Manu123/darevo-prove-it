import * as React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, Compass, Home, LogOut, Plus, Search, Settings, Trophy, UserRound } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export function AppShell({ children, title, action }: { children: React.ReactNode; title?: string; action?: React.ReactNode }) {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const signOut = async () => { await supabase.auth.signOut(); navigate({ to: "/" }); };
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Link to="/home" className="font-display text-lg font-bold tracking-tight">DAREVO</Link>
          <nav className="hidden items-center gap-1 md:flex">
            <NavLink to="/home" icon={<Home size={16}/>}>Home</NavLink>
            <NavLink to="/explore" icon={<Compass size={16}/>}>Explore</NavLink>
            <NavLink to="/rankings" icon={<Trophy size={16}/>}>Rankings</NavLink>
          </nav>
          <div className="flex items-center gap-1">
            <Link to="/create" className="hidden h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground sm:flex"><Plus size={16}/> Create</Link>
            <IconLink to="/notifications" label="Notifications"><Bell size={18}/></IconLink>
            <IconLink to="/settings" label="Settings"><Settings size={18}/></IconLink>
            <button aria-label="Sign out" onClick={signOut} className="hidden h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground sm:flex"><LogOut size={17}/></button>
            <Link to="/profile" className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-xs font-bold">{profile?.display_name?.slice(0,1).toUpperCase() ?? "D"}</Link>
          </div>
        </div>
      </header>
      <main className="container-page py-8 pb-24 md:pb-10">
        {(title || action) && <div className="mb-7 flex items-end justify-between gap-4"><div>{title && <h1 className="display-lg">{title}</h1>}</div>{action}</div>}
        {children}
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 md:hidden">
        <div className="grid grid-cols-5">
          <MobileLink to="/home" icon={<Home size={19}/>} label="Home"/><MobileLink to="/explore" icon={<Search size={19}/>} label="Explore"/><MobileLink to="/create" icon={<Plus size={22}/>} label="Create"/><MobileLink to="/rankings" icon={<Trophy size={19}/>} label="Ranks"/><MobileLink to="/profile" icon={<UserRound size={19}/>} label="Profile"/>
        </div>
      </nav>
    </div>
  );
}

function NavLink({ to, icon, children }: { to: "/home"|"/explore"|"/rankings"; icon: React.ReactNode; children: React.ReactNode }) { return <Link to={to} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-surface hover:text-foreground">{icon}{children}</Link>; }
function IconLink({ to, label, children }: { to: "/notifications"|"/settings"; label: string; children: React.ReactNode }) { return <Link to={to} aria-label={label} className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-surface hover:text-foreground">{children}</Link>; }
function MobileLink({ to, icon, label }: { to: "/home"|"/explore"|"/create"|"/rankings"|"/profile"; icon: React.ReactNode; label: string }) { return <Link to={to} className="flex flex-col items-center gap-1 py-2 text-[10px] text-muted-foreground [&.active]:text-foreground">{icon}{label}</Link>; }

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) { return <div className={`rounded-lg border border-border bg-card p-5 ${className}`}>{children}</div>; }
export function Button({ children, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) { return <button {...props} className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}>{children}</button>; }
export function SecondaryButton({ children, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) { return <button {...props} className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 text-sm font-semibold text-foreground hover:bg-accent disabled:opacity-50 ${className}`}>{children}</button>; }

/** Redirects signed-out visitors to /auth from an effect (never during render). */
export function AuthGate() {
  const navigate = useNavigate();
  React.useEffect(() => { navigate({ to: "/auth" }); }, [navigate]);
  return <div className="p-8 text-sm text-muted-foreground">Redirecting to sign in…</div>;
}
