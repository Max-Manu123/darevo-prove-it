-- ===== ENUM-LIKE DOMAINS VIA CHECKS, ROLES ENUM =====
CREATE TYPE public.app_role AS ENUM ('admin','moderator','user');

-- ===== PROFILES =====
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  language TEXT NOT NULL DEFAULT 'en',
  profile_visibility TEXT NOT NULL DEFAULT 'public' CHECK (profile_visibility IN ('public','private')),
  show_challenges BOOLEAN NOT NULL DEFAULT true,
  notify_in_app BOOLEAN NOT NULL DEFAULT true,
  global_score INTEGER NOT NULL DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  warnings INTEGER NOT NULL DEFAULT 0,
  suspended_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ===== ROLES =====
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

-- ===== CHALLENGES =====
CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 3 AND 120),
  description TEXT NOT NULL CHECK (char_length(description) BETWEEN 10 AND 4000),
  objective TEXT NOT NULL CHECK (char_length(objective) BETWEEN 3 AND 500),
  category TEXT NOT NULL CHECK (category IN ('fitness','study','coding','gaming','creative','business','other')),
  visibility TEXT NOT NULL CHECK (visibility IN ('public','private')),
  deadline TIMESTAMPTZ,
  rules TEXT,
  target_count INTEGER NOT NULL DEFAULT 5 CHECK (target_count BETWEEN 1 AND 365),
  invite_token TEXT NOT NULL DEFAULT encode(gen_random_bytes(12),'hex'),
  is_official BOOLEAN NOT NULL DEFAULT false,
  participant_count INTEGER NOT NULL DEFAULT 0,
  proof_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','removed')),
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX challenges_invite_token_idx ON public.challenges(invite_token);
CREATE INDEX challenges_public_idx ON public.challenges(visibility, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX challenges_creator_idx ON public.challenges(creator_id);
GRANT SELECT, INSERT, UPDATE ON public.challenges TO authenticated;
GRANT SELECT ON public.challenges TO anon;
GRANT ALL ON public.challenges TO service_role;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.challenge_proof_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  proof_type TEXT NOT NULL CHECK (proof_type IN ('checkin','number','text','photo','video','screenshot','link')),
  UNIQUE (challenge_id, proof_type)
);
GRANT SELECT, INSERT, DELETE ON public.challenge_proof_types TO authenticated;
GRANT SELECT ON public.challenge_proof_types TO anon;
GRANT ALL ON public.challenge_proof_types TO service_role;
ALTER TABLE public.challenge_proof_types ENABLE ROW LEVEL SECURITY;

