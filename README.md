# Darevo: Prove It

BUILD DAREVO — COMPLETE MVP

You are building Darevo, a professional social challenge platform.

The goal is to build a complete, functional, production-quality MVP that can be used by real users for validation.

Do NOT create a mockup, static prototype, fake buttons, placeholder flows, or non-functional UI.

Everything visible to the user must work correctly.

Before finishing, perform a complete application audit and fix all functional, UI, responsive, routing, database, authentication, validation, loading, error, and security issues you find.

1. CORE PRODUCT

Darevo allows users to:

Create challenges.

Discover public challenges.

Join challenges.

Participate in challenges.

Submit proof of participation.

Track progress.

Earn points.

Maintain activity streaks.

Compete in public/global rankings.

Compete in private challenge rankings.

Comment on challenges.

Share public challenges.

Invite people to private challenges.

Receive notifications.

Report inappropriate content.

Manage their profile and privacy.

Send feedback.

Join the future Pro waitlist.

The MVP must focus on validating whether users actually participate, submit proof, return, interact, share/invite others, and create additional challenges.

Do NOT add unnecessary features outside this scope.

2. IMPORTANT IMPLEMENTATION RULE

Use Lovable's native/recommended infrastructure wherever possible.

Use:

Lovable-native database/backend capabilities.

Lovable-native authentication/integrations.

Lovable-native analytics capabilities where available.

Lovable-supported storage for uploaded files.

No unnecessary external AI API.

No unnecessary third-party backend.

No fake database.

No local-only persistence for important application data.

If an AI feature is not necessary for the MVP, DO NOT add AI.

The MVP does not require generative AI.

3. TECHNOLOGY

Use the existing/default Lovable stack and architecture unless there is a strong technical reason not to.

Prefer:

React

TypeScript

Vite

Responsive CSS

Proper component architecture

Secure backend/database rules

Proper authentication

Proper file storage

Proper validation

Keep the code maintainable and modular.

Do not create one giant component.

Create reusable components for:

Navigation

Buttons

Inputs

Cards

Modals

Dialogs

Forms

Toasts

Loading states

Empty states

Error states

Challenge cards

Proof cards

Comments

Rankings

Notifications

Profile statistics

4. BRAND

Product name:

Darevo

Tagline:

CREATE YOUR CHALLENGE. PROVE YOU CAN DO IT.

The brand should feel:

modern

professional

energetic

social

trustworthy

clean

premium

simple

Do not make the design look like a generic AI-generated SaaS dashboard.

Avoid excessive gradients, excessive rounded cards, excessive shadows, visual clutter, or childish gamification.

5. COLOR SYSTEM

Use a sophisticated black/white/gray visual system.

Primary:

Background: #000000

Surface/card: #111111

Secondary surface: #181818

Border: #2A2A2A

Primary text: #FFFFFF

Secondary text: #A0A0A0

Muted text: #707070

Use functional colors only when necessary:

Success: green

Error/danger: red

Warning: amber

Informational states: subtle blue

Do not make the entire interface colorful.

Buttons should have clear hierarchy and excellent contrast.

6. RESPONSIVE DESIGN

The entire product must work professionally on:

Small screens

Approximately:

320px

360px

375px

390px

414px

Medium screens

Approximately:

768px

834px

1024px

Large screens

Approximately:

1280px

1440px

1920px+

Do not simply scale the desktop UI down.

Create responsive layouts intentionally.

Mobile requirements:

No horizontal scrolling.

Touch-friendly controls.

Buttons must be easy to tap.

Navigation must remain usable.

Forms must fit small screens.

Cards must not overflow.

Modals must fit the viewport.

Text must wrap correctly.

Images/videos must remain within containers.

Tables/rankings must remain usable on mobile.

Long challenge titles must wrap.

Bottom navigation may be used on mobile if appropriate.

Desktop requirements:

Professional centered content widths.

Good whitespace.

Multi-column layouts where useful.

No excessive empty space.

Proper max-width containers.

7. LANGUAGES

Support:

Portuguese

English

Create the application architecture so additional languages can be added later.

Do not hard-code UI strings throughout components.

Use an i18n structure.

Default language may follow the browser/device language.

Provide a language selector in Settings.

Portuguese should be neutral/international Portuguese.

English should be simple and international.

8. AUTHENTICATION

Implement fully functional authentication.

Support:

Google

