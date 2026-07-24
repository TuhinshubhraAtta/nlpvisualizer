
type ModalStep = {
  name: string;
  description: string;
  code: string;
  explanation: string;
};

type CodeModalProps = {
  modalStep: ModalStep;
  onClose: () => void;
};

export function CodeModal({ modalStep, onClose }: CodeModalProps) {
  if (!modalStep) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
      <div className="w-full max-w-3xl rounded-2xl border border-cyan-500/30 bg-slate-900 p-4 shadow-2xl shadow-cyan-950/30">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <div className="text-lg font-semibold text-cyan-300">
              {modalStep.name}
            </div>
            <div className="text-sm text-slate-300">
              {modalStep.description}
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-200"
          >
            Close
          </button>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm text-slate-100">
          <pre className="overflow-x-auto whitespace-pre-wrap">
            {modalStep.code}
          </pre>
        </div>

        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-300">
          <div className="font-semibold text-cyan-300">Explanation</div>
          <div className="mt-1">{modalStep.explanation}</div>
        </div>
      </div>
    </div>
  );
}
