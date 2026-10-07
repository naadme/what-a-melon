// Two stacked arrows: on button hover the first exits right while the
// second slides in from the left (CSS in index.css).
export default function Arrow() {
  const svg = (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
  return (
    <span aria-hidden="true" className="btn-arrow">
      <span>{svg}</span>
      <span>{svg}</span>
    </span>
  );
}