-- ===== PARTICIPATIONS =====
CREATE TABLE public.participations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  progress INTEGER NOT NULL DEFAULT 0,
  points INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  UNIQUE (challenge_id, user_id)
);
CREATE INDEX participations_user_idx ON public.participations(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.participations TO authenticated;
GRANT SELECT ON public.participations TO anon;
GRANT ALL ON public.participations TO service_role;
ALTER TABLE public.participations ENABLE ROW LEVEL SECURITY;

-- ===== PROOFS =====
CREATE TABLE public.proofs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  proof_type TEXT NOT NULL CHECK (proof_type IN ('checkin','number','text','photo','video','screenshot','link')),
  text_content TEXT,
  numeric_value NUMERIC,
  media_path TEXT,
  link_url TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','removed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX proofs_challenge_idx ON public.proofs(challenge_id, created_at DESC);
CREATE INDEX proofs_user_idx ON public.proofs(user_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.proofs TO authenticated;
GRANT SELECT ON public.proofs TO anon;
GRANT ALL ON public.proofs TO service_role;
ALTER TABLE public.proofs ENABLE ROW LEVEL SECURITY;

-- ===== COMMENTS =====
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 1000),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','removed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX comments_challenge_idx ON public.comments(challenge_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.comments TO authenticated;
GRANT SELECT ON public.comments TO anon;
GRANT ALL ON public.comments TO service_role;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- ===== NOTIFICATIONS =====
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
  reference_id UUID,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX notifications_user_idx ON public.notifications(user_id, created_at DESC);
GRANT SELECT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ===== REPORTS =====
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('challenge','proof','comment','user')),
  target_id UUID NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('spam','fake_proof','harassment','inappropriate','violence','other')),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','kept','removed','warned','suspended')),
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (reporter_id, target_type, target_id)
);
GRANT SELECT, INSERT, UPDATE ON public.reports TO authenticated;
GRANT ALL ON public.reports TO service_role;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- ===== FEEDBACK =====
CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  email TEXT,
  type TEXT NOT NULL CHECK (type IN ('bug','idea','problem','other')),
  message TEXT NOT NULL CHECK (char_length(message) BETWEEN 3 AND 4000),
  recommendation_score INTEGER CHECK (recommendation_score BETWEEN 0 AND 10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.feedback TO authenticated, anon;
GRANT SELECT ON public.feedback TO authenticated;
GRANT ALL ON public.feedback TO service_role;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- ===== PRO WAITLIST =====
CREATE TABLE public.pro_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.pro_waitlist TO authenticated, anon;
GRANT SELECT ON public.pro_waitlist TO authenticated;
GRANT ALL ON public.pro_waitlist TO service_role;
ALTER TABLE public.pro_waitlist ENABLE ROW LEVEL SECURITY;

-- ===== ANALYTICS EVENTS =====
CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  props JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX analytics_name_idx ON public.analytics_events(name, created_at DESC);
GRANT INSERT ON public.analytics_events TO authenticated, anon;
GRANT SELECT ON public.analytics_events TO authenticated;
GRANT ALL ON public.analytics_events TO service_role;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- ===== VISIBILITY HELPERS =====
CREATE OR REPLACE FUNCTION public.is_participant(_challenge_id UUID, _user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.participations WHERE challenge_id = _challenge_id AND user_id = _user_id);
$$;

CREATE OR REPLACE FUNCTION public.can_view_challenge(_challenge_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.challenges c
    WHERE c.id = _challenge_id
      AND c.deleted_at IS NULL
      AND (
        (c.visibility = 'public' AND c.status = 'active')
        OR c.creator_id = auth.uid()
        OR public.is_participant(c.id, auth.uid())
        OR public.has_role(auth.uid(),'admin')
      )
  );
$$;

CREATE OR REPLACE FUNCTION public.challenge_is_open(_challenge_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.challenges c
    WHERE c.id = _challenge_id AND c.deleted_at IS NULL AND c.status = 'active'
      AND (c.deadline IS NULL OR c.deadline > now())
  );
$$;

-- ===== POLICIES: profiles =====
CREATE POLICY "profiles readable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "admins update profiles" ON public.profiles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- ===== POLICIES: challenges =====
CREATE POLICY "public challenges readable" ON public.challenges FOR SELECT USING (
  (visibility = 'public' AND status = 'active' AND deleted_at IS NULL)
  OR creator_id = auth.uid()
  OR public.is_participant(id, auth.uid())
  OR public.has_role(auth.uid(),'admin')
);
CREATE POLICY "create own challenge" ON public.challenges FOR INSERT TO authenticated WITH CHECK (creator_id = auth.uid() AND is_official = false);
CREATE POLICY "update own challenge" ON public.challenges FOR UPDATE TO authenticated USING (creator_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

-- ===== POLICIES: proof types =====
CREATE POLICY "proof types readable" ON public.challenge_proof_types FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.challenges c WHERE c.id = challenge_id AND (
    (c.visibility='public' AND c.deleted_at IS NULL) OR c.creator_id = auth.uid() OR public.is_participant(c.id, auth.uid())))
);
CREATE POLICY "creator manages proof types" ON public.challenge_proof_types FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.challenges c WHERE c.id = challenge_id AND c.creator_id = auth.uid())
);
CREATE POLICY "creator deletes proof types" ON public.challenge_proof_types FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.challenges c WHERE c.id = challenge_id AND c.creator_id = auth.uid())
);

-- ===== POLICIES: participations =====
CREATE POLICY "participations readable" ON public.participations FOR SELECT USING (public.can_view_challenge(challenge_id));
CREATE POLICY "join challenge" ON public.participations FOR INSERT TO authenticated WITH CHECK (
  user_id = auth.uid() AND public.challenge_is_open(challenge_id)
);
CREATE POLICY "leave challenge" ON public.participations FOR DELETE TO authenticated USING (user_id = auth.uid());

