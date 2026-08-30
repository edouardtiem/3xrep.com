import type { Metadata } from "next";
import { Board } from "./board";

export const metadata: Metadata = {
  title: "3xrep — DA Surface",
  description: "Direction artistique : milieu Linear, deal comme une issue.",
};

export default function SurfacePage() {
  return <Board />;
}
