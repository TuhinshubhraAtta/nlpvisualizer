import type { PositionedNode } from "./relationshipDiagramUtils";
import { kindStyles } from "./diagramStyles";
import type { DiagramNode } from "./relationshipDiagramData";

type DiagramUIProps = {
  setZoom: (value: (prev: number) => number) => void;
  selectedNode: PositionedNode;
  activeStep: { name: string; input: any; output: any } | null;
};

export function DiagramUI({
  setZoom,
  selectedNode,
  activeStep,
}: DiagramUIProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
      {/* This part was missing, it renders the header and sidebar */}
      <DiagramHeader setZoom={setZoom} />
      <Sidebar selectedNode={selectedNode} activeStep={activeStep} />
    </div>
  );
}

function DiagramHeader({
  setZoom,
}: {
  setZoom: (value: (prev: number) => number) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-cyan-300">
            Interactive Relationship Diagram
          </h2>
          <p className="text-sm text-slate-300">
            Hover for details, click a node to inspect it, and use the zoom
            controls to explore the graph.
          </p>
        </div>
        <ZoomControls setZoom={setZoom} />
      </div>
    </div>
  );
}

function ZoomControls({
  setZoom,
}: {
  setZoom: (value: (prev: number) => number) => void;
}) {
  const zoomIn = () =>
    setZoom((v) => Math.min(1.8, Number((v + 0.15).toFixed(2))));
  const zoomOut = () =>
    setZoom((v) => Math.max(0.8, Number((v - 0.15).toFixed(2))));
  const resetZoom = () => setZoom(() => 1);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={zoomOut}
        className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:border-cyan-400"
      >
        −
      </button>
      <button
        onClick={zoomIn}
        className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:border-cyan-400"
      >
        +
      </button>
      <button
        onClick={resetZoom}
        className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:border-cyan-400"
      >
        Reset
      </button>
    </div>
  );
}

function Sidebar({
  selectedNode,
  activeStep,
}: {
  selectedNode: PositionedNode;
  activeStep: { name: string; input: any; output: any } | null;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
      <SelectedNodeInfo selectedNode={selectedNode} />
      <LiveDataFlow activeStep={activeStep} />
      <InteractionTips />
      <Legend />
    </div>
  );
}

function SelectedNodeInfo({ selectedNode }: { selectedNode: PositionedNode }) {
  return (
    <>
      <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
        Selected Node
      </div>
      <div className={`rounded-xl border p-3 ${kindStyles[selectedNode.kind]}`}>
        <div className="font-semibold">{selectedNode.label}</div>
        <div className="mt-1 text-xs opacity-80">{selectedNode.file}</div>
        <div className="mt-3 text-sm leading-6 opacity-90">
          {selectedNode.description}
        </div>
      </div>
    </>
  );
}

function LiveDataFlow({
  activeStep,
}: {
  activeStep: { name: string; input: any; output: any } | null;
}) {
  const formatData = (data: any) =>
    typeof data === "string" ? data : JSON.stringify(data, null, 2);
  return (
    <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-300">
      <div className="font-semibold text-cyan-300">Live data flow</div>
      <div className="mt-2 text-xs text-slate-400">
        {activeStep ? (
          <div className="space-y-2">
            <div>
              <span className="font-semibold text-cyan-200">Current step:</span>{" "}
              {activeStep.name}
            </div>
            <div>
              <span className="font-semibold text-cyan-200">Input:</span>{" "}
              {formatData(activeStep.input)}
            </div>
            <div>
              <span className="font-semibold text-cyan-200">Output:</span>{" "}
              {formatData(activeStep.output)}
            </div>
          </div>
        ) : (
          "Run the pipeline to populate the live data flow view."
        )}
      </div>
    </div>
  );
}

function InteractionTips() {
  return (
    <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-300">
      <div className="font-semibold text-cyan-300">Interaction tips</div>
      <ul className="mt-2 space-y-1 text-xs text-slate-300">
        <li>• Hover any node to preview its description.</li>
        <li>• Click a node to pin it and open the detailed code popup.</li>
        <li>• Drag the canvas to pan around the graph.</li>
        <li>• Use the zoom buttons to inspect the graph in more detail.</li>
      </ul>
    </div>
  );
}

function Legend() {
  const kinds = Object.keys(kindStyles) as Array<DiagramNode["kind"]>;
  return (
    <div className="mt-4">
      <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
        Legend
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-300">
        {kinds.map((kind) => (
          <div key={kind} className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-sm border ${kindStyles[kind]}`} />
            <span className="text-xs capitalize">{kind}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
