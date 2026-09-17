import type { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { supabase } from "@/integrations/supabase/client";
import { normalizeUsername } from "@/lib/darevo";

export type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  language: string;
  profile_visibility: string;
  show_challenges: boolean;
  notify_in_app: boolean;
  global_score: number;
  current_streak: number;
  longest_streak: number;
  warnings: number;
  suspended_until: string | null;
  created_at: string;
};

type AuthValue = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  loading: boolean;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

async function pickUsername(base: string) {
  const clean = normalizeUsername(base) || "darevo";
  const candidate = clean.length >= 3 ? clean : `${clean}user`;
  for (let attempt = 0; attempt < 6; attempt++) {
    const name = attempt === 0 ? candidate : `${candidate.slice(0, 15)}${Math.floor(Math.random() * 9999)}`;
    const { data } = await supabase.from("profiles").select("id").eq("username", name).maybeSingle();
    if (!data) return name;
  }
  return `user${Date.now().toString().slice(-8)}`;
}

/** Makes sure a signed-in user always has a profile row (OAuth and email signup). */
async function ensureProfile(user: User): Promise<Profile | null> {
  const { data: existing } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (existing) return existing as Profile;

  const meta = user.user_metadata ?? {};
  const base =
    (typeof meta["username"] === "string" && meta["username"]) ||
    (typeof meta["full_name"] === "string" && meta["full_name"]) ||
    user.email?.split("@")[0] ||
    "darevo";
  const username = await pickUsername(String(base));
  const displayName =
    (typeof meta["full_name"] === "string" && meta["full_name"]) ||
    (typeof meta["name"] === "string" && meta["name"]) ||
    username;

  const { data, error } = await supabase
    .from("profiles")
    .insert({ id: user.id, username, display_name: displayName })
    .select("*")
    .maybeSingle();
  if (error) {
    const { data: retry } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
    return (retry as Profile) ?? null;
  }
  return data as Profile;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const hydrating = useRef(false);

  const hydrate = useCallback(async (nextSession: Session | null) => {
    if (!nextSession?.user) {
      setProfile(null);
      setIsAdmin(false);
      return;
    }
    if (hydrating.current) return;
    hydrating.current = true;
    try {
      const nextProfile = await ensureProfile(nextSession.user);
      setProfile(nextProfile);
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", nextSession.user.id);
      setIsAdmin(!!roles?.some((r) => r.role === "admin"));
    } finally {
      hydrating.current = false;
    }
  }, []);

  useEffect(() => {
    let active = true;

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      void hydrate(nextSession);
    });

    void supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      await hydrate(data.session);
      setLoading(false);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [hydrate]);

  const refreshProfile = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session?.user) return;
    const { data: fresh } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.session.user.id)
      .maybeSingle();
    if (fresh) setProfile(fresh as Profile);
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      isAdmin,
      loading,
      refreshProfile,
    }),
    [session, profile, isAdmin, loading, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