Button:

"Continue with Google"

Facebook

Button:

"Continue with Facebook"

Email/password

Fields:

Email

Password

Actions:

Sign in

Create account

Forgot password

Reset password

Email verification

Logout

Delete account

Authentication must actually work.

Do not create fake login buttons.

Handle:

invalid credentials

already registered email

weak password

invalid email

expired reset links

loading states

authentication errors

session persistence

logout

protected routes

9. LANDING PAGE

Create a highly professional landing page.

Sections:

Hero

Headline:

"CREATE YOUR CHALLENGE. PROVE YOU CAN DO IT."

Supporting text explaining Darevo clearly.

Primary CTA:

"Create a challenge"

Secondary CTA:

"Explore challenges"

Show a polished product preview.

How it works

Three/four steps:

Create

Join

Prove

Compete

Challenge categories

Show examples:

Fitness

Study

Coding

Gaming

Creative

Business

Other

Social/proof concept

Explain that users can submit proof and participate with others.

Do not invent fake statistics.

Do not display fake user counts.

Final CTA

"Start your first challenge"

Footer

Include:

Darevo

Terms

Privacy

Community Rules

Feedback

Contact

Language selector

The landing page must be responsive and professional.

10. APP NAVIGATION

Desktop navigation:

Home

Explore

Create

Notifications

Profile

Also include:

Settings

Logout

Mobile navigation should be optimized for touch.

Do not overload navigation.

11. HOME

Home should contain:

Featured challenges

Show selected public challenges.

New challenges

Show recently created public challenges.

Create Challenge CTA

Button:

"+ Create challenge"

If there are no real user challenges yet, seed a small number of clearly identified official Darevo challenges.

IMPORTANT:

Never fake:

participants

likes

activity

comments

rankings

Official seed challenges must be clearly identifiable as official Darevo challenges.

12. EXPLORE

Explore must support:

Search

Search public challenges by:

title

description

category

Categories

All

Fitness

Study

Coding

Gaming

Creative

Business

Other

Sorting

Popular

New

Only public challenges should appear in Explore.

Private challenges must NEVER appear in public discovery.

Provide:

loading state

empty state

error state

pagination or efficient loading

13. CHALLENGE CREATION

Create Challenge form.

Fields:

Name

Required.

Description

Required.

Objective

Required.

Category

Required.

Options:

Fitness

Study

Coding

Gaming

Creative

Business

Other

Visibility

Options:

Public

Private

Public:

appears in Explore

can be shared publicly

Private:

does not appear in Explore

accessible through invitation/share link

Both are unlimited on Free.

Duration

Options:

No deadline

Has deadline

Proof types

Allow creators to select:

Check-in

Number

Text

Photo

Video

Screenshot

Link

Rules

Optional but recommended.

Create button

"Create challenge"

Validate all fields.

Show inline validation.

Show loading state.

Prevent duplicate submissions.

After creation:

save to database

generate challenge ID

generate share URL

redirect to challenge page

show success feedback

14. PRIVATE CHALLENGES

Private challenges:

do not appear in Explore

do not appear in public discovery

can be shared with an invite link

can be shared through normal device sharing

require authentication before participation

Provide:

"Copy invite link"

"Share"

If a user opens a private invite while logged out:

Show challenge information.

Ask them to sign in/register.

After authentication, return them to the challenge.

Allow participation.

15. CHALLENGE PAGE

Show:

Title

Description

Objective

Category

Creator

Visibility

Participants

Deadline

Rules

Progress

Ranking

Proofs

Comments

Share

Report

Primary CTA:

"Join challenge"

After joining:

"Continue challenge"

Show user's progress.

Do not show Join button when already participating.

Handle completed challenges correctly.

16. PARTICIPATION

When a user joins:

Create a participation record.

Track:

user

challenge

join date

progress

completion

points

streak-related activity

Prevent duplicate participation records.

Users should be able to leave a challenge if appropriate.

If leaving is implemented, define behavior clearly and ensure database consistency.

17. PROGRESS

Show:

progress percentage

completed steps/check-ins

current streak

challenge status

Use a clean progress bar.

No fake progress.

All progress must come from database data.

18. PROOF SUBMISSION

Users can submit proof based on the challenge's allowed proof types.

Supported:

Check-in

Simple completion action.

Number

Numeric value.

Text

Text proof.

Photo

Maximum:

10 MB

Screenshot

Maximum:

10 MB

Video

Maximum:

50 MB

Maximum video duration:

60 seconds

Supported common web formats.

Link

Validate URLs.

19. FILE VALIDATION

Validate file size and type:

Frontend AND backend/storage rules.

Reject oversized files.

Show clear error messages.

Never allow a client-side-only upload restriction.

Use secure storage.

Do not expose private files publicly.

Prevent users from uploading arbitrary executable files.

Use safe MIME/type validation.

20. PROOF FEED

Show proof cards containing:

user

date

content

media

optional description

Each proof has:

"•••"

Menu:

Report

Users should be able to delete their own proof.

When proof is deleted:

Recalculate only the metrics directly dependent on that proof.

Do NOT arbitrarily remove unrelated points or progress.

21. SCORING

Keep scoring simple.

For example:

valid check-in/proof activity = points

challenge completion = completion bonus

Do not create a complicated XP economy.

Define the scoring logic centrally so it cannot be inconsistent between pages.

Important:

Global score

Only points from public/global challenges count toward global score and global ranking.

Private score

Private challenge points exist only inside that private challenge.

Private challenge points MUST NOT affect global ranking.

22. PROFILE

Profile must show:

avatar

username

global score

current streak

highest streak

challenges completed

challenges created

proofs submitted

global ranking position

Tabs:

Participating

Completed

Created

Private challenge rankings should be visible inside the relevant private challenge, not as a global profile score.

23. STREAK

Implement a simple activity streak.

Track:

current streak

highest streak

A streak represents consecutive qualifying activity days.

Define the logic consistently.

Do not create complicated streak systems.

Deleting content should only affect streak calculations if that content was directly responsible for the qualifying activity.

24. RANKINGS

Global ranking

Only public challenge points.

Show:

rank

username

score

Private ranking

Only participants of that private challenge.

Show:

rank

username

private score

Do not mix private points with global points.

25. COMMENTS

Implement simple comments.

Users can:

create comments

delete their own comments

report comments

Do NOT implement:

DMs

private chat

threaded discussions

GIF systems

complex reactions

Keep comments simple.

26. SHARING

Public challenges:

Copy link

Share

Private challenges:

Copy invite link

Share

Use native browser/device sharing APIs where supported.

Always provide copy-link fallback.

After copying:

Show confirmation toast.

27. NOTIFICATIONS

Implement in-app notifications.

Examples:

Someone joined your challenge.

Someone completed your challenge.

Someone commented on your proof.

Your challenge is ending soon.

You were overtaken in ranking.

Each notification should link to the relevant object.

Provide:

unread state

mark as read

mark all as read

Do not implement push notifications unless Lovable can provide them cleanly without adding unnecessary complexity.

28. REPORTING AND MODERATION

Users can report:

challenges

proofs

comments

users

Reasons:

Spam

Fake proof

Harassment

Inappropriate content

Threat/violence

Other

IMPORTANT:

Do NOT automatically delete content based on number of reports.

A report creates a moderation record.

Admin manually reviews it.

Admin actions:

Keep

Remove content

Warn user

Suspend user

Do not create automatic "5 reports = deletion" logic.

29. ADMIN PANEL

Create a protected admin area.

Admin can view:

users

challenges

proofs

comments

reports

Admin can:

review reports

remove content

warn users

suspend users

Protect admin routes with proper authorization.

Normal users must never access admin functionality.

30. SETTINGS

Settings sections:

Account

Profile

Email

Password

Logout

Delete account

Preferences

Language

Notifications

Privacy

Profile visibility

Public profile content

Data access

Security

Sessions

Logout

Legal

Terms

Privacy Policy

Community Rules

Help

Feedback

Contact

Danger zone

Delete account

31. LEGAL PAGES

Create pages for:

Terms of Use

Privacy Policy

Community Rules

Use professional placeholder/legal structure that can later be reviewed by a qualified lawyer.

Do not claim legal compliance with specific jurisdictions without verification.

Community rules should prohibit:

harassment

threats

hate attacks

prohibited sexual content

encouragement of real-world violence

fake proof

spam/scams

abusive advertising

copyright violations

Include reporting instructions.

32. AGE AND SAFETY

Because this is a social platform with user-generated content, implement an appropriate age policy/notice and community safety rules.

Do not claim a specific legal age requirement unless verified for the applicable jurisdiction.

