import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

export async function loadSequencePlans() {
  const text = await readFile(new URL('../docs/gtm/cold-email-senior-beta-test.md', import.meta.url), 'utf8');
  const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  const html = body => body.split('\n\n').map(p => `<p>${escape(p).replaceAll('\n', '<br>')}</p>`).join('');
  return ['A', 'B'].map(variant => {
    const opening = text.match(new RegExp(`## Variante ${variant}[^\\n]+\\n([\\s\\S]*?)(?=\\n## )`))?.[1];
    const first = opening?.match(/Hi \{\{first_name\}\},[\s\S]*?\nEdouard/)?.[0];
    const subject = opening?.match(/\*\*Subject: (.*?)\*\*/)?.[1];
    if (!first || !subject) throw new Error(`Missing approved opening ${variant}`);
    const bodies = [first, ...[2, 3, 4].map(step => {
      const section = text.match(new RegExp(`### ${variant}${step}[^\\n]+\\n([\\s\\S]*?)(?=\\n### |\\n## |$)`))?.[1];
      const body = section?.match(/Hi \{\{first_name\}\},[\s\S]*?\nEdouard/)?.[0];
      if (!body) throw new Error(`Missing approved follow-up ${variant}${step}`);
      return body;
    })];
    const steps = bodies.map((body, index) => ({ seq_number: index + 1, seq_delay_details: { delay_in_days: [0, 4, 5, 7][index] },
      variant_distribution_type: 'MANUALLY_EQUAL', variants: [{ subject: index ? '' : subject, email_body: html(body), variant_label: variant }] }));
    return { id: `senior-beta-${variant.toLowerCase()}-v1`, cohort: 'senior-beta-2026-10-13', variant, version: 1,
      acquisition_campaign: `us_senior_beta_${variant.toLowerCase()}`, steps,
      content_hash: createHash('sha256').update(JSON.stringify(steps)).digest('hex'),
      name: `3xrep — Senior Beta ${variant} — 2026-10-13 v1` };
  });
}
