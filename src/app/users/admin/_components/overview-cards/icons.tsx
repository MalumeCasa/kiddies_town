import type { SVGProps } from "react";

type SVGPropsType = SVGProps<SVGSVGElement>;

export function Students(props: SVGPropsType) {
  return (
    <svg width={58} height={58} viewBox="0 0 58 58" fill="none" {...props}>
      <circle cx={29} cy={29} r={29} fill="#18BFFF" />
      <path
        d="M29 34.083c3.833 0 7-3.167 7-7s-3.167-7-7-7-7 3.167-7 7 3.167 7 7 7z"
        fill="#fff"
      />
      <path
        d="M36.167 36.167h-14.5c-1.917 0-3.5 1.583-3.5 3.5v.583c0 .584.466 1.083 1.05 1.083h19.3c.584 0 1.05-.5 1.05-1.083v-.583c0-1.917-1.583-3.5-3.5-3.5z"
        fill="#fff"
      />
    </svg>
  );
}

export function Teachers(props: SVGPropsType) {
  return (
    <svg width={58} height={58} viewBox="0 0 58 58" fill="none" {...props}>
      <circle cx={29} cy={29} r={29} fill="#FF9C55" />
      <path
        d="M35.5 25.5c0 3.038-2.462 5.5-5.5 5.5s-5.5-2.462-5.5-5.5 2.462-5.5 5.5-5.5 5.5 2.462 5.5 5.5z"
        fill="#fff"
      />
      <path
        d="M24.5 31.5c-2.5 0-4.5 2-4.5 4.5v1.5c0 .828.672 1.5 1.5 1.5h12c.828 0 1.5-.672 1.5-1.5V36c0-2.5-2-4.5-4.5-4.5h-6z"
        fill="#fff"
      />
      <path
        d="M36 28l4-2v6l-4 2"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Classes(props: SVGPropsType) {
  return (
    <svg width={58} height={58} viewBox="0 0 58 58" fill="none" {...props}>
      <circle cx={29} cy={29} r={29} fill="#8155FF" />
      <rect x="20" y="22" width="18" height="14" rx="2" fill="#fff" />
      <path d="M20 24h18M20 28h12M20 32h15" stroke="#8155FF" strokeWidth="2" />
      <circle cx="25" cy="26" r="1" fill="#8155FF" />
    </svg>
  );
}

export function Attendance(props: SVGPropsType) {
  return (
    <svg width={58} height={58} viewBox="0 0 58 58" fill="none" {...props}>
      <circle cx={29} cy={29} r={29} fill="#3FD97F" />
      <path
        d="M29 39c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10z"
        stroke="#fff"
        strokeWidth="2"
      />
      <path
        d="M29 25v6l4 2"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M25 34h8M27 36h4"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}