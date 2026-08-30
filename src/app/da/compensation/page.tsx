import type { Metadata } from "next";
import { Board } from "./board";

export const metadata: Metadata = {
  title: "3xrep — DA Compensation",
  description: "Direction artistique : la chambre de compensation. Terrain, pas un cours.",
};

export default function CompensationPage() {
  return <Board />;
}
