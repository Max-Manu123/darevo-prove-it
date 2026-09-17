import { supabase } from "@/integrations/supabase/client";

export type AnalyticsEvent =
  | "signup_completed"
  | "challenge_created"
  | "challenge_joined"
  | "challenge_started"
  | "proof_submitted"
  | "challenge_completed"
  | "comment_created"
  | "challenge_shared"
  | "invite_link_clicked"
  | "invite_accepted"
  | "user_returned"
  | "challenge_reported"
  | "upgrade_clicked"
  | "pro_email_submitted"
  | "feedback_submitted";

const RETURN_KEY = "darevo.lastVisit";
const FIRST_KEY = "darevo.firstVisit";

/** Fire-and-forget event logging. Never blocks or breaks a user flow. */
export async function track(name: AnalyticsEvent, props: Record<string, unknown> = {}) {
  try {
    const { data } = await supabase.auth.getSession();
    await supabase.from("analytics_events").insert({
      name,
      user_id: data.session?.user.id ?? null,
      props: props as never,
    });
  } catch {
    // analytics must never surface an error to the user
  }
}

/** Records a returning-visit event with the retention day bucket (D1/D2/D3/D7). */
export function trackReturnVisit() {
  if (typeof window === "undefined") return;
  const today = new Date().toISOString().slice(0, 10);
  const first = window.localStorage.getItem(FIRST_KEY);
  const last = window.localStorage.getItem(RETURN_KEY);
  if (!first) window.localStorage.setItem(FIRST_KEY, today);
  window.localStorage.setItem(RETURN_KEY, today);
  if (!first || last === today) return;
  const days = Math.round((Date.parse(today) - Date.parse(first)) / 86_400_000);
  if (days <= 0) return;
  void track("user_returned", { days_since_first_visit: days, retention_day: `D${days}` });
}
