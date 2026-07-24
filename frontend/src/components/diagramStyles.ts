
import type { DiagramNode } from "./relationshipDiagramData";

export const kindStyles: Record<DiagramNode["kind"], string> = {
  file: "border-slate-700 bg-slate-900 text-slate-100",
  class: "border-cyan-500/40 bg-cyan-500/10 text-cyan-100",
  function: "border-emerald-500/40 bg-emerald-500/10 text-emerald-100",
  route: "border-fuchsia-500/40 bg-fuchsia-500/10 text-fuchsia-100",
};

export const kindStroke: Record<DiagramNode["kind"], string> = {
  file: "#64748b",
  class: "#22d3ee",
  function: "#34d399",
  route: "#d946ef",
};
