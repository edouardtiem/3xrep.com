"use client";

import { createContext, useContext, useState } from "react";

export const HOME_REPLIES = [
  { label: "“She’s too busy.”", move: "Make the meeting worth her time.", text: "Ask Julien which decision would warrant a short conversation. Agree the problem and the investment question with him before requesting an introduction.", say: "What would Maya need to decide for a short conversation about those six hours to be useful?" },
  { label: "“I can approve it.”", move: "Test the authority, together.", text: "Check the spending scope and whether anyone else can reject the purchase. Keep Julien involved; a job title alone does not settle it.", say: "For a purchase like this, is the final budget approval yours? Who could still say no?" },
  { label: "“I’ll introduce you.”", move: "Give the meeting a decision.", text: "Bring the confirmed problem, the open investment question and a proposed agenda. Ask Julien and Maya to agree a time before treating it as booked.", say: "Let’s use that conversation to check whether fixing the approval delays justifies an investment. What time works for you both?" },
];

const HomeDemoContext = createContext<{ active: number; select: (index: number) => void } | null>(null);
export function HomeDemoProvider({ children }: { children: React.ReactNode }) {
  const [active, select] = useState(0);
  return <HomeDemoContext.Provider value={{ active, select }}>{children}</HomeDemoContext.Provider>;
}
export function useHomeDemo() {
  const context = useContext(HomeDemoContext);
  if (!context) throw new Error("Home demo must be inside HomeDemoProvider");
  return context;
}
