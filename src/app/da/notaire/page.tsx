import type { Metadata } from "next";
import { Board } from "./board";

export const metadata: Metadata = {
  title: "3xrep — DA Notaire",
  description: "Direction artistique : l’acte. Terrain, pas un cours.",
};

export default function NotairePage() {
  return <Board />;
}
