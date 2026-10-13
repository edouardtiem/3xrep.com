export const COHORT='senior-beta-2026-10-13';
export const SEARCH_FILTERS={limit:100,title:['Senior Account Executive','Enterprise Account Executive','Strategic Account Executive'],
  excludeTitle:['Manager','Director','Head','VP','Vice President','Founder','Intern','Junior'],country:['United States'],
  companyHeadCount:['0 - 25','25 - 100'],companyIndustry:['Software & Internet'],dontDisplayOwnedContact:true};
export function domainOf(value) {
  try {const d=new URL(value.includes('://')?value:`https://${value}`).hostname.toLowerCase().replace(/^www\./,'');return d.includes('.')?d:null;}catch{return null;}
}
export function qualification(profile) {
  if(!profile?.id||!profile.firstName||!profile.lastName||!domainOf(profile.company?.website||''))return 'incomplete_profile';
  if(profile.country!=='United States'||profile.industry!=='Software & Internet'||!['0 - 25','25 - 100'].includes(profile.companyHeadCount))return 'outside_target';
  if(/\b(manager|director|head|vp|vice president|founder|intern|junior|lead|leader)\b/i.test(profile.title||''))return 'manager_or_junior';
  if(!/\b(senior|sr\.?|enterprise|strategic|principal)\b.*\baccount executive\b/i.test(profile.title||''))return 'experience_not_established';
  return 'qualified_provider_profile';
}
export function minimalProfile(p) {return {id:p.id,firstName:p.firstName,lastName:p.lastName,title:p.title,company:{name:p.company?.name,website:p.company?.website},
  companyHeadCount:p.companyHeadCount,country:p.country,industry:p.industry,linkedin:p.linkedin||null};}
export function emailOf(p) {
  const value=(p.email||p.email_address||'').trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)&&!value.includes('*')?value:null;
}
export function sourcingAllowance({config,mode,testLimit=10,day,active=false,healthy=false,capacity=0,queued=0}) {
  if(mode==='test')return Math.min(10,Math.max(0,Number(testLimit)||0));
  if(!config.enabled||!config.validated_run_id)return 0;
  if(config.last_completed_date&&day<=config.last_completed_date||config.last_attempted_date&&day<=config.last_attempted_date)return 0;
  if(!active||!healthy||[0,6].includes(new Date(`${day}T12:00:00Z`).getUTCDay()))return 0;
  // Keep enough verified, not-yet-contacted people for the full mailbox
  // capacity. Four sequence steps do not divide first-send capacity by four:
  // follow-ups are absent at startup and uneven on later days.
  return Math.min(config.max_daily_contacts,Math.max(0,Math.ceil(capacity*config.buffer_days)-queued));
}
