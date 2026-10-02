// A local illustration: no map API, location access, or live courier data.
export function OrderTrackingMap() {
  return (
    <svg viewBox="0 0 412 278" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustrated sample map of the Tampere area. This is not live tracking." className="absolute inset-0 h-full w-full">
      <rect width="412" height="278" fill="#eaf1e8" />
      <path d="M0 0h412v69l-35 9-14-12-26 19-22-6-30 15-21-10-22 19-34-5-18-26-33 2-14-23-30 11-11-30-22 9-8-26-29 12L0 16Z" fill="#95dbe7" />
      <path d="M218 78c-19 19 5 30-8 48s-14 27-11 40c4 21-11 32-22 47l13 17c20-19 33-42 27-65s3-26 8-42-1-30 12-42Z" fill="#95dbe7" />
      <path d="m0 219 49-15 30 17 33-8 29 21 47-8 21 24 34-5 15 33H0Z" fill="#95dbe7" />
      <g fill="#c8e9c7"><path d="m291 100 40-18 40 12 41-8v48l-56 6-37-18-25 7Z" /><path d="m8 44 28-10 17 43-22 23L0 86Z" /><path d="m264 173 35-15 30 15 34-10 28 31-11 28-46-8-25 21-50-24Z" /></g>
      <g fill="#dce2df"><path d="m54 97 36-11 7 21-32 13ZM110 91l29-5 9 26-31 7ZM69 139l38-10 6 24-35 10ZM124 132l28-7 10 28-30 9ZM49 181l55-18 6 21-50 18ZM244 111l34-10 8 26-30 10ZM290 130l28-4 8 21-29 9ZM241 152l29-9 6 22-31 12Z" /></g>
      <g fill="none" stroke="#fff" strokeWidth="7"><path d="M-20 132 432 76M-15 190l450-76M19-10l83 298M93-10l88 298M270-10l-15 298M336 10l42 280M0 220l412-65" /><path d="m-10 71 165 80 138 69 119-5M141 0l18 94 79 74 35 110" strokeWidth="4" /></g>
      <path d="M-10 172c71-1 117-22 166-24s119 5 147-19 87-23 120-18" fill="none" stroke="#e7cfa5" strokeWidth="9" />
      <path d="M-10 172c71-1 117-22 166-24s119 5 147-19 87-23 120-18" fill="none" stroke="#fff7d5" strokeWidth="5" />
      <path d="m220 147 42-3 38-17 19-3" fill="none" stroke="#941696" strokeWidth="3" strokeDasharray="5 5" />
      <g fontFamily="Arial, sans-serif" fill="#657a78" fontSize="8"><text x="49" y="73">SANTALAHTI</text><text x="276" y="62" fill="#5a9caa">Näsijärvi</text><text x="60" y="245" fill="#5a9caa">Pyhäjärvi</text><text x="277" y="188">TAMMELA</text></g>
      <text x="157" y="143" fontFamily="Arial, sans-serif" fontSize="17" fill="#34434a" fontWeight="600" paintOrder="stroke" stroke="#fff" strokeWidth="3">Tampere</text>
      <circle cx="218" cy="157" r="12" fill="#941696" fillOpacity=".15" /><circle cx="218" cy="157" r="5" fill="#941696" stroke="#fff" strokeWidth="2" />
      <path d="M328 115c0 9-10 18-10 18s-10-9-10-18a10 10 0 1 1 20 0" fill="#f88121" stroke="#fff" strokeWidth="2" /><circle cx="318" cy="114" r="3" fill="#fff" />
    </svg>
  );
}
