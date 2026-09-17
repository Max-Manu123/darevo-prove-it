-- Proof media lives at proofs/<challenge_id>/<user_id>/<file>
CREATE POLICY "proof media viewable by challenge viewers" ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'proofs'
  AND public.can_view_challenge(NULLIF(split_part(name,'/',1),'')::uuid)
);

CREATE POLICY "users upload own proof media" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'proofs'
  AND split_part(name,'/',2) = auth.uid()::text
  AND public.is_participant(NULLIF(split_part(name,'/',1),'')::uuid, auth.uid())
);

CREATE POLICY "users delete own proof media" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'proofs' AND split_part(name,'/',2) = auth.uid()::text);