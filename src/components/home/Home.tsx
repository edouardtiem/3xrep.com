"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { CheckoutButton } from "@/components/CheckoutButton";
import { Header } from "@/components/Header";
import { CoworkDemo } from "@/components/home/CoworkDemo";
import { WorksWith } from "@/components/WorksWith";
import { TRUST_LINE } from "@/lib/copy";
import { LIST_PRICE_USD } from "@/lib/stripe-checkout-session";

function Band({
  children,
  raise = false,
  tight = false,
}: {
  children: ReactNode;
  raise?: boolean;
  tight?: boolean;
}) {
  return (
    <section
      className={`border-t border-line ${raise ? "bg-raise" : ""} ${
        tight ? "py-12 sm:py-12" : "py-16 sm:py-24"
      }`}
    >
      <div className="mx-auto w-full max-w-[88rem] px-5 sm:px-10">{children}</div>
    </section>
  );
}

export function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />

      <div className="mx-auto w-full max-w-[88rem] flex-1 px-5 pt-8 pb-16 sm:px-10 sm:pt-10 lg:pb-16">
        <div className="flex flex-col lg:grid lg:grid-cols-[minmax(18rem,26rem)_minmax(0,1fr)] lg:items-start lg:gap-12">
          <section className="lg:sticky lg:top-8">
            <h1 className="text-[2rem] leading-[1.1] font-medium tracking-[-0.03em] sm:text-[2.5rem]">
              Your AI believes your CRM.
              <br />
              We don&apos;t.
            </h1>
            <p className="text-mute mt-4 max-w-[40ch] text-[1.125rem] leading-[1.5]">
              14 days free. Then ${LIST_PRICE_USD} a month for the whole company.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/start"
                className="inline-block cursor-pointer rounded-lg bg-fg px-5 py-3 text-[0.9375rem] font-medium text-bg hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
              >
                Start 14 days free
              </Link>
              <p className="text-dim text-[0.8125rem] leading-[1.4]">No card today.</p>
            </div>
            <p className="text-dim mt-10 hidden text-[0.8125rem] leading-[1.4] lg:block">
              Same deals. Two answers.
            </p>
          </section>

          <section className="mt-10 min-w-0 lg:mt-0">
            <p className="text-dim mb-3 text-[0.8125rem] leading-[1.4] lg:hidden">
              Same deals. Two answers.
            </p>
            <CoworkDemo />
            <p className="text-dim mt-3 text-[0.8125rem] leading-[1.4]">
              Click a question. Same conversation.
            </p>
          </section>
        </div>
      </div>

      <Band>
        <p className="max-w-[40rem] text-[1.35rem] leading-[1.25] tracking-[-0.02em] sm:text-[1.75rem]">
          He lives in Claude or ChatGPT, next to HubSpot.
          <br />
          Not inside HubSpot.
        </p>
      </Band>

      <Band raise>
        <WorksWith marquee />
      </Band>

      <Band>
        <div className="max-w-[40rem]">
          <p className="text-[1.35rem] leading-[1.25] tracking-[-0.02em] sm:text-[1.75rem]">
            ${LIST_PRICE_USD} a month for the whole company.
          </p>
          <p className="text-mute mt-4 text-[1.125rem] leading-[1.5]">
            After the trial. One price, no matter how many people sell.
          </p>
          <p className="text-mute mt-3 text-[1.125rem] leading-[1.5]">
            Gong is about $1,250 a month for a team of ten. We are $
            {LIST_PRICE_USD} a month for the whole company.
          </p>
          <div className="mt-8">
            <CheckoutButton
              label={`Pay $${LIST_PRICE_USD} a month`}
              className="cursor-pointer rounded-lg bg-fg px-5 py-3 text-[0.9375rem] font-medium text-bg hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            />
          </div>
        </div>
      </Band>

      <Band>
        <div className="max-w-[40rem] space-y-5 text-[1.35rem] leading-[1.25] tracking-[-0.02em] sm:text-[1.75rem]">
          <p>Not Gong. We don&apos;t join your calls.</p>
          <p>Not your CRM&apos;s assistant. It fills the fields. We say which ones are empty.</p>
          <p>Not a course. Not &ldquo;you close Friday.&rdquo;</p>
          <p>
            We name what&apos;s missing. And the stage in HubSpot that isn&apos;t
            true.
          </p>
        </div>
      </Band>

      <Band tight>
        <p className="text-dim max-w-[40rem] text-[0.8125rem] leading-relaxed">
          {TRUST_LINE}
        </p>
      </Band>
    </div>
  );
}
