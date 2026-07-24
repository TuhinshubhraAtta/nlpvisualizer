
import type { DiagramEdge as Edge } from "./relationshipDiagramData";
import type { PositionedNode } from "./relationshipDiagramUtils";
import { getEdgePoints } from "./relationshipDiagramUtils";

type DiagramEdgeProps = {
  edge: Edge;
  source: PositionedNode;
  target: PositionedNode;
};

export function DiagramEdge({ edge, source, target }: DiagramEdgeProps) {
  if (!source || !target) {
    return null;
  }

  return (
    <g>
      <polyline
        points={getEdgePoints(source, target)}
        fill="none"
        stroke="#67e8f9"
        strokeWidth="1.5"
        markerEnd="url(#arrow)"
      />
      <text
        x={(source.x + target.x) / 2 + 140}
        y={(source.y + target.y) / 2 + 10}
        fill="#cbd5e1"
        fontSize="12"
      >
        {edge.label}
      </text>
    </g>
  );
}
