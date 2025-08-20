//
//  ArticleEditWarningDialog.tsx
//  ChiEAC
//
//  Warning dialog shown before editing articles
//  Created by Shivaang Kumar on 8/18/25.
//

interface ArticleEditWarningDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ArticleEditWarningDialog({
  isOpen,
  onConfirm,
  onCancel
}: ArticleEditWarningDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 border border-slate-700/60 rounded-xl shadow-2xl w-full max-w-md mx-4">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-amber-600/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-100">
                Edit Article Warning
              </h3>
              <p className="text-sm text-slate-400">
                Please read before proceeding
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="mb-6">
            <p className="text-slate-300 mb-3">
              Articles are fetched automatically from Medium RSS feed and may be overwritten during the next sync.
            </p>
            <p className="text-sm text-slate-400">
              Manual edits should be used sparingly and only when necessary. Consider updating the source article on Medium instead.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg shadow-amber-600/25"
            >
              Continue Editing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
