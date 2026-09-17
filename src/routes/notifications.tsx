import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, Card } from "@/components/app-shell";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
export const Route=createFileRoute("/notifications")({component:Notifications});
function Notifications(){const {user}=useAuth();const [items,setItems]=useState<any[]>([]);useEffect(()=>{if(user)supabase.from("notifications").select("*").eq("user_id",user.id).order("created_at",{ascending:false}).limit(50).then(({data})=>setItems(data??[]))},[user]);const read=async(id:string)=>{await supabase.from("notifications").update({read:true}).eq("id",id);setItems(x=>x.map(n=>n.id===id?{...n,read:true}:n))};return <AppShell title="Notifications"><div className="mx-auto max-w-3xl space-y-2">{items.map(n=><button key={n.id} onClick={()=>read(n.id)} className={`block w-full text-left ${n.read?"opacity-60":""}`}><Card className="hover:bg-surface"><p className="text-sm font-semibold">{n.type.replaceAll("_"," ")}</p><p className="mt-1 text-xs text-muted-foreground">{new Date(n.created_at).toLocaleString()}</p></Card></button>)}{items.length===0&&<Card><p className="text-sm text-muted-foreground">You're all caught up. Notifications will appear here.</p></Card>}</div></AppShell>}
