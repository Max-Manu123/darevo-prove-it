import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import { ArrowLeft, Check, Copy, Flag, Heart, Share2, ThumbsDown, Trophy } from "lucide-react";
import { AppShell, Button, Card, SecondaryButton } from "@/components/app-shell";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { isEnded } from "@/lib/darevo";

export const Route = createFileRoute("/challenge/$id")({ component: Challenge });

type Reaction = "like" | "dislike";

function ActionButton({ active, onClick, children, label }: { active?: boolean; onClick: () => void; children: ReactNode; label: string }) {
  return <button type="button" onClick={onClick} aria-label={label} className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition ${active ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground"}`}>{children}</button>;
}

function Challenge() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [challenge, setChallenge] = useState<any>();
  const [participation, setParticipation] = useState<any>();
  const [proofs, setProofs] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [winnerIds, setWinnerIds] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    const { data, error } = await supabase.from("challenges").select("*, profiles:creator_id(username,display_name,avatar_url), challenge_proof_types(proof_type)").eq("id", id).maybeSingle();
    if (error) { setMessage(error.message); return; }
    setChallenge(data);

    if (user) {
      const { data: p } = await supabase.from("participations").select("*").eq("challenge_id", id).eq("user_id", user.id).maybeSingle();
      setParticipation(p);
    }

    const { data: pr } = await supabase.from("proofs").select("id,proof_type,text_content,numeric_value,media_path,description,created_at,user_id,profiles:user_id(username,display_name,avatar_url)").eq("challenge_id", id).eq("status", "active").order("created_at", { ascending: false }).limit(30);
    const { data: proofReactions } = await supabase.from("proof_reactions").select("proof_id,user_id,reaction").in("proof_id", (pr ?? []).map((p: any) => p.id));
    const { data: winners } = await supabase.from("challenge_winners").select("proof_id").eq("challenge_id", id);
    const proofReactionRows = proofReactions ?? [];
    setWinnerIds((winners ?? []).map((w: any) => w.proof_id));
    setProofs((pr ?? []).map((p: any) => {
      const rows = proofReactionRows.filter((r: any) => r.proof_id === p.id);
      return { ...p, likes: rows.filter((r: any) => r.reaction === "like").length, dislikes: rows.filter((r: any) => r.reaction === "dislike").length, myReaction: user ? rows.find((r: any) => r.user_id === user.id)?.reaction : undefined };
    }));

    const { data: cm } = await supabase.from("comments").select("id,content,created_at,user_id,profiles:user_id(username,display_name,avatar_url)").eq("challenge_id", id).eq("status", "active").order("created_at", { ascending: true }).limit(50);
    const { data: commentReactions } = await supabase.from("comment_reactions").select("comment_id,user_id,reaction").in("comment_id", (cm ?? []).map((c: any) => c.id));
    const commentReactionRows = commentReactions ?? [];
    setComments((cm ?? []).map((c: any) => {
      const rows = commentReactionRows.filter((r: any) => r.comment_id === c.id);
      return { ...c, likes: rows.filter((r: any) => r.reaction === "like").length, dislikes: rows.filter((r: any) => r.reaction === "dislike").length, myReaction: user ? rows.find((r: any) => r.user_id === user.id)?.reaction : undefined };
    }));
  };

  useEffect(() => { void load(); }, [id, user]);

  if (!challenge) return <AppShell><p className="text-muted-foreground">{message || "Loading challenge…"}</p></AppShell>;

  const requireUser = () => { if (!user) { nav({ to: "/auth" }); return false; } return true; };

  const reactToProof = async (proofId: string, reaction: Reaction) => {
    if (!requireUser()) return;
    setMessage("");
    const existing = proofs.find((p) => p.id === proofId)?.myReaction;
    if (existing === reaction) {
      const { error } = await supabase.from("proof_reactions").delete().eq("proof_id", proofId).eq("user_id", user!.id);
      if (error) setMessage(error.message); else void load();
      return;
    }
    const { error } = await supabase.from("proof_reactions").upsert({ proof_id: proofId, user_id: user!.id, reaction }, { onConflict: "proof_id,user_id" });
    if (error) setMessage(error.message); else void load();
  };

  const reactToComment = async (commentId: string, reaction: Reaction) => {
    if (!requireUser()) return;
    setMessage("");
    const existing = comments.find((c) => c.id === commentId)?.myReaction;
    if (existing === reaction) {
      const { error } = await supabase.from("comment_reactions").delete().eq("comment_id", commentId).eq("user_id", user!.id);
      if (error) setMessage(error.message); else void load();
      return;
    }
    const { error } = await supabase.from("comment_reactions").upsert({ comment_id: commentId, user_id: user!.id, reaction }, { onConflict: "comment_id,user_id" });
    if (error) setMessage(error.message); else void load();
  };

  const report = async (targetType: "proof" | "comment", targetId: string) => {
    if (!requireUser()) return;
    const reason = window.prompt("Why are you reporting this? (spam, fake_proof, harassment, inappropriate, violence, other)", "other")?.trim();
    if (!reason) return;
    const allowed = ["spam", "fake_proof", "harassment", "inappropriate", "violence", "other"];
    const normalized = allowed.includes(reason) ? reason : "other";
    const { error } = await supabase.from("reports").insert({ reporter_id: user!.id, target_type: targetType, target_id: targetId, reason: normalized });
    setMessage(error ? error.code === "23505" ? "You already reported this." : error.message : "Report submitted.");
  };

  const toggleWinner = async (proofId: string) => {
    if (!user || challenge.creator_id !== user.id) return;
    setMessage("");
    if (winnerIds.includes(proofId)) {
      const { error } = await supabase.from("challenge_winners").delete().eq("challenge_id", id).eq("proof_id", proofId);
      if (error) setMessage(error.message); else void load();
      return;
    }
    const { error } = await supabase.from("challenge_winners").insert({ challenge_id: id, proof_id: proofId, selected_by: user.id });
    if (error) setMessage(error.message); else void load();
  };

  const join = async () => {
    if (!requireUser()) return;
    setMessage("");
    const { data, error } = await supabase.from("participations").insert({ challenge_id: id, user_id: user!.id }).select("*").single();
    if (!error) { setParticipation(data); void load(); } else setMessage(error.code === "23505" ? "You're already participating in this challenge." : error.message);
  };

  const addComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!requireUser()) return;
    if (!comment.trim()) return;
    const { error } = await supabase.from("comments").insert({ challenge_id: id, user_id: user!.id, content: comment.trim() });
    if (error) setMessage(error.message); else { setComment(""); void load(); }
  };

  const getShareUrl = () => { const base = window.location.origin; return challenge.visibility === "private" ? `${base}/invite/${challenge.invite_token}` : window.location.href; };
  const share = async () => { setMessage(""); try { const url = getShareUrl(); if (navigator.share) await navigator.share({ title: challenge.title, url }); else { await navigator.clipboard.writeText(url); setMessage("Challenge link copied."); } } catch (err) { if (err instanceof DOMException && err.name === "AbortError") return; setMessage("Could not share the challenge link."); } };
  const copy = async () => { try { await navigator.clipboard.writeText(getShareUrl()); setMessage("Challenge link copied."); } catch { setMessage("Could not copy the challenge link."); } };

  return <AppShell>
    <Link to="/explore" className="mb-7 inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft size={16} /> Explore</Link>
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div>
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground"><span>{challenge.category}</span><span>•</span><span>{challenge.visibility}</span></div>
        <h1 className="display-lg mt-3">{challenge.title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">{challenge.description}</p>
        <div className="mt-7 flex flex-wrap gap-2">{challenge.challenge_proof_types?.map((x: any) => <span key={x.proof_type} className="rounded-full border border-border px-3 py-1.5 text-xs">{x.proof_type}</span>)}</div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3"><Card><p className="text-2xl font-bold">{challenge.participant_count ?? 0}</p><p className="text-xs text-muted-foreground">Participants</p></Card><Card><p className="text-2xl font-bold">{challenge.proof_count ?? 0}</p><p className="text-xs text-muted-foreground">Proofs</p></Card><Card><p className="text-2xl font-bold">{challenge.target_count}</p><p className="text-xs text-muted-foreground">Target</p></Card></div>
        {challenge.rules && <Card className="mt-6"><p className="eyebrow">RULES</p><p className="mt-3 whitespace-pre-wrap text-sm leading-6">{challenge.rules}</p></Card>}

        <section className="mt-10">
          <div className="flex items-center justify-between"><h2 className="text-xl font-bold">Proofs</h2>{participation && <Button type="button" onClick={() => nav({ to: "/challenge/$id/prove", params: { id } })}>Submit proof</Button>}</div>
          <div className="mt-4 space-y-3">
            {proofs.map((p) => <Card key={p.id}>
              <div className="flex justify-between text-xs text-muted-foreground"><span>{p.profiles?.display_name || p.profiles?.username}</span><span>{new Date(p.created_at).toLocaleDateString()}</span></div>
              {winnerIds.includes(p.id) && <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs font-semibold"><Trophy size={13} /> Official winner</div>}
              <p className="mt-3 text-sm">{p.description || p.text_content || p.numeric_value || p.proof_type}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <ActionButton label="Like proof" active={p.myReaction === "like"} onClick={() => void reactToProof(p.id, "like")}><Heart size={14} /> {p.likes}</ActionButton>
                <ActionButton label="Dislike proof" active={p.myReaction === "dislike"} onClick={() => void reactToProof(p.id, "dislike")}><ThumbsDown size={14} /> {p.dislikes}</ActionButton>
                <ActionButton label="Report proof" onClick={() => void report("proof", p.id)}><Flag size={14} /> Report</ActionButton>
                {user && challenge.creator_id === user.id && <ActionButton label={winnerIds.includes(p.id) ? "Remove winner" : "Mark as winner"} active={winnerIds.includes(p.id)} onClick={() => void toggleWinner(p.id)}><Trophy size={14} /> {winnerIds.includes(p.id) ? "Winner" : "Mark winner"}</ActionButton>}
              </div>
            </Card>)}
            {proofs.length === 0 && <p className="text-sm text-muted-foreground">No proofs yet. Be the first.</p>}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold">Comments</h2>
          <form onSubmit={addComment} className="mt-4 flex gap-2"><input value={comment} onChange={e => setComment(e.target.value)} placeholder="Add a comment" className="h-11 min-w-0 flex-1 rounded-md border border-input bg-background px-3 text-sm" /><Button>Post</Button></form>
          <div className="mt-4 space-y-2">
            {comments.map(c => <div key={c.id} className="border-b border-border py-3">
              <p className="text-sm font-semibold">{c.profiles?.display_name || c.profiles?.username}</p><p className="mt-1 text-sm text-muted-foreground">{c.content}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2"><ActionButton label="Like comment" active={c.myReaction === "like"} onClick={() => void reactToComment(c.id, "like")}><Heart size={13} /> {c.likes}</ActionButton><ActionButton label="Dislike comment" active={c.myReaction === "dislike"} onClick={() => void reactToComment(c.id, "dislike")}><ThumbsDown size={13} /> {c.dislikes}</ActionButton><ActionButton label="Report comment" onClick={() => void report("comment", c.id)}><Flag size={13} /> Report</ActionButton></div>
            </div>)}
          </div>
        </section>
        {message && <p className="mt-6 text-xs text-muted-foreground">{message}</p>}
      </div>

      <aside><Card className="sticky top-24"><p className="text-sm text-muted-foreground">Created by {challenge.profiles?.display_name || challenge.profiles?.username || "Darevo"}</p>{challenge.deadline && <p className="mt-3 text-sm">Deadline: {new Date(challenge.deadline).toLocaleString()}</p>}<div className="mt-6 grid gap-2">{participation ? <div className="flex items-center gap-2 rounded-md border border-border p-3 text-sm"><Check size={17} /> You're participating</div> : <Button onClick={join} disabled={isEnded(challenge.deadline)}>Join challenge</Button>}<SecondaryButton onClick={share}><Share2 size={16} /> Share</SecondaryButton><SecondaryButton onClick={copy}><Copy size={16} /> Copy link</SecondaryButton></div></Card></aside>
    </div>
  </AppShell>;
}
