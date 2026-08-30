import type { Metadata } from "next";
import { Board } from "./board";

export const metadata: Metadata = {
  title: "3xrep — DA Surface",
  description: "Direction artistique : le dossier du call.",
};

export default function SurfacePage() {
  return <Board />;
}
