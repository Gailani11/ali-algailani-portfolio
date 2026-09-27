/**
 * "Opens elsewhere" mark — a square with an arrow leaving its corner — drawn as a line
 * icon in the current text colour. Used beside WhatsApp and PDF links instead of the ↗
 * character, which phones render as a coloured emoji.
 */
export function ExtIcon() {
  return (
    <svg className="ext-icon" viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" focusable="false">
      <path
        d="M10.5 5.5H6A1.5 1.5 0 0 0 4.5 7v11A1.5 1.5 0 0 0 6 19.5h11a1.5 1.5 0 0 0 1.5-1.5v-4.5M14 4.5h5.5V10M19.5 4.5l-9 9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