33. PRO WAITLIST

Free users can use:

unlimited public challenges

unlimited private challenges

unlimited participation

proofs

comments

rankings

profile

sharing

Do NOT artificially limit challenge creation.

Pro does not need real payment in MVP.

Upgrade button opens:

"Want to know when Darevo Pro launches?"

Email field.

Button:

"Notify me"

Store email safely.

Prevent duplicate submissions.

34. FEEDBACK

Create feedback form.

Fields:

feedback type

message

optional email

Allow users to submit feedback.

Include optional question:

"Would you recommend Darevo to a friend?"

Use a simple scale if appropriate.

Store feedback in the database.

35. ANALYTICS

Use Lovable-native/recommended analytics.

Track at minimum:

signup_completed

challenge_created

challenge_joined

challenge_started

proof_submitted

challenge_completed

comment_created

challenge_shared

invite_link_clicked

invite_accepted

user_returned

challenge_reported

upgrade_clicked

pro_email_submitted

feedback_submitted

Track retention where supported:

Day 1

Day 2

Day 3

Day 7

Do not collect unnecessary sensitive personal information.

Do not track private content unnecessarily.

36. DATABASE

Create a proper relational database.

Suggested entities:

profiles

id

username

display_name

avatar_url

bio

language

profile_visibility

created_at

updated_at

challenges

id

creator_id

title

description

objective

category

visibility

deadline

rules

created_at

updated_at

challenge_proof_types

id

challenge_id

proof_type

participations

id

challenge_id

user_id

joined_at

progress

completed_at

points

proofs

id

challenge_id

user_id

proof_type

text_content

numeric_value

media_url

link_url

description

created_at

updated_at

comments

id

challenge_id

user_id

content

created_at

updated_at

notifications

id

user_id

type

reference_id

read

created_at

reports

id

reporter_id

target_type

target_id

reason

description

status

reviewed_by

reviewed_at

created_at

feedback

id

user_id nullable

email nullable

type

message

recommendation_score nullable

created_at

pro_waitlist

id

email

user_id nullable

created_at

Add appropriate timestamps and indexes.

Use foreign keys.

Use unique constraints where appropriate.

Prevent duplicate participation.

37. DATABASE SECURITY

Implement proper row-level authorization/security.

Users should only be able to:

edit their own profile

delete their own content

create their own challenges

edit their own challenges

submit their own proofs

create/delete their own comments

see private challenge data only when authorized

access their own account data

Public challenge information can be publicly readable.

Private challenge information must not leak through public queries.

Admin operations must be protected.

Never trust client-side authorization.

38. DELETE BEHAVIOR

Implement safe deletion.

If a user deletes a proof:

delete the proof

remove associated media

recalculate directly dependent points/progress

recalculate completion if necessary

recalculate streak only if necessary

If a user deletes a challenge:

remove/hide the challenge appropriately

handle participations/proofs/comments consistently

do not corrupt rankings

do not leave broken links

preserve database integrity

Use proper cascading/soft deletion where appropriate.

39. ERROR HANDLING

Every important operation needs:

loading state

success state

error state

Handle:

network failure

authentication failure

upload failure

database failure

invalid input

unauthorized access

deleted content

missing challenge

expired/private invite

empty search results

Create:

404 page

error page

loading states

empty states

Never leave the user staring at a blank screen.

40. BUTTONS

Every button must have a real action.

No dead buttons.

Examples:

Create challenge → creates challenge

Join → creates participation

Submit proof → saves proof

Share → opens share/copy

Comment → saves comment

Report → creates report

Delete → deletes after confirmation

Logout → logs out

Settings → opens settings

Upgrade → opens Pro waitlist

Feedback → submits feedback

Explore → opens Explore

Profile → opens profile

Notifications → opens notifications

If a feature is not implemented, do not display a button pretending that it works.

41. UX DETAILS

Use:

toast notifications

confirmation dialogs for destructive actions

disabled states while submitting

skeleton loaders where useful

clear form errors

accessible labels

keyboard accessibility

visible focus states

good contrast

semantic HTML

alt text

proper button/input semantics

Do not rely only on color to communicate state.

42. EMPTY STATES

Every major page must have a useful empty state.

Examples:

No challenges:

"No challenges yet. Create the first one."

No participation:

"You haven't joined a challenge yet."

No notifications:

"You're all caught up."

