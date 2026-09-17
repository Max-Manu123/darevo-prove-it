import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Compass, Trophy, Upload } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({ component: Index });

function createFileRoute(path: string) { return ({} as any); }

function Index() {
  const { session } = useAuth();
  return <div className="min-h-screen bg-background text-foreground">
    <header className="border-b border-border"><div className="container-page flex h-16 items-center justify-between"><div className="font-display text-lg font-bold">DAREVO</div><div className="flex gap-2">{session ? <Link to="/home" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Open Darevo</Link> : <Link to="/auth" className="rounded-md border border-border px-4 py-2 text-sm font-semibold">Sign in</Link>}</div></div></header>
    <main>
      <section className="container-page grid min-h-[72vh] items-center gap-10 py-20 lg:grid-cols-[1.15fr_.85fr]">
        <div><p className="eyebrow mb-5">SOCIAL CHALLENGES</p><h1 className="display-xl max-w-4xl">CREATE YOUR CHALLENGE.<br/>PROVE YOU CAN DO IT.</h1><p className="mt-7 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">Create challenges, join other people's goals, submit real proof and compete on progress—not promises.</p><div className="mt-8 flex flex-wrap gap-3"><Link to={session ? "/create" : "/auth"} className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-bold text-primary-foreground">Create a challenge <ArrowRight size={17}/></Link><Link to="/explore" className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-5 text-sm font-bold">Explore challenges</Link></div></div>
        <div className="grid gap-3"><Feature icon={<Check/>} title="Create" text="Define a goal, rules, deadline and proof type."/><Feature icon={<Upload/>} title="Prove" text="Submit check-ins, numbers, text, photos, video or links."/><Feature icon={<Trophy/>} title="Compete" text="Earn points, build streaks and compare progress."/></div>
      </section>
      <section className="border-y border-border"><div className="container-page grid gap-8 py-14 md:grid-cols-3"><Step n="01" title="Create" text="Turn an idea into a clear challenge."/><Step n="02" title="Join" text="Participate in challenges that matter to you."/><Step n="03" title="Prove" text="Submit proof and keep moving."/></div></section>
      <section className="container-page py-16"><div className="flex items-center justify-between gap-4"><div><p className="eyebrow">CATEGORIES</p><h2 className="display-lg mt-2">Choose your arena.</h2></div><Compass className="hidden text-muted-foreground sm:block"/></div><div className="mt-8 flex flex-wrap gap-2">{["Fitness","Study","Coding","Gaming","Creative","Business","Other"].map(x=><span key={x} className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground">{x}</span>)}</div></section>
      <footer className="border-t border-border"><div className="container-page flex flex-col gap-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} Darevo</span><div className="flex flex-wrap gap-4"><Link to="/legal">Terms & Privacy</Link><Link to="/feedback">Feedback</Link></div></div></footer>
    </main>
  </div>
}
function Feature({icon,title,text}:{icon:React.ReactNode;title:string;text:string}) { return <div className="border border-border bg-card p-5"><div className="mb-5 flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">{icon}</div><h3 className="text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></div> }
function Step({n,title,text}:{n:string;title:string;text:string}) { return <div><span className="text-xs font-bold text-muted-foreground">{n}</span><h3 className="mt-3 text-xl font-bold">{title}</h3><p className="mt-2 text-sm text-muted-foreground">{text}</p></div> }
