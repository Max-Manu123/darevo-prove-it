import { createServerFn } from "@tanstack/react-start";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Permanently deletes the caller's account and all content owned by it.
 * Privileged: loads the admin client only after the caller is authenticated,
 * and only ever acts on the caller's own user id.
 */
export const deleteMyAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Remove proof media owned by the user before dropping the rows.
    const { data: proofs } = await supabaseAdmin
      .from("proofs")
      .select("media_path")
      .eq("user_id", userId);
    const paths = (proofs ?? []).map((p) => p.media_path).filter((p): p is string => !!p);
    if (paths.length > 0) await supabaseAdmin.storage.from("proofs").remove(paths);

    await supabaseAdmin.from("challenges").delete().eq("creator_id", userId);
    await supabaseAdmin.from("profiles").delete().eq("id", userId);
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
