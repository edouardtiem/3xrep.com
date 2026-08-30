import type { Metadata } from "next";
import { Board } from "./board";

export const metadata: Metadata = {
  title: "3xrep — Surface 1.1",
  description: "Call avec l’ops : liste, terrain, sortie.",
};

export default function Surface11Page() {
  return <Board />;
}
