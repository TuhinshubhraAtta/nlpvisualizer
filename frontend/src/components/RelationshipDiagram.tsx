
import { useMemo, useState } from "react";
import { nodes, edges, codeMap } from "./relationshipDiagramData";
import { buildAutoLayout } from "./relationshipDiagramUtils";
import { useDiagramInteraction } from "./useDiagramInteraction";
import { DiagramCanvas } from "./DiagramCanvas";
import { DiagramUI } from "./DiagramUI";
import { CodeModal } from "./CodeModal";

type PipelineStepSnapshot = {
  name: string;
  description: string;
  code: string;
  input: string | string[] | object;
  output: string | string[] | object;
  explanation: string;
};

type RelationshipDiagramProps = {
  steps: PipelineStepSnapshot[];
  currentIndex: number;
};

export function RelationshipDiagram({
  steps,
  currentIndex,
}: RelationshipDiagramProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(
    "pipeline-run"
  );
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [modalNodeId, setModalNodeId] = useState<string | null>(null);

  const {
    zoom,
    pan,
    setZoom,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = useDiagramInteraction();

  const { positionedNodes, graphWidth, graphHeight } = useMemo(
    () => buildAutoLayout(nodes, edges),
    []
  );

  const selectedNode = useMemo(
    () =>
      positionedNodes.find(
        (node) => node.id === (hoveredNodeId ?? selectedNodeId)
      ) ?? positionedNodes[0],
    [hoveredNodeId, positionedNodes, selectedNodeId]
  );

  const activeStep = steps[currentIndex] ?? null;

  const modalStep = useMemo(() => {
    if (!modalNodeId) return null;

    const stepName = codeMap[modalNodeId];
    return steps.find((step) => step.name === stepName) ?? null;
  }, [modalNodeId, steps]);

  const handleNodeClick = (id: string) => {
    setSelectedNodeId(id);
    setModalNodeId(id);
  };

  return (
    <div>
      <DiagramUI
        setZoom={setZoom}
        selectedNode={selectedNode}
        activeStep={activeStep}
        positionedNodes={positionedNodes}
      />
      <DiagramCanvas
        positionedNodes={positionedNodes}
        edges={edges}
        graphWidth={graphWidth}
        graphHeight={graphHeight}
        pan={pan}
        zoom={zoom}
        selectedNodeId={selectedNodeId}
        hoveredNodeId={hoveredNodeId}
        activeStep={activeStep}
        codeMap={codeMap}
        handlePointerDown={handlePointerDown}
        handlePointerMove={handlePointerMove}
        handlePointerUp={handlePointerUp}
        onNodeClick={handleNodeClick}
        onNodeMouseEnter={setHoveredNodeId}
        onNodeMouseLeave={() => setHoveredNodeId(null)}
      />
      {modalStep ? (
        <CodeModal modalStep={modalStep} onClose={() => setModalNodeId(null)} />
      ) : null}
    </div>
  );
}
