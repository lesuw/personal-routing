// Фоновая иллюстрация входа: лесной пейзаж в плоской графике,
// без карт и подписей мест.
export default function AuthPattern() {
  return (
    <svg
      className="pattern"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="authSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5d7c84" />
          <stop offset="0.6" stopColor="#8ba39a" />
          <stop offset="1" stopColor="#b9bfa1" />
        </linearGradient>
        <linearGradient id="authLake" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7fa0a1" />
          <stop offset="1" stopColor="#4d7278" />
        </linearGradient>
        <radialGradient id="authSun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#f3e6b0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#f3e6b0" stopOpacity="0" />
        </radialGradient>
        <g id="authPine">
          <rect x="-4" y="36" width="8" height="18" rx="2" fill="#3d3a2b" />
          <path d="M0 -50 L22 -4 L-22 -4 Z" fill="#2d4836" />
          <path d="M0 -22 L28 30 L-28 30 Z" fill="#243d2d" />
          <path d="M0 -38 L13 -11 L-13 -11 Z" fill="#36543e" opacity="0.55" />
        </g>
      </defs>

      <rect width="1440" height="900" fill="url(#authSky)" />

      {/* солнце и облака */}
      <circle cx="1085" cy="182" r="160" fill="url(#authSun)" />
      <circle cx="1085" cy="182" r="46" fill="#ece1b2" opacity="0.88" />
      <g fill="#d9ddc4" opacity="0.78">
        <ellipse cx="150" cy="158" rx="128" ry="27" />
        <ellipse cx="232" cy="136" rx="74" ry="25" />
        <ellipse cx="76" cy="140" rx="58" ry="20" />
        <ellipse cx="560" cy="104" rx="90" ry="18" />
        <ellipse cx="620" cy="88" rx="52" ry="16" />
        <ellipse cx="902" cy="200" rx="104" ry="20" />
        <ellipse cx="958" cy="183" rx="58" ry="16" />
        <ellipse cx="1322" cy="118" rx="104" ry="22" />
        <ellipse cx="1268" cy="100" rx="52" ry="15" />
      </g>

      {/* дальние горы и город */}
      <path d="M0 486 L168 296 L286 418 L398 312 L548 486 Z" fill="#657e76" />
      <path d="M150 486 L340 252 L498 486 Z" fill="#58716b" />
      <path d="M336 486 L470 322 L596 486 Z" fill="#6a8279" opacity="0.85" />
      <path d="M880 486 L1054 258 L1186 390 L1294 300 L1440 486 Z" fill="#5f7972" />
      <g fill="#4f6866" opacity="0.95">
        <rect x="1178" y="334" width="38" height="152" rx="2" />
        <rect x="1224" y="292" width="30" height="194" rx="2" />
        <rect x="1262" y="354" width="44" height="132" rx="2" />
        <rect x="1314" y="314" width="32" height="172" rx="2" />
        <rect x="1352" y="272" width="50" height="214" rx="2" />
        <rect x="1408" y="330" width="32" height="156" rx="2" />
      </g>

      {/* средние холмы */}
      <path
        d="M0 532 C170 472 300 512 476 482 C654 452 782 512 976 480 C1150 452 1300 500 1440 468 L1440 900 L0 900 Z"
        fill="#4b6747"
      />
      <path
        d="M0 612 C214 552 366 622 566 582 C764 542 908 612 1122 572 C1282 542 1362 580 1440 558 L1440 900 L0 900 Z"
        fill="#3d5b3e"
      />

      {/* озеро */}
      <path
        d="M0 570 C122 548 246 554 344 580 C438 604 522 614 544 644 C566 676 486 696 384 696 C224 696 82 672 0 646 Z"
        fill="url(#authLake)"
      />
      <path
        d="M34 612 C142 600 250 612 332 632 M78 646 C174 638 272 646 344 660"
        fill="none"
        stroke="#bacbc1"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.35"
      />
      <path
        d="M0 570 C122 548 246 554 344 580 C438 604 522 614 544 644"
        fill="none"
        stroke="#6f8a68"
        strokeWidth="4"
        opacity="0.55"
      />

      {/* тропинка */}
      <path
        d="M446 900 C 486 806 570 772 604 706 C 642 632 606 586 660 534 C 704 492 768 482 830 458"
        fill="none"
        stroke="#a89a70"
        strokeWidth="40"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M446 900 C 486 806 570 772 604 706 C 642 632 606 586 660 534 C 704 492 768 482 830 458"
        fill="none"
        stroke="#c2b383"
        strokeWidth="27"
        strokeLinecap="round"
      />

      {/* передний план */}
      <path
        d="M0 704 C202 652 404 724 622 682 C842 640 1042 712 1242 672 C1346 650 1404 666 1440 656 L1440 900 L0 900 Z"
        fill="#314e34"
      />
      <path
        d="M0 806 C192 754 372 812 570 776 C766 740 948 806 1128 772 C1250 749 1356 766 1440 748 L1440 900 L0 900 Z"
        fill="#29422e"
      />

      {/* деревья */}
      <g opacity="0.97">
        <use href="#authPine" transform="translate(70 512) scale(2.1)" />
        <use href="#authPine" transform="translate(142 548) scale(1.45)" />
        <use href="#authPine" transform="translate(210 506) scale(1.1)" />
        <use href="#authPine" transform="translate(292 544) scale(1.6)" />
        <use href="#authPine" transform="translate(366 510) scale(0.95)" />
        <use href="#authPine" transform="translate(492 528) scale(1.3)" />
        <use href="#authPine" transform="translate(560 492) scale(0.9)" />
        <use href="#authPine" transform="translate(646 512) scale(1.2)" />
        <use href="#authPine" transform="translate(716 480) scale(0.8)" />
        <use href="#authPine" transform="translate(780 520) scale(1.05)" />
        <use href="#authPine" transform="translate(880 500) scale(1.35)" />
        <use href="#authPine" transform="translate(962 468) scale(0.9)" />
        <use href="#authPine" transform="translate(1032 512) scale(1.5)" />
        <use href="#authPine" transform="translate(1116 486) scale(1.1)" />
        <use href="#authPine" transform="translate(1204 526) scale(1.7)" />
        <use href="#authPine" transform="translate(1290 492) scale(1.2)" />
        <use href="#authPine" transform="translate(1370 524) scale(1.85)" />
      </g>

      <g opacity="0.98">
        <use href="#authPine" transform="translate(40 762) scale(3.1)" />
        <use href="#authPine" transform="translate(130 806) scale(2.2)" />
        <use href="#authPine" transform="translate(1408 780) scale(3.4)" />
        <use href="#authPine" transform="translate(1318 824) scale(2.1)" />
        <use href="#authPine" transform="translate(1210 802) scale(1.5)" />
      </g>

      {/* камни на переднем плане */}
      <g fill="#46584c">
        <path d="M0 828 c46 -44 104 -48 148 -8 l22 80 -170 0 z" />
        <path d="M1246 894 c18 -66 76 -84 132 -38 l20 38 z" />
        <path d="M92 894 c10 -32 44 -38 68 -14 l12 14 z" fill="#3b4c42" />
      </g>

      {/* деликатная линия маршрута */}
      <path
        d="M300 772 C 414 714 500 664 602 632 S 754 548 822 474"
        fill="none"
        stroke="#ece7c6"
        strokeWidth="3"
        strokeDasharray="2 14"
        strokeLinecap="round"
        opacity="0.75"
      />
      <circle cx="300" cy="772" r="7" fill="#ece7c6" opacity="0.85" />
      <circle cx="822" cy="474" r="7" fill="#ece7c6" opacity="0.85" />

      {/* птицы */}
      <g fill="none" stroke="#415752" strokeWidth="2.4" strokeLinecap="round" opacity="0.65">
        <path d="M430 206 q14 -12 28 0 q14 -12 28 0" />
        <path d="M506 168 q10 -9 20 0 q10 -9 20 0" />
        <path d="M718 148 q12 -10 24 0 q12 -10 24 0" />
      </g>
    </svg>
  );
}
