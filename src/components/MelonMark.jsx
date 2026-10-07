// The site's one big visual idea, turned up: a full-color watermelon slice.
export default function MelonMark({ className = '', rotate = true }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={`${className} ${rotate ? '-rotate-6' : ''}`}
      aria-hidden="true"
    >
      <path d="M100 6 A94 94 0 0 1 100 194 A94 94 0 0 1 100 6 Z" fill="#15803D" />
      <path d="M100 20 A80 80 0 0 1 100 180 A80 80 0 0 1 100 20 Z" fill="#15803D" />
      <path d="M100 34 A66 66 0 0 1 100 166 A66 66 0 0 1 100 34 Z" fill="#FFF8EC" />
      <path d="M100 46 A54 54 0 0 1 100 154 A54 54 0 0 1 100 46 Z" fill="#FF4D6D" />
      <g fill="#14110D">
        <ellipse cx="116" cy="72" rx="3.4" ry="6" transform="rotate(25 116 72)" />
        <ellipse cx="128" cy="100" rx="3.4" ry="6" transform="rotate(0 128 100)" />
        <ellipse cx="116" cy="128" rx="3.4" ry="6" transform="rotate(-25 116 128)" />
        <ellipse cx="94" cy="100" rx="3.4" ry="6" transform="rotate(0 94 100)" />
      </g>
    </svg>
  );
}
