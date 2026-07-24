
import type { PositionedNode } from "./relationshipDiagramUtils";
import { NODE_WIDTH, NODE_HEIGHT } from "./relationshipDiagramUtils";
import { kindStroke } from "./diagramStyles";

type DiagramNodeProps = {
  node: PositionedNode;
  isSelected: boolean;
  isHovered: boolean;
  isActiveFlowNode: boolean;
  onNodeClick: (id: string) => void;
  onNodeMouseEnter: (id: string) => void;
  onNodeMouseLeave: (id: string) => void;
};

export function DiagramNode({
  node,
  isSelected,
  isHovered,
  isActiveFlowNode,
  onNodeClick,
  onNodeMouseEnter,
  onNodeMouseLeave,
}: DiagramNodeProps) {
  return (
    <g
      key={node.id}
      onClick={() => onNodeClick(node.id)}
      onMouseEnter={() => onNodeMouseEnter(node.id)}
      onMouseLeave={() => onNodeMouseLeave(node.id)}
      className="cursor-pointer"
    >
      <rect
        x={node.x}
        y={node.y}
        width={NODE_WIDTH}
        height={NODE_HEIGHT}
        rx="10"
        fill={
          isSelected || isHovered || isActiveFlowNode ? "#0b1220" : "#0f172a"
        }
        stroke={isActiveFlowNode ? "#fde047" : kindStroke[node.kind]}
        strokeWidth={isSelected ? 3 : isActiveFlowNode ? 2.5 : 1.5}
        opacity={isSelected || isHovered || isActiveFlowNode ? 1 : 0.9}
      />
      <text
        x={node.x + 12}
        y={node.y + 24}
        fill="#f8fafc"
        fontSize="13"
        fontWeight="700"
      >
        {node.label}
      </text>
      <text
        x={node.x + 12}
        y={node.y + 40}
        fill="#94a3b8"
        fontSize="11"
      >
        {node.file}
      </text>
    </g>
  );
}
