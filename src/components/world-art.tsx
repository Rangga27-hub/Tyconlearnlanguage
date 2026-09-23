export function WorldArt({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 620 540" fill="none" role="img" aria-label="A colorful floating island with a winding path, a little house, and friendly creatures">
      <defs>
        <linearGradient id="islandTop" x1="85" y1="223" x2="536" y2="421" gradientUnits="userSpaceOnUse"><stop stopColor="#BCE8BB"/><stop offset=".52" stopColor="#8DCFAD"/><stop offset="1" stopColor="#5CBCA6"/></linearGradient>
        <linearGradient id="islandSide" x1="150" y1="325" x2="435" y2="520" gradientUnits="userSpaceOnUse"><stop stopColor="#547B9B"/><stop offset="1" stopColor="#36436E"/></linearGradient>
        <linearGradient id="house" x1="254" y1="136" x2="377" y2="294" gradientUnits="userSpaceOnUse"><stop stopColor="#FFE8AC"/><stop offset="1" stopColor="#F8A978"/></linearGradient>
        <linearGradient id="roof" x1="242" y1="113" x2="391" y2="206" gradientUnits="userSpaceOnUse"><stop stopColor="#FB968E"/><stop offset="1" stopColor="#DB688D"/></linearGradient>
        <filter id="shadow" x="46" y="252" width="545" height="290" filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation="22"/></filter>
      </defs>
      <ellipse cx="321" cy="456" rx="215" ry="47" fill="#121630" opacity=".35" filter="url(#shadow)"/>
      <path d="M100 289 300 185c19-10 42-10 62 0l178 95c22 12 22 34-1 47L354 436c-20 12-45 12-65 1L99 330c-24-13-24-28 1-41Z" fill="#638FA4"/>
      <path d="m82 309 19 58 194 115c18 10 39 11 57 1l187-111 18-61-218 106-257-108Z" fill="url(#islandSide)"/>
      <path d="M100 268 299 161c20-10 44-10 64 1l179 102c25 14 24 34-1 48L353 421c-21 12-45 12-66 0L100 314c-25-15-26-32 0-46Z" fill="url(#islandTop)" stroke="#C5F3C7" strokeWidth="4"/>
      <path d="M101 299c63 9 119 67 194 101 20 9 42 10 58 1l183-107" stroke="#E2F7D5" strokeWidth="5" opacity=".35"/>
      {/* winding trail */}
      <path d="M167 335c36-37 68-15 92-31 27-18 5-35 30-46 25-10 68 3 85-25 12-19 39-22 63-18" stroke="#C09073" strokeWidth="44" strokeLinecap="round" strokeLinejoin="round" opacity=".25"/>
      <path d="M167 331c36-37 68-15 92-31 27-18 5-35 30-46 25-10 68 3 85-25 12-19 39-22 63-18" stroke="#FFF0CB" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M167 331c36-37 68-15 92-31 27-18 5-35 30-46 25-10 68 3 85-25 12-19 39-22 63-18" stroke="#F8D9AD" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 13"/>
      {/* house */}
      <path d="m244 180 60-49 70 37v107l-66 38-64-37V180Z" fill="url(#house)" stroke="#AC6C74" strokeWidth="4"/>
      <path d="m304 131 70 37 20-24-84-53-70 54 4 35 60-49Z" fill="url(#roof)" stroke="#9E5F78" strokeWidth="5" strokeLinejoin="round"/>
      <path d="m240 145 70-54 84 53" stroke="#FFC8AE" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="m310 132-4 180" stroke="#BC7978" strokeWidth="3"/>
      <path d="m328 254 27-15v44l-27 16v-45Z" fill="#64476E" stroke="#9F5E75" strokeWidth="3"/>
      <circle cx="348" cy="266" r="2" fill="#FFE8AC"/>
      <path d="m258 193 31-19v36l-31 18v-35Z" fill="#6FBDD0" stroke="#9B667C" strokeWidth="4"/><path d="m273 185 1 34" stroke="#FDE3BB" strokeWidth="3"/>
      <path d="m330 173 30-17v34l-30 18v-35Z" fill="#6FBDD0" stroke="#9B667C" strokeWidth="4"/><path d="m345 164 1 36" stroke="#FDE3BB" strokeWidth="3"/>
      <path d="m371 211 34-19v13l-34 18v-12Z" fill="#B86B82"/>
      <path d="M386 192v-53" stroke="#A66E79" strokeWidth="4"/><path d="m387 139 30 8-30 8v-16Z" fill="#FFD876"/>
      {/* trees and mushrooms */}
      <path d="M138 286v-48m0 27-18-14m18-5 17-13" stroke="#576D78" strokeWidth="8" strokeLinecap="round"/>
      <circle cx="137" cy="221" r="28" fill="#A6DC86"/><circle cx="116" cy="244" r="21" fill="#86CF88"/><circle cx="157" cy="243" r="22" fill="#7ACB90"/>
      <path d="M467 271v-62m0 42-20-16m20-12 15-16" stroke="#576D78" strokeWidth="9" strokeLinecap="round"/>
      <circle cx="467" cy="196" r="29" fill="#93D595"/><circle cx="446" cy="221" r="23" fill="#72C492"/><circle cx="486" cy="222" r="23" fill="#A3DB91"/>
      <path d="M452 319v-18" stroke="#F5DAB0" strokeWidth="7"/><path d="M435 301c1-24 36-30 39 0h-39Z" fill="#B378D7"/><circle cx="447" cy="294" r="3" fill="#FFE7FA"/><circle cx="461" cy="289" r="3" fill="#FFE7FA"/>
      <path d="M196 254v-15" stroke="#F5DAB0" strokeWidth="6"/><path d="M183 240c1-22 28-22 29 0h-29Z" fill="#F28F99"/><circle cx="192" cy="235" r="2" fill="#FFF0DB"/>
      {/* stepping markers */}
      <ellipse cx="178" cy="333" rx="25" ry="10" fill="#3E786F" opacity=".25"/><circle cx="178" cy="322" r="20" fill="#FFCD70" stroke="#FFF3C4" strokeWidth="5"/><path d="m173 322 4 4 7-8" stroke="#73516C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      <ellipse cx="267" cy="289" rx="20" ry="8" fill="#3E786F" opacity=".2"/><circle cx="267" cy="281" r="16" fill="#FFE9AC" stroke="#FFF8D8" strokeWidth="4"/><path d="m263 281 3 3 6-7" stroke="#8B677B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <ellipse cx="403" cy="212" rx="24" ry="8" fill="#3E786F" opacity=".2"/><circle cx="403" cy="201" r="21" fill="#8E75D9" stroke="#E5CBFF" strokeWidth="5"/><path d="m403 192 2.3 5.8 6 .5-4.6 3.9 1.5 5.7-5.2-3.3-5.2 3.3 1.5-5.7-4.6-3.9 6-.5z" fill="#FFDE85"/>
      {/* friendly little explorer */}
      <ellipse cx="335" cy="365" rx="28" ry="9" fill="#3F857D" opacity=".25"/>
      <path d="M315 344c0-15 9-26 22-26s23 11 23 26c0 13-10 20-23 20s-22-7-22-20Z" fill="#7461BA" stroke="#584D9E" strokeWidth="3"/>
      <path d="M320 325c-10-12-7-22-2-24 8-2 15 11 16 18m10 0c1-12 6-21 13-19 6 2 7 13-2 26" fill="#7461BA" stroke="#584D9E" strokeWidth="3"/>
      <ellipse cx="329" cy="339" rx="3.5" ry="4" fill="#25243F"/><ellipse cx="346" cy="339" rx="3.5" ry="4" fill="#25243F"/><path d="M332 349q6 6 12 0" stroke="#292744" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="320" cy="346" r="4" fill="#E993B7"/><circle cx="355" cy="346" r="4" fill="#E993B7"/>
      {/* foliage + sparkles */}
      <path d="M101 303c5-15 2-22-8-28m14 30c-1-19 7-27 15-31M491 327c4-17 13-23 23-27m-16 30c-2-14-8-20-17-23" stroke="#407F78" strokeWidth="5" strokeLinecap="round"/>
      <path d="m193 164 3 8 8 3-8 3-3 8-3-8-8-3 8-3 3-8ZM446 113l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z" fill="#FFE594"/>
      <circle cx="114" cy="183" r="4" fill="#FFC6A5"/><circle cx="496" cy="151" r="5" fill="#E9B9FC"/><circle cx="430" cy="356" r="4" fill="#FFE39B"/>
    </svg>
  );
}
