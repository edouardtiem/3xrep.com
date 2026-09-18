"use client";
import { useEffect } from "react";

/** First-touch campaign metadata for this tab only. Never stores keys or URLs. */
export function AcquisitionTracker() {
  useEffect(()=>{
    const names=["utm_source","utm_campaign","utm_medium"];
    const key="3xrep-acquisition";
    let fields:Record<string,string>={};
    try {
      fields=JSON.parse(sessionStorage.getItem(key) ?? "{}");
      if (!fields.utm_source) {
        const query=new URLSearchParams(window.location.search);
        for(const name of names) { const value=query.get(name); if(value) fields[name]=value.replace(/[^a-zA-Z0-9_.-]/g,"").slice(0,100); }
        if(!fields.utm_source && document.referrer) {
          const host=new URL(document.referrer).hostname;
          if(host!==window.location.hostname){
            fields.utm_source=/^(www\.)?(x\.com|twitter\.com)$/.test(host) ? "x" : /(^|\.)google\.[a-z.]+$/.test(host) ? "google" : "referral";
            fields.utm_medium=fields.utm_source === "google" ? "organic" : "referral";
          }
        }
        if(fields.utm_source) sessionStorage.setItem(key,JSON.stringify(fields));
      }
    } catch { /* Signup still works when browser storage is unavailable. */ }
    const attach=(event:Event)=>{
      const form=event.target;
      if(!(form instanceof HTMLFormElement) || new URL(form.action).pathname!=="/api/orgs/start") return;
      const data=(event as FormDataEvent).formData;
      for(const name of names) if(fields[name] && !data.get(name)) data.set(name,fields[name]);
    };
    document.addEventListener("formdata",attach,true);
    return ()=>document.removeEventListener("formdata",attach,true);
  },[]);
  return null;
}