No proofs:

"No proof submitted yet."

No search results:

"No challenges found."

43. PERFORMANCE

Optimize for real users.

Avoid:

unnecessary re-renders

loading huge media files unnecessarily

unoptimized images

huge initial JavaScript bundles

repeated database queries

duplicate requests

Lazy-load appropriate routes/components.

Paginate or efficiently load large lists.

44. ACCESSIBILITY

The application should be usable with keyboard navigation.

Include:

semantic buttons

labels

focus states

accessible dialogs

accessible navigation

sufficient contrast

screen-reader-friendly labels

45. SECURITY

Implement:

authentication checks

authorization checks

database policies

upload validation

file size validation

safe URL validation

input validation

XSS-safe rendering

protected admin routes

protected private challenge data

Never expose secrets in frontend code.

Never commit API keys/secrets.

46. DO NOT BUILD

Do NOT add these to the MVP:

payments

subscriptions

marketplace

DMs

private chat

complex messaging

AI game generation

AI moderation

coins

XP economy

dozens of badges

country rankings

category rankings

complex recommendation algorithms

advertisements

cryptocurrency

NFT functionality

livestreaming

advanced video editing

Keep the product focused.

47. FINAL QA — VERY IMPORTANT

Before declaring the project finished, perform a complete audit.

Test the full user journey:

New user

Landing
→ Sign up
→ Verify account
→ Home
→ Explore
→ Open challenge
→ Join
→ Submit proof
→ Progress updates
→ Points update
→ Ranking updates
→ Profile updates
→ Notification generated

Creator

Login
→ Create public challenge
→ Challenge appears in Explore
→ Share
→ Another user joins
→ Creator sees participant
→ Creator sees proof
→ Creator receives notification

Private challenge

Create private challenge
→ Copy invite link
→ Open invite link logged out
→ Login/register
→ Return to challenge
→ Join
→ Participate
→ Private ranking works
→ Private data does not appear in Explore/global ranking

Moderation

User reports proof
→ Admin sees report
→ Admin reviews
→ Admin keeps/removes content
→ Content state updates correctly

Deletion

User deletes proof
→ proof disappears
→ media removed
→ directly dependent metrics recalculate
→ unrelated metrics remain intact

Responsive

Test the important flows at:

320px
375px
390px
414px
768px
1024px
1280px
1440px
1920px

Fix every overflow, broken layout, unreadable text, clipped modal, and inaccessible button.

48. FINAL CODE QUALITY AUDIT

Before finishing:

Find broken imports.

Find TypeScript errors.

Find unused/broken components.

Find console errors.

Find dead buttons.

Find broken routes.

Find missing loading states.

Find missing error states.

Find database authorization problems.

Find insecure public/private data access.

Find broken mobile layouts.

Find forms without validation.

Find duplicate submissions.

Find race conditions where practical.

Verify file upload limits.

Verify authentication persistence.

Verify logout.

Verify account deletion.

Verify challenge deletion.

Verify proof deletion.

Verify ranking calculations.

Verify streak calculations.

Verify private challenge isolation.

Verify admin authorization.

Verify analytics events.

Verify no secrets are exposed.

Fix all issues found.

Do not simply report issues to me.

Fix them.

49. IMPORTANT PRODUCT PRINCIPLE

Darevo is a validation MVP.

Prioritize:

Reliability > simplicity > clarity > visual polish > extra features.

Do not expand the scope.

The application should feel like a real professional product, not a prototype.

Every core flow must actually work.

Every visible button must work.

Every important piece of data must persist correctly.

The final result should be usable by real users immediately.

50. FINAL DELIVERABLE

Deliver a complete Darevo MVP with:

Professional landing page

Authentication

Home

Explore

Challenge creation

Public challenges

Private challenges

Participation

Progress

Proof submission

File uploads

Global scoring

Private scoring

Global ranking

Private ranking

Streaks

Profiles

Comments

Sharing

Invite links

Notifications

Reporting

Admin moderation

Settings

Privacy

Terms

Community Rules

Feedback

Pro waitlist

Analytics

Responsive design

Secure database

Proper authorization

Error handling

Empty states

Loading states

Accessibility

PT/EN

Mobile/tablet/desktop support

Do not stop at the UI.

Build the actual working application and verify every core flow end-to-end.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/31f5918f-0fb5-4f6d-913b-ac862ccf68c0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