-- ===== POLICIES: proofs =====
CREATE POLICY "proofs readable" ON public.proofs FOR SELECT USING (status = 'active' AND public.can_view_challenge(challenge_id));
CREATE POLICY "admins read proofs" ON public.proofs FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "submit own proof" ON public.proofs FOR INSERT TO authenticated WITH CHECK (
  user_id = auth.uid() AND public.is_participant(challenge_id, auth.uid()) AND public.challenge_is_open(challenge_id)
);
CREATE POLICY "delete own proof" ON public.proofs FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "admins moderate proofs" ON public.proofs FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- ===== POLICIES: comments =====
CREATE POLICY "comments readable" ON public.comments FOR SELECT USING (status = 'active' AND public.can_view_challenge(challenge_id));
CREATE POLICY "admins read comments" ON public.comments FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "create own comment" ON public.comments FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND public.can_view_challenge(challenge_id));
CREATE POLICY "delete own comment" ON public.comments FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "admins moderate comments" ON public.comments FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- ===== POLICIES: notifications =====
CREATE POLICY "own notifications" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "delete own notifications" ON public.notifications FOR DELETE TO authenticated USING (user_id = auth.uid());

-- ===== POLICIES: reports =====
CREATE POLICY "create own report" ON public.reports FOR INSERT TO authenticated WITH CHECK (reporter_id = auth.uid());
CREATE POLICY "read own reports" ON public.reports FOR SELECT TO authenticated USING (reporter_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins review reports" ON public.reports FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- ===== POLICIES: feedback / waitlist / analytics =====
CREATE POLICY "anyone submits feedback" ON public.feedback FOR INSERT WITH CHECK (user_id IS NULL OR user_id = auth.uid());
CREATE POLICY "admins read feedback" ON public.feedback FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "anyone joins waitlist" ON public.pro_waitlist FOR INSERT WITH CHECK (user_id IS NULL OR user_id = auth.uid());
CREATE POLICY "admins read waitlist" ON public.pro_waitlist FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "anyone logs events" ON public.analytics_events FOR INSERT WITH CHECK (user_id IS NULL OR user_id = auth.uid());
CREATE POLICY "admins read events" ON public.analytics_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- ===== SCORING / STREAK ENGINE =====
CREATE OR REPLACE FUNCTION public.recalc_user_stats(_user_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _score INTEGER;
  _cur INTEGER := 0;
  _best INTEGER := 0;
  _prev DATE;
  _d DATE;
  _last DATE;
BEGIN
  SELECT COALESCE(SUM(p.points),0) INTO _score
  FROM public.participations p
  JOIN public.challenges c ON c.id = p.challenge_id
  WHERE p.user_id = _user_id AND c.visibility = 'public' AND c.deleted_at IS NULL;

  FOR _d IN
    SELECT DISTINCT (pr.created_at AT TIME ZONE 'UTC')::date AS d
    FROM public.proofs pr WHERE pr.user_id = _user_id AND pr.status = 'active'
    ORDER BY d
  LOOP
    IF _prev IS NOT NULL AND _d = _prev + 1 THEN
      _cur := _cur + 1;
    ELSE
      _cur := 1;
    END IF;
    IF _cur > _best THEN _best := _cur; END IF;
    _prev := _d;
    _last := _d;
  END LOOP;

  IF _last IS NULL OR _last < (now() AT TIME ZONE 'UTC')::date - 1 THEN
    _cur := 0;
  END IF;

  UPDATE public.profiles
  SET global_score = _score,
      current_streak = _cur,
      longest_streak = GREATEST(longest_streak, _best),
      last_activity_date = _last,
      updated_at = now()
  WHERE id = _user_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.recalc_participation(_challenge_id UUID, _user_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _count INTEGER;
  _target INTEGER;
  _points INTEGER;
  _completed TIMESTAMPTZ;
BEGIN
  SELECT COUNT(*) INTO _count FROM public.proofs
  WHERE challenge_id = _challenge_id AND user_id = _user_id AND status = 'active';
  SELECT target_count INTO _target FROM public.challenges WHERE id = _challenge_id;
  _points := _count * 10;
  IF _count >= COALESCE(_target,1) THEN
    _points := _points + 50;
    SELECT MAX(created_at) INTO _completed FROM public.proofs
      WHERE challenge_id = _challenge_id AND user_id = _user_id AND status = 'active';
  ELSE
    _completed := NULL;
  END IF;
  UPDATE public.participations
  SET progress = _count, points = _points, completed_at = _completed
  WHERE challenge_id = _challenge_id AND user_id = _user_id;
  PERFORM public.recalc_user_stats(_user_id);
END;
$$;

CREATE OR REPLACE FUNCTION public.notify(_user UUID, _actor UUID, _type TEXT, _challenge UUID, _ref UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF _user IS NULL OR _user = _actor THEN RETURN; END IF;
  INSERT INTO public.notifications (user_id, actor_id, type, challenge_id, reference_id)
  VALUES (_user, _actor, _type, _challenge, _ref);
END;
$$;

CREATE OR REPLACE FUNCTION public.tg_proof_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _cid UUID; _uid UUID; _creator UUID; _completed TIMESTAMPTZ;
BEGIN
  IF TG_OP = 'DELETE' THEN _cid := OLD.challenge_id; _uid := OLD.user_id;
  ELSE _cid := NEW.challenge_id; _uid := NEW.user_id; END IF;

  PERFORM public.recalc_participation(_cid, _uid);
  UPDATE public.challenges c SET proof_count = (
    SELECT COUNT(*) FROM public.proofs p WHERE p.challenge_id = c.id AND p.status='active'
  ) WHERE c.id = _cid;

  IF TG_OP = 'INSERT' THEN
    SELECT creator_id INTO _creator FROM public.challenges WHERE id = _cid;
    PERFORM public.notify(_creator, _uid, 'proof_submitted', _cid, NEW.id);
    SELECT completed_at INTO _completed FROM public.participations WHERE challenge_id=_cid AND user_id=_uid;
    IF _completed IS NOT NULL THEN
      PERFORM public.notify(_creator, _uid, 'challenge_completed', _cid, NEW.id);
    END IF;
  END IF;
  RETURN NULL;
END;
$$;
CREATE TRIGGER proofs_after_change AFTER INSERT OR UPDATE OR DELETE ON public.proofs
FOR EACH ROW EXECUTE FUNCTION public.tg_proof_change();

CREATE OR REPLACE FUNCTION public.tg_participation_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _cid UUID; _creator UUID;
BEGIN
  IF TG_OP = 'DELETE' THEN _cid := OLD.challenge_id; ELSE _cid := NEW.challenge_id; END IF;
  UPDATE public.challenges c SET participant_count = (
    SELECT COUNT(*) FROM public.participations p WHERE p.challenge_id = c.id
  ) WHERE c.id = _cid;
  IF TG_OP = 'INSERT' THEN
    SELECT creator_id INTO _creator FROM public.challenges WHERE id = _cid;
    PERFORM public.notify(_creator, NEW.user_id, 'challenge_joined', _cid, NEW.id);
    PERFORM public.recalc_user_stats(NEW.user_id);
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.recalc_user_stats(OLD.user_id);
  END IF;
  RETURN NULL;
END;
$$;
CREATE TRIGGER participations_after_change AFTER INSERT OR DELETE ON public.participations
FOR EACH ROW EXECUTE FUNCTION public.tg_participation_change();

CREATE OR REPLACE FUNCTION public.tg_comment_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _creator UUID;
BEGIN
  SELECT creator_id INTO _creator FROM public.challenges WHERE id = NEW.challenge_id;
  PERFORM public.notify(_creator, NEW.user_id, 'comment_created', NEW.challenge_id, NEW.id);
  RETURN NULL;
END;
$$;
CREATE TRIGGER comments_after_insert AFTER INSERT ON public.comments
FOR EACH ROW EXECUTE FUNCTION public.tg_comment_insert();

-- ===== RANKINGS =====
CREATE OR REPLACE FUNCTION public.global_ranking(_limit INTEGER DEFAULT 50)
RETURNS TABLE (rank BIGINT, user_id UUID, username TEXT, display_name TEXT, avatar_url TEXT, score INTEGER)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT ROW_NUMBER() OVER (ORDER BY p.global_score DESC, p.created_at ASC),
         p.id, p.username, p.display_name, p.avatar_url, p.global_score
  FROM public.profiles p
  WHERE p.global_score > 0
  ORDER BY p.global_score DESC, p.created_at ASC
  LIMIT COALESCE(_limit, 50);
$$;

CREATE OR REPLACE FUNCTION public.global_rank_of(_user_id UUID)
RETURNS INTEGER LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT CASE WHEN (SELECT global_score FROM public.profiles WHERE id = _user_id) > 0
    THEN (SELECT COUNT(*)::int + 1 FROM public.profiles p
          WHERE p.global_score > (SELECT global_score FROM public.profiles WHERE id = _user_id))
    ELSE NULL END;
$$;

CREATE OR REPLACE FUNCTION public.challenge_ranking(_challenge_id UUID)
RETURNS TABLE (rank BIGINT, user_id UUID, username TEXT, display_name TEXT, avatar_url TEXT, score INTEGER, progress INTEGER)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT ROW_NUMBER() OVER (ORDER BY pa.points DESC, pa.joined_at ASC),
         pr.id, pr.username, pr.display_name, pr.avatar_url, pa.points, pa.progress
  FROM public.participations pa
  JOIN public.profiles pr ON pr.id = pa.user_id
  WHERE pa.challenge_id = _challenge_id AND public.can_view_challenge(_challenge_id)
  ORDER BY pa.points DESC, pa.joined_at ASC
  LIMIT 100;
$$;

GRANT EXECUTE ON FUNCTION public.global_ranking(INTEGER), public.global_rank_of(UUID), public.challenge_ranking(UUID) TO anon, authenticated;

-- ===== SEED OFFICIAL CHALLENGES =====
INSERT INTO public.challenges (id, creator_id, title, description, objective, category, visibility, target_count, is_official, rules)
VALUES
 ('11111111-1111-4111-8111-111111111111', NULL, '7 Days of Movement', 'An official Darevo challenge: move your body every day for seven days. Walk, run, lift, stretch — you decide the activity, you prove the consistency.', 'Complete one workout per day for 7 days', 'fitness', 'public', 7, true, 'One proof per day. Photos or check-ins only. Be honest.'),
 ('22222222-2222-4222-8222-222222222222', NULL, 'Ship Something Small', 'An official Darevo challenge for builders: write and ship five small pieces of working code. A script, a component, a fix — it counts if it works.', 'Ship 5 small working things', 'coding', 'public', 5, true, 'Share a link or screenshot for each proof.'),
 ('33333333-3333-4333-8333-333333333333', NULL, 'Deep Study Week', 'An official Darevo challenge: five focused study sessions, no distractions. Log what you studied and for how long.', 'Complete 5 focused study sessions', 'study', 'public', 5, true, 'Log the topic and minutes studied in each proof.'),
 ('44444444-4444-4444-8444-444444444444', NULL, 'Create Every Day', 'An official Darevo challenge for creatives: make and publish one thing a day for five days. Drawing, writing, music, video — your medium, your rules.', 'Publish 5 creative pieces', 'creative', 'public', 5, true, 'Photo, screenshot or link proof for each piece.');

INSERT INTO public.challenge_proof_types (challenge_id, proof_type) VALUES
 ('11111111-1111-4111-8111-111111111111','checkin'),
 ('11111111-1111-4111-8111-111111111111','photo'),
 ('22222222-2222-4222-8222-222222222222','link'),
 ('22222222-2222-4222-8222-222222222222','screenshot'),
 ('22222222-2222-4222-8222-222222222222','text'),
 ('33333333-3333-4333-8333-333333333333','text'),
 ('33333333-3333-4333-8333-333333333333','number'),
 ('44444444-4444-4444-8444-444444444444','photo'),
 ('44444444-4444-4444-8444-444444444444','link'),
 ('44444444-4444-4444-8444-444444444444','screenshot');