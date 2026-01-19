import { usePRD } from '../../context/PRDContext';
import { useRef, useCallback } from 'react';

// Editable field component
function EditableField({ value, field, placeholder, as: Component = 'p', className = '' }) {
  const { updateField } = usePRD();
  const ref = useRef(null);

  const handleBlur = useCallback((e) => {
    const newValue = e.target.innerText;
    if (newValue !== value) {
      updateField(field, newValue);
    }
  }, [field, value, updateField]);

  const handleKeyDown = useCallback((e) => {
    // Prevent Enter from creating new lines in title
    if (field === 'title' && e.key === 'Enter') {
      e.preventDefault();
      ref.current?.blur();
    }
  }, [field]);

  return (
    <Component
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      data-placeholder={placeholder}
      className={`outline-none focus:bg-blue-50 focus:ring-2 focus:ring-blue-200 rounded px-1 -mx-1 transition-colors ${className} ${
        !value ? 'empty-placeholder' : ''
      }`}
      dangerouslySetInnerHTML={{ __html: value || '' }}
    />
  );
}

// Section header component
function SectionHeader({ title }) {
  return (
    <h2 className="text-lg font-semibold mb-3 pb-2 border-b flex items-center gap-2">
      {title}
      <span className="text-xs font-normal text-muted">(click to edit)</span>
    </h2>
  );
}

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
      {/* Edit Mode Indicator */}
      <div className="sticky top-0 z-10 bg-blue-50 border-b border-blue-200 px-4 py-2 flex items-center gap-2 text-sm text-blue-700">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
        <span>WYSIWYG Mode - Click any text to edit directly</span>
      </div>

      {/* PDF-like Document */}
      <div className="p-8">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Document Content */}
          <div className="p-12">
            {/* Title */}
            <EditableField
              value={currentPRD.title}
              field="title"
              placeholder="Click to add title..."
              as="h1"
              className="text-3xl font-bold mb-2"
            />
            <div className="text-sm text-muted mb-8">
              Product Requirements Document
            </div>

            {/* Objective */}
            <section className="mb-8">
              <SectionHeader title="Objective" />
              <EditableField
                value={currentPRD.objective}
                field="objective"
                placeholder="Click to add objective..."
                className="text-sm leading-relaxed whitespace-pre-wrap min-h-[24px]"
              />
            </section>

            {/* Description */}
            <section className="mb-8">
              <SectionHeader title="Description" />
              <EditableField
                value={currentPRD.description}
                field="description"
                placeholder="Click to add description..."
                className="text-sm leading-relaxed whitespace-pre-wrap min-h-[24px]"
              />
            </section>

            {/* Functional Requirements */}
            <section className="mb-8">
              <SectionHeader title="Functional Requirements" />
              <EditableField
                value={currentPRD.functionalRequirements}
                field="functionalRequirements"
                placeholder="Click to add functional requirements..."
                className="text-sm leading-relaxed whitespace-pre-wrap min-h-[24px]"
              />
            </section>

            {/* Non-Functional Requirements */}
            <section className="mb-8">
              <SectionHeader title="Non-Functional Requirements" />
              <EditableField
                value={currentPRD.nonFunctionalRequirements}
                field="nonFunctionalRequirements"
                placeholder="Click to add non-functional requirements..."
                className="text-sm leading-relaxed whitespace-pre-wrap min-h-[24px]"
              />
            </section>

            {/* Dependencies */}
            <section className="mb-8">
              <SectionHeader title="Dependencies" />
              <EditableField
                value={currentPRD.dependencies}
                field="dependencies"
                placeholder="Click to add dependencies..."
                className="text-sm leading-relaxed whitespace-pre-wrap min-h-[24px]"
              />
            </section>

            {/* Acceptance Criteria */}
            <section className="mb-8">
              <SectionHeader title="Acceptance Criteria" />
              <EditableField
                value={currentPRD.acceptanceCriteria}
                field="acceptanceCriteria"
                placeholder="Click to add acceptance criteria..."
                className="text-sm leading-relaxed whitespace-pre-wrap min-h-[24px]"
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
