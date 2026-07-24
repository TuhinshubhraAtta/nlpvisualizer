import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Code2,
  Download,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Wand2,
} from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { RelationshipDiagram } from "./components/RelationshipDiagram";

type PipelineStep = {
  name: string;
  description: string;
  code: string;
  input: string | string[] | object;
  output: string | string[] | object;
  explanation: string;
};

const initialText = "Hey!!! 😊 I'm Learning NLP in 2026. It's AMAZING!!!";

export default function App() {
  const [text, setText] = useState(initialText);
  const [steps, setSteps] = useState<PipelineStep[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [hasSuccessfulRun, setHasSuccessfulRun] = useState(false);

  const currentStep = steps[currentIndex];

  useEffect(() => {
    if (!autoPlay || steps.length === 0) return;

    if (currentIndex >= steps.length - 1) {
      setAutoPlay(false);
      return;
    }

    const timeout = window.setTimeout(() => {
      setCurrentIndex((index) => Math.min(index + 1, steps.length - 1));
    }, 1400 / speed);

    return () => window.clearTimeout(timeout);
  }, [autoPlay, currentIndex, speed, steps.length]);

  const runPipeline = async () => {
    setLoading(true);

    const candidates = [
      "http://127.0.0.1:8000/preprocess",
      "http://127.0.0.1:8001/preprocess",
    ];
    let lastError: Error | null = null;

    for (const endpoint of candidates) {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        setSteps(data.steps);
        setCurrentIndex(0);
        setHasSuccessfulRun(true);
        setLoading(false);
        return;
      } catch (error) {
        lastError = error as Error;
        setHasSuccessfulRun(false);
      }
    }

    setLoading(false);
    console.error(lastError);
  };

  const formatStepValue = (value: string | string[] | object | undefined) => {
    if (!value) return "Run the pipeline to inspect each NLP transformation.";
    return typeof value === "string" ? value : JSON.stringify(value, null, 2);
  };

  const panelValue = useMemo(
    () => formatStepValue(currentStep?.output),
    [currentStep],
  );
  const finalOutput = useMemo(
    () => formatStepValue(steps[steps.length - 1]?.output),
    [steps],
  );

  const exportJson = () => {
    const payload = JSON.stringify({ text, steps }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "nlp-pipeline-output.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="mb-6 rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-5 shadow-2xl shadow-cyan-950/30">
          <h1 className="text-3xl font-bold tracking-tight text-cyan-300">
            NLP Preprocessing Visualizer
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            A Chrome DevTools-inspired walkthrough for NLP pipeline
            transformations.
          </p>
        </header>

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Raw Input
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-32 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-slate-100 outline-none ring-0"
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={runPipeline}
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400"
              >
                <Play size={16} />
                {loading ? "Running..." : "Run Pipeline"}
              </button>
              <button
                onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2"
              >
                <SkipBack size={16} /> Previous
              </button>
              <button
                onClick={() =>
                  setCurrentIndex((i) => Math.min(i + 1, steps.length - 1))
                }
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2"
              >
                <SkipForward size={16} /> Next
              </button>
              <button
                onClick={() => setAutoPlay((value) => !value)}
                className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 px-4 py-2"
              >
                {autoPlay ? <Pause size={16} /> : <Play size={16} />}
                {autoPlay ? "Pause" : "Autoplay"}
              </button>
              <button
                onClick={exportJson}
                className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 px-4 py-2"
              >
                <Download size={16} /> JSON Export
              </button>
              <label className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm">
                Speed
                <select
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="rounded bg-slate-950 px-2 py-1"
                >
                  <option value={0.75}>0.75x</option>
                  <option value={1}>1x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2x</option>
                </select>
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm text-slate-300">
              <Wand2 size={16} /> Execution Timeline
            </div>
            <div className="space-y-2">
              {steps.map((step, index) => {
                const isCompleted = hasSuccessfulRun && index < currentIndex;
                const isCurrent = hasSuccessfulRun && index === currentIndex;
                const isPending = !hasSuccessfulRun || index > currentIndex;

                const statusClasses = isCompleted
                  ? "border-emerald-400 bg-emerald-500/10 text-emerald-100"
                  : isCurrent
                    ? "border-cyan-400 bg-cyan-500/10 text-cyan-100"
                    : "border-slate-800 bg-slate-950/70 text-slate-300";

                const statusLabel = isCompleted
                  ? "completed"
                  : isCurrent
                    ? "active"
                    : "pending";

                return (
                  <motion.div
                    key={`${step.name}-${index}`}
                    animate={{
                      scale: isCurrent ? 1.02 : 1,
                      opacity: isCurrent ? 1 : 0.8,
                    }}
                    className={`rounded-lg border px-3 py-2 ${statusClasses}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium">{step.name}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
                          isCompleted
                            ? "bg-emerald-500/20 text-emerald-200"
                            : isCurrent
                              ? "bg-cyan-500/20 text-cyan-200"
                              : "bg-slate-700/70 text-slate-300"
                        }`}
                      >
                        {statusLabel}
                      </span>
                    </div>
                    <div className="mt-1 text-xs opacity-80">
                      {isPending
                        ? "Waiting for execution result"
                        : isCurrent
                          ? "Currently visible in the inspector"
                          : "Succeeded in the last run"}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm text-slate-300">
              <Code2 size={16} /> Current Output
            </div>
            <div className="rounded-xl bg-slate-950 p-4 text-sm text-cyan-100">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentStep?.name ?? "empty"}-${currentIndex}`}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="whitespace-pre-wrap"
                >
                  {panelValue}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-sm text-slate-200">
              <div className="font-semibold text-cyan-300">Final Output</div>
              <div className="mt-2 whitespace-pre-wrap">{finalOutput}</div>
            </div>

            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
              <div className="font-semibold text-cyan-300">Explanation</div>
              <div className="mt-2">
                {currentStep?.explanation ??
                  "Select a step to inspect the transformation."}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <div className="mb-3 text-sm font-medium text-slate-300">
              Code Being Executed
            </div>
            <div className="rounded-xl overflow-hidden border border-slate-700">
              <SyntaxHighlighter
                language="python"
                style={oneDark}
                customStyle={{ margin: 0, background: "#020617" }}
              >
                {currentStep?.code ?? "def preprocess(text):\n    return text"}
              </SyntaxHighlighter>
            </div>
          </section>
        </div>

        <div className="mt-6">
          <RelationshipDiagram steps={steps} currentIndex={currentIndex} />
        </div>
      </div>
    </div>
  );
}
