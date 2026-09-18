import { z } from "zod";
import { admin } from "@/lib/supabase-admin";
import { closeLegacyCheckouts, grantFounding, isFoundingAdmin, requireProgramEnvironment } from "@/lib/founding-admin";

export const dynamic = "force-dynamic";
const headers = { "Cache-Control":"no-store" };
const command = z.discriminatedUnion("action",[
  z.object({action:z.literal("grant"),orgId:z.uuid(),company:z.string().min(3).max(200),note:z.string().min(5).max(1000)}),
  z.object({action:z.enum(["revoke","exclude","note"]),orgId:z.uuid(),note:z.string().min(3).max(1000)}),
  z.object({action:z.literal("end_beta")}),
  z.object({action:z.literal("configure"),enabled:z.boolean(),endsAt:z.iso.datetime(),transitionDays:z.number().int().min(7).max(60).default(14),minSessions:z.number().int().min(2).max(100).default(3),minActiveDays:z.number().int().min(2).max(60).default(3),minOutputs:z.number().int().min(1).max(1000).default(3),earlyPromotionCode:z.string().regex(/^promo_/).nullable().default(null)}),
]);
export async function GET(req: Request) {
  if (!isFoundingAdmin(req)) return Response.json({error:"Unauthorized"},{status:401,headers});
  try {
    const program = await requireProgramEnvironment();
    const db = admin()!;
    const results = await Promise.all([
      db.from("founding_dashboard").select("*").order("created_at",{ascending:false}).limit(1000),
      db.from("beta_retention").select("*").limit(3000),
      db.from("beta_feedback").select("*").order("created_at",{ascending:false}).limit(100),
      db.from("founding_audit").select("*").order("created_at",{ascending:false}).limit(100),
      db.from("beta_lifecycle").select("*").limit(1000),
    ]);
    for (const result of results) if(result.error) throw new Error(result.error.message);
    return Response.json({program,workspaces:results[0].data,retention:results[1].data,feedback:results[2].data,audit:results[3].data,lifecycle:results[4].data,activeUsers:null,activeUsersReason:"Shared organization keys cannot identify individual users."},{headers});
  } catch(err) { return Response.json({error:err instanceof Error ? err.message : "Unavailable"},{status:503,headers}); }
}
export async function POST(req: Request) {
  if (!isFoundingAdmin(req)) return Response.json({error:"Unauthorized"},{status:401,headers});
  const parsed = command.safeParse(await req.json().catch(()=>null));
  if (!parsed.success) return Response.json({error:"Invalid command",issues:parsed.error.issues},{status:400,headers});
  const input=parsed.data;
  try {
    await requireProgramEnvironment();
    const db=admin()!;
    if (input.action === "grant") return Response.json(await grantFounding(input.orgId,input.company,input.note),{headers});
    if (input.action === "configure") {
      if (input.enabled && Date.parse(input.endsAt) <= Date.now()) return Response.json({error:"Choose a future end date"},{status:400,headers});
      if (input.enabled) await closeLegacyCheckouts();
      const {error}=await db.from("founding_program").update({enabled:input.enabled,ends_at:input.endsAt,transition_days:input.transitionDays,min_sessions:input.minSessions,min_active_days:input.minActiveDays,min_outputs:input.minOutputs,early_promotion_code:input.earlyPromotionCode}).eq("id",true);
      if(error) throw new Error(error.message);
      return Response.json({ok:true,note:"New enrollments use this configuration. Existing access deadlines are preserved. Use end_beta to end the cohort early with grace."},{headers});
    }
    const {error}= input.action === "end_beta" ? await db.rpc("end_public_beta") : await db.rpc("manage_founding",{p_org:input.orgId,p_action:input.action,p_note:input.note});
    if(error) throw new Error(error.message);
    return Response.json({ok:true},{headers});
  } catch(err) {return Response.json({error:err instanceof Error ? err.message : "Operation failed; retry after resolving the cause"},{status:409,headers});}
}
