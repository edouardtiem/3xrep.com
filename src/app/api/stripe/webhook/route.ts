import { syncBaseSubscription } from "@/lib/stripe-base-access";
import { attachStripe, issueKey, orgByCustomer, orgById, setOrgStatus } from "@/lib/orgs";
import { applyQueuedCredits, creditParrainOnPaid, reverseCreditsForFilleul } from "@/lib/referrals";
import { missingWebhookSecrets, stripeClient, stripeWebhookSecret } from "@/lib/stripe-env";
import { statusAfterCheckout } from "@/lib/trial";
import type Stripe from "stripe";

export const dynamic = "force-dynamic";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function customerId(ref: string | Stripe.Customer | Stripe.DeletedCustomer | null): string | null {
  if (!ref) return null;
  return typeof ref === "string" ? ref : ref.id;
}

function orgIdOfSession(session: Stripe.Checkout.Session): string | null {
  const meta = session.metadata?.org_id;
  if (meta && UUID_RE.test(meta)) return meta;
  const ref = session.client_reference_id;
  if (ref && UUID_RE.test(ref)) return ref;
  return null;
}

async function fingerprintFromInvoice(stripe: Stripe, invoice: Stripe.Invoice): Promise<string | null> {
  const cus = customerId(invoice.customer);
  if (!cus) return null;
  try {
    const customer = await stripe.customers.retrieve(cus);
    if (customer.deleted) return null;
    const pm = customer.invoice_settings?.default_payment_method;
    const pmId = typeof pm === "string" ? pm : pm?.id;
    if (!pmId) return null;
    const method = await stripe.paymentMethods.retrieve(pmId);
    return method.card?.fingerprint ?? null;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const missing = missingWebhookSecrets();
  if (missing.length) {
    return Response.json({ error: "webhook non configuré", missing }, { status: 503 });
  }

  const stripe = stripeClient();
  const sig = req.headers.get("stripe-signature");
  if (!sig) return Response.json({ error: "signature manquante" }, { status: 400 });
  const raw = await req.text();
  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(raw, sig, stripeWebhookSecret()!);
  } catch {
    return Response.json({ error: "signature invalide" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      if (session.mode !== "subscription") return Response.json({ received: true });
      const customer = customerId(session.customer);
      const orgId = orgIdOfSession(session);
      const sub =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id ?? null;
      if (orgId) {
        const org = await orgById(orgId);
        if (!org) throw new Error("org introuvable");
        const paid = session.payment_status === "paid";
        await attachStripe({
          orgId,
          stripeCustomerId: customer,
          stripeSessionId: session.id,
          stripeSubscriptionId: sub,
          status: statusAfterCheckout(org, paid),
        });
        if (sub) await syncBaseSubscription(stripe,org,sub);
        if (customer) await applyQueuedCredits(orgId);
      } else {
        await issueKey({
          stripeCustomerId: customer,
          stripeSessionId: session.id,
          stripeSubscriptionId: sub,
          email: session.customer_email ?? session.customer_details?.email ?? null,
        });
        const org=customer ? await orgByCustomer(customer) : null;
        if(org && sub) await syncBaseSubscription(stripe,org,sub);
      }
    }

    if (event.type === "customer.subscription.trial_will_end") {
      // Dashboard event. Cutoff is computed from trial_ends_at; no extra write.
    }

    if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
      const sub=event.data.object;
      const cus=customerId(sub.customer);
      const org=(cus ? await orgByCustomer(cus) : null) ?? (sub.metadata.org_id && UUID_RE.test(sub.metadata.org_id) ? await orgById(sub.metadata.org_id) : null);
      if(org) await syncBaseSubscription(stripe,org,sub.id);
    }

    if (event.type === "invoice.paid") {
      const invoice = event.data.object;
      const cus = customerId(invoice.customer);
      if (cus && invoice.amount_paid > 0) {
        const org = await orgByCustomer(cus);
        const subscription=invoice.parent?.subscription_details?.subscription;
        const subscriptionId=typeof subscription === "string" ? subscription : subscription?.id;
        if (org && subscriptionId) await syncBaseSubscription(stripe,org,subscriptionId);
        const fp = await fingerprintFromInvoice(stripe, invoice);
        if (fp && org) {
          const fresh=await orgById(org.id);
          if(fresh) await setOrgStatus(org.id, fresh.status as import("@/lib/trial").OrgStatus, { card_fingerprint: fp });
        }
        await creditParrainOnPaid({
          filleulCustomerId: cus,
          amountPaid: invoice.amount_paid,
          cardFingerprint: fp,
        });
      }
    }

    if (event.type === "charge.refunded") {
      const charge = event.data.object;
      const cus = customerId(charge.customer);
      if (cus) await reverseCreditsForFilleul(cus);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "orgs";
    return Response.json({ error: message }, { status: 500 });
  }

  return Response.json({ received: true });
}
