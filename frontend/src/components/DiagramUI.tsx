
import type { PositionedNode } from "./relationshipDiagramUtils";
import { kindStyles } from "./diagramStyles";

type DiagramUIProps = {
  setZoom: (value: (prev: number) => number) => void;
  selectedNode: PositionedNode;
  activeStep: any;
  positionedNodes: PositionedNode[];
};

export function DiagramUI({
  setZoom,
  selectedNode,
  activeStep,
  positionedNodes,
}: DiagramUIProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
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

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setZoom((value) =>
                  Math.max(0.8, Number((value - 0.15).toFixed(2)))
                )
              }
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:border-cyan-400"
            >
              −
            </button>
            <button
              onClick={() =>
                setZoom((value) =>
                  Math.min(1.8, Number((value + 0.15).toFixed(2)))
                )
              }
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:border-cyan-400"
            >
              +
            </button>
            <button
              onClick={() => setZoom(() => 1)}
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:border-cyan-400"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Selected Node
        </div>

        <div
          className={`rounded-xl border p-3 ${
            kindStyles[selectedNode.kind]
          }`}
        >
          <div className="font-semibold">{selectedNode.label}</div>
          <div className="mt-1 text-xs opacity-80">{selectedNode.file}</div>
          <div className="mt-3 text-sm leading-6 opacity-90">
            {selectedNode.description}
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-300">
          <div className="font-semibold text-cyan-300">Live data flow</div>
          <div className="mt-2 text-xs text-slate-400">
            {activeStep ? (
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-cyan-200">
                    Current step:
                  </span>{" "}
                  {activeStep.name}
                </div>
                <div>
                  <span className="font-semibold text-cyan-200">
                    Input:
                  </span>{" "}
                  {typeof activeStep.input === "string"
                    ? activeStep.input
                    : JSON.stringify(activeStep.input, null, 2)}
                </div>
                <div>
                  <span className="font-semibold text-cyan-200">
                    Output:
                  </span>{" "}
                  {typeof activeStep.output === "string"
                    ? activeStep.output
                    : JSON.stringify(activeStep.output, null, 2)}
                </div>
              </div>
            ) : (
              "Run the pipeline to populate the live data flow view."
            )}
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-300">
          <div className="font-semibold text-cyan-300">
            Interaction tips
          </div>
          <ul className="mt-2 space-y-1 text-xs text-slate-300">
            <li>• Hover any node to preview its description.</li>
            <li>
              • Click a node to pin it and open the detailed code popup.
            </li>
            <li>• Drag the canvas to pan around the graph.</li>
            <li>
              • Use the zoom buttons to inspect the graph in more detail.
            </li>
          </ul>
        </div>

        <div className="mt-4">
          <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Legend
          </div>
          <div className="space-y-3 text-sm text-slate-300">
            {positionedNodes.map((node) => (
              <div
                key={`${node.id}-legend`}
                className={`rounded-xl border p-3 ${kindStyles[node.kind]}`}
              >
                <div className="font-semibold">{node.label}</div>
                <div className="mt-1 text-xs opacity-80">
                  {node.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
