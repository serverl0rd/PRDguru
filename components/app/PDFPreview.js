import { usePRD } from '../../context/PRDContext';

export default function PDFPreview() {
  const { currentPRD } = usePRD();

  const hasContent = currentPRD.title || currentPRD.objective || currentPRD.description;

  if (!hasContent) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 rounded-full bg-[var(--muted)] flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <h3 className="font-semibold mb-2">No PRD Selected</h3>
          <p className="text-sm text-muted">
            Start a conversation in the chat to create a new PRD, or select an existing one from the sidebar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto scroll-area bg-[var(--muted)]">
      {/* PDF-like Document */}
      <div className="p-8">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Document Content */}
          <div className="p-12">
            {/* Title */}
            <h1 className="text-3xl font-bold mb-2">
              {currentPRD.title || 'Untitled PRD'}
            </h1>
            <div className="text-sm text-muted mb-8">
              Product Requirements Document
            </div>

            {/* Objective */}
            {currentPRD.objective && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold mb-3 pb-2 border-b">Objective</h2>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {currentPRD.objective}
                </p>
              </section>
            )}

            {/* Description */}
            {currentPRD.description && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold mb-3 pb-2 border-b">Description</h2>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {currentPRD.description}
                </p>
              </section>
            )}

            {/* Functional Requirements */}
            {currentPRD.functionalRequirements && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold mb-3 pb-2 border-b">Functional Requirements</h2>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {currentPRD.functionalRequirements}
                </p>
              </section>
            )}

            {/* Non-Functional Requirements */}
            {currentPRD.nonFunctionalRequirements && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold mb-3 pb-2 border-b">Non-Functional Requirements</h2>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {currentPRD.nonFunctionalRequirements}
                </p>
              </section>
            )}

            {/* Dependencies */}
            {currentPRD.dependencies && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold mb-3 pb-2 border-b">Dependencies</h2>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {currentPRD.dependencies}
                </p>
              </section>
            )}

            {/* Acceptance Criteria */}
            {currentPRD.acceptanceCriteria && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold mb-3 pb-2 border-b">Acceptance Criteria</h2>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {currentPRD.acceptanceCriteria}
                </p>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
