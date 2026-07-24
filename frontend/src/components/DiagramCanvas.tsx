
import type { PointerEvent as ReactPointerEvent } from "react";
import type { DiagramEdge as Edge, DiagramNode as Node } from "./relationshipDiagramData";
import type { PositionedNode } from "./relationshipDiagramUtils";

import { DiagramNode } from "./DiagramNode";
import { DiagramEdge } from "./DiagramEdge";

type DiagramCanvasProps = {
  positionedNodes: PositionedNode[];
  edges: Edge[];
  graphWidth: number;
  graphHeight: number;
  pan: { x: number; y: number };
  zoom: number;
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  activeStep: any;
  codeMap: Record<string, string>;
  handlePointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
  handlePointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void;
  handlePointerUp: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onNodeClick: (id: string) => void;
  onNodeMouseEnter: (id: string) => void;
  onNodeMouseLeave: (id: string) => void;
};

export function DiagramCanvas({
  positionedNodes,
  edges,
  graphWidth,
  graphHeight,
  pan,
  zoom,
  selectedNodeId,
  hoveredNodeId,
  activeStep,
  codeMap,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
  onNodeClick,
  onNodeMouseEnter,
  onNodeMouseLeave,
}: DiagramCanvasProps) {
  return (
    <div
      className="overflow-auto rounded-xl border border-slate-800 bg-slate-950/50 p-2"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <svg
        viewBox={`0 0 ${graphWidth} ${graphHeight}`}
        className="min-w-[900px] cursor-grab"
      >
        <defs>
          <marker
            id="arrow"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#67e8f9" />
          </marker>
        </defs>

        <g
          transform={`translate(${pan.x + (1 - zoom) * graphWidth * 0.5} ${
            pan.y + (1 - zoom) * graphHeight * 0.5
          }) scale(${zoom})`}
          style={{ transformOrigin: "center center" }}
        >
          {edges.map((edge) => {
            const source = positionedNodes.find(
              (node) => node.id === edge.from
            );
            const target = positionedNodes.find(
              (node) => node.id === edge.to
            );

            if (!source || !target) {
              return null;
            }

            return (
              <DiagramEdge
                key={`${edge.from}-${edge.to}`}
                edge={edge}
                source={source}
                target={target}
              />
            );
          })}

          {positionedNodes.map((node) => {
            const isSelected = node.id === selectedNodeId;
            const isHovered = node.id === hoveredNodeId;
            const isActiveFlowNode =
              activeStep && codeMap[node.id] === activeStep.name;

            return (
              <DiagramNode
                key={node.id}
                node={node}
                isSelected={isSelected}
                isHovered={isHovered}
                isActiveFlowNode={isActiveFlowNode}
                onNodeClick={onNodeClick}
                onNodeMouseEnter={onNodeMouseEnter}
                onNodeMouseLeave={onNodeMouseLeave}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}
