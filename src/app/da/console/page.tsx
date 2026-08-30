import type { Metadata } from "next";
import { Board } from "./board";

export const metadata: Metadata = {
  title: "3xrep — DA Console",
  description: "Direction artistique : terminal, sans Matrix.",
};

export default function ConsolePage() {
  return <Board />;
}
