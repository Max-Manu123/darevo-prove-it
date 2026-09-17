-- ===== SOCIAL REACTIONS =====
CREATE TABLE public.proof_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proof_id UUID NOT NULL REFERENCES public.proofs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reaction TEXT NOT NULL CHECK (reaction IN ('like','dislike')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (proof_id, user_id)
);
CREATE INDEX proof_reactions_proof_idx ON public.proof_reactions(proof_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.proof_reactions TO authenticated;
ALTER TABLE public.proof_reactions ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.comment_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reaction TEXT NOT NULL CHECK (reaction IN ('like','dislike')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (comment_id, user_id)
);
CREATE INDEX comment_reactions_comment_idx ON public.comment_reactions(comment_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.comment_reactions TO authenticated;
ALTER TABLE public.comment_reactions ENABLE ROW LEVEL SECURITY;

-- ===== OFFICIAL CHALLENGE WINNERS =====
CREATE TABLE public.challenge_winners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  proof_id UUID NOT NULL REFERENCES public.proofs(id) ON DELETE CASCADE,
  selected_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (challenge_id, proof_id)
);
CREATE INDEX challenge_winners_challenge_idx ON public.challenge_winners(challenge_id);
GRANT SELECT, INSERT, DELETE ON public.challenge_winners TO authenticated;
ALTER TABLE public.challenge_winners ENABLE ROW LEVEL SECURITY;

-- ===== POLICIES: proof reactions =====
CREATE POLICY "proof reactions readable" ON public.proof_reactions FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.proofs p WHERE p.id = proof_id AND public.can_view_challenge(p.challenge_id))
);
CREATE POLICY "create own proof reaction" ON public.proof_reactions FOR INSERT TO authenticated WITH CHECK (
  user_id = auth.uid() AND EXISTS (
    SELECT 1 FROM public.proofs p WHERE p.id = proof_id AND p.status = 'active' AND public.can_view_challenge(p.challenge_id)
  )
);
CREATE POLICY "update own proof reaction" ON public.proof_reactions FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "delete own proof reaction" ON public.proof_reactions FOR DELETE TO authenticated USING (user_id = auth.uid());

-- ===== POLICIES: comment reactions =====
CREATE POLICY "comment reactions readable" ON public.comment_reactions FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.comments c WHERE c.id = comment_id AND public.can_view_challenge(c.challenge_id))
);
CREATE POLICY "create own comment reaction" ON public.comment_reactions FOR INSERT TO authenticated WITH CHECK (
  user_id = auth.uid() AND EXISTS (
    SELECT 1 FROM public.comments c WHERE c.id = comment_id AND c.status = 'active' AND public.can_view_challenge(c.challenge_id)
  )
);
CREATE POLICY "update own comment reaction" ON public.comment_reactions FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "delete own comment reaction" ON public.comment_reactions FOR DELETE TO authenticated USING (user_id = auth.uid());

-- ===== POLICIES: winners =====
CREATE POLICY "winners readable" ON public.challenge_winners FOR SELECT USING (
  public.can_view_challenge(challenge_id)
);
CREATE POLICY "creator selects winner" ON public.challenge_winners FOR INSERT TO authenticated WITH CHECK (
  selected_by = auth.uid() AND EXISTS (
    SELECT 1 FROM public.challenges c WHERE c.id = challenge_id AND c.creator_id = auth.uid()
  ) AND EXISTS (
    SELECT 1 FROM public.proofs p WHERE p.id = proof_id AND p.challenge_id = challenge_id AND p.status = 'active'
  )
);
CREATE POLICY "creator removes winner" ON public.challenge_winners FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.challenges c WHERE c.id = challenge_id AND c.creator_id = auth.uid())
);
