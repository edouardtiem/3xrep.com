import {localDate,senderEmail} from './ramp-up.mjs';

export function businessDates(day,count=3) {
  const result=[];
  for(let date=new Date(`${day}T12:00:00Z`);result.length<count;date.setUTCDate(date.getUTCDate()+1)) {
    if(![0,6].includes(date.getUTCDay()))result.push(date.toISOString().slice(0,10));
  }
  return result;
}

// Only a next step justified by a real send reserves today's capacity.
// This is a forecast, not a provider queue. Mailbox limits remain authoritative.
export function firstSendBudget({capacity,day,staged,sequences,campaignIds,mailboxes=null}) {
  let dueFollowups=0,uncertain=0,unavailableFollowups=0;
  const bySender=new Map((mailboxes||[]).map(m=>[m.from_email.toLowerCase(),m]));
  const dueByMailbox=new Map();
  for(const campaignId of campaignIds) {
    const steps=sequences.find(s=>String(s.provider_campaign_id)===String(campaignId))?.steps;
    const group=staged.find(s=>String(s.campaignId)===String(campaignId));
    if(!Array.isArray(steps)||!group){uncertain++;continue;}
    for(const {entry,sent,stats} of group.entries) {
      if(entry.status!=='INPROGRESS'||stats.some(s=>s.is_bounced||s.is_unsubscribed||s.reply_time&&!s.ignore_reply))continue;
      const sends=stats.filter(s=>s.sent_time).map(s=>({step:Number(s.sequence_number),time:s.sent_time,from:sent.find(e=>String(e.stats_id)===String(s.stats_id))?.from}));
      sends.push(...sent.map(s=>({step:Number(s.email_seq_number),time:s.time,from:s.from})));
      const latest=sends.filter(s=>Number.isFinite(Date.parse(s.time))).sort((a,b)=>Date.parse(b.time)-Date.parse(a.time))[0];
      if(!latest||!Number.isInteger(latest.step)||latest.step<1){uncertain++;continue;}
      const next=steps.find(s=>Number(s.seq_number)===latest.step+1);
      if(!next)continue;
      const delay=Number(next.seq_delay_details?.delay_in_days);
      if(!Number.isFinite(delay)||delay<0){uncertain++;continue;}
      if(localDate(new Date(Date.parse(latest.time)+delay*86400000))<=day){
        if(mailboxes){
          const mailbox=bySender.get(senderEmail(latest.from));
          if(!mailbox){uncertain++;continue;}
          if(mailbox.capacity<=0||!mailbox.campaignIds.map(String).includes(String(campaignId))){unavailableFollowups++;continue;}
          dueByMailbox.set(mailbox.id,(dueByMailbox.get(mailbox.id)||0)+1);
        }
        dueFollowups++;
      }
    }
  }
  // Missing history keeps the conservative legacy allowance and is visible.
  const reservedFollowups=mailboxes?(mailboxes.reduce((n,m)=>n+Math.min(m.capacity,dueByMailbox.get(m.id)||0),0)):dueFollowups;
  const newLeads=uncertain?Math.floor(capacity/4):Math.max(0,capacity-reservedFollowups);
  return {capacity,dueFollowups,reservedFollowups,unavailableFollowups,deferredFollowups:Math.max(0,dueFollowups-reservedFollowups)+unavailableFollowups,uncertain,newLeads};
}
